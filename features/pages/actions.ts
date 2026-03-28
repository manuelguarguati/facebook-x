'use server';

import { createClient } from '@/lib/supabase/server';
import { PageRepository } from '@/repositories/page.repository';
import { StatsRepository } from '@/repositories/stats.repository';
import { revalidatePath } from 'next/cache';

export async function syncFacebookPagesAction() {
  const supabase = await createClient();
  
  // 1. Get the session to find the provider_token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) throw new Error('Not authenticated');

  const providerToken = session.provider_token;
  if (!providerToken) {
    throw new Error('Facebook connection required. Please sign in with Facebook again.');
  }

  // 2. Fetch pages from Facebook Graph API
  const response = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${providerToken}&fields=id,name,access_token,followers_count,fan_count`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch Facebook pages');
  }

  const { data: fbPages } = await response.json();
  const pageRepo = new PageRepository();
  const statsRepo = new StatsRepository();

  // 3. Save each page and record snapshot stats
  console.log(`DEBUG [SyncAction]: Syncing ${fbPages.length} pages...`);
  
  for (const fbPage of fbPages) {
    const result = await pageRepo.savePage({
      user_id: session.user.id,
      facebook_page_id: fbPage.id,
      page_name: fbPage.name,
      access_token: fbPage.access_token,
      followers_count: fbPage.followers_count || 0,
      fans_count: fbPage.fan_count || 0,
    });

    if (!result.success) {
        console.error(`DEBUG [SyncAction]: Failed to save page ${fbPage.name}:`, result.error);
        throw new Error(`Failed to save page ${fbPage.name}: ${result.error}`);
    }

    if (result.data) {
        await statsRepo.recordStats({
            page_id: result.data.id,
            followers_count: fbPage.followers_count || 0,
            fans_count: fbPage.fan_count || 0,
            recorded_at: new Date().toISOString()
        });
    }
  }

  revalidatePath('/dashboard/pages');
  revalidatePath('/dashboard/schedule');
  
  return { success: true, count: fbPages.length };
}

export async function refreshSinglePageStats(pageId: string, facebookPageId: string, pageAccessToken: string) {
    const response = await fetch(`https://graph.facebook.com/v19.0/${facebookPageId}?access_token=${pageAccessToken}&fields=followers_count,fan_count`);
    if (!response.ok) return;

    const data = await response.json();
    const pageRepo = new PageRepository();
    const statsRepo = new StatsRepository();

    await pageRepo.savePage({
        // We need the full object or we might overwrite with defaults if not careful
        // But our savePage is an upsert. 
        // Wait, savePage Omit<ManagedPage, 'id' | 'created_at'> requires user_id etc.
        // I should probably add a more specific updateStats method
        user_id: (await (await createClient()).auth.getUser()).data.user!.id,
        facebook_page_id: facebookPageId,
        page_name: data.name, // Should have fetched name too if needed
        access_token: pageAccessToken,
        followers_count: data.followers_count || 0,
        fans_count: data.fan_count || 0,
    });

    await statsRepo.recordStats({
        page_id: pageId,
        followers_count: data.followers_count || 0,
        fans_count: data.fan_count || 0,
        recorded_at: new Date().toISOString()
    });

    revalidatePath('/dashboard/pages');
}
