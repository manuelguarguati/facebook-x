'use server';

import { createClient } from '@/lib/supabase/server';
import { PageRepository } from '@/repositories/page.repository';
import { StatsRepository } from '@/repositories/stats.repository';
import { revalidatePath } from 'next/cache';

export async function syncFacebookPagesAction() {
  const supabase = await createClient();
  
  // 1. Get the session to find the provider_token
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const session = sessionData?.session;
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
    // 1. Safely get the current user first
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
        console.error('[refreshSinglePageStats] Not authenticated');
        return;
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${facebookPageId}?access_token=${pageAccessToken}&fields=id,name,followers_count,fan_count`);
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[refreshSinglePageStats] Facebook API error:', errData);
        return;
    }

    const data = await response.json();
    const pageRepo = new PageRepository();
    const statsRepo = new StatsRepository();

    await pageRepo.savePage({
        user_id: user.id,
        facebook_page_id: facebookPageId,
        page_name: data.name || facebookPageId,
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

export async function connectManualPageAction(pageId: string, accessToken: string) {
    // Input validation
    if (!pageId?.trim() || !accessToken?.trim()) {
        throw new Error('ID de la página y Token de acceso son requeridos');
    }

    // 1. Safely get the current user
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) throw new Error('No autenticado. Por favor inicia sesión de nuevo.');

    // 2. Verify token with Facebook Graph API and get page details
    let fbApiResponse: Response;
    try {
        fbApiResponse = await fetch(
            `https://graph.facebook.com/v19.0/${pageId.trim()}?access_token=${accessToken.trim()}&fields=id,name,followers_count,fan_count`
        );
    } catch (networkError) {
        throw new Error('No se pudo conectar con Facebook. Comprueba tu conexión a internet.');
    }
    
    const fbResponseData = await fbApiResponse.json();
    
    if (!fbApiResponse.ok) {
        // Return the specific Facebook error message
        const fbErrorMsg = fbResponseData.error?.message || 'Error al conectar con la API de Facebook.';
        throw new Error(`Facebook: ${fbErrorMsg}`);
    }

    // Check if we got back a page, not an error object
    if (fbResponseData.error) {
        throw new Error(`Facebook: ${fbResponseData.error.message}`);
    }

    const fbPage = fbResponseData;
    const pageRepo = new PageRepository();
    const statsRepo = new StatsRepository();

    // 3. Save page to database
    const result = await pageRepo.savePage({
        user_id: user.id,
        facebook_page_id: fbPage.id,
        page_name: fbPage.name,
        access_token: accessToken.trim(),
        followers_count: fbPage.followers_count || 0,
        fans_count: fbPage.fan_count || 0,
    });

    if (!result.success) {
        throw new Error(`Error al guardar la página en la base de datos: ${result.error}`);
    }

    if (result.data) {
        // 4. Record initial stats snapshot
        await statsRepo.recordStats({
            page_id: result.data.id,
            followers_count: fbPage.followers_count || 0,
            fans_count: fbPage.fan_count || 0,
            recorded_at: new Date().toISOString()
        });
    }

    revalidatePath('/dashboard/pages');
    revalidatePath('/dashboard/schedule');

    return { success: true, name: fbPage.name };
}
