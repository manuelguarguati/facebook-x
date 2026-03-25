'use server';

import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { PageRepository } from '@/repositories/page.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function schedulePost(formData: FormData) {
  const content = formData.get('content') as string;
  const scheduledAt = formData.get('scheduledAt') as string;
  const pageId = formData.get('pageId') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const repo = new ScheduledPostRepository();
  await repo.scheduleNewPost({
    page_id: pageId,
    content,
    scheduled_for: new Date(scheduledAt).toISOString()
  });

  revalidatePath('/dashboard/schedule');
  return { success: true };
}

export async function connectPage(formData: FormData) {
  const facebookPageId = formData.get('facebookPageId') as string;
  const pageName = formData.get('pageName') as string;
  const accessToken = formData.get('accessToken') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const repo = new PageRepository();
  const result = await repo.savePage({
    user_id: user.id,
    facebook_page_id: facebookPageId,
    page_name: pageName,
    access_token: accessToken,
    followers_count: 0,
    fans_count: 0
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to connect page');
  }

  revalidatePath('/dashboard/pages');
  revalidatePath('/dashboard/schedule');
  return { success: true };
}

export async function deletePage(id: string) {
  const repo = new PageRepository();
  await repo.deletePage(id);
  revalidatePath('/dashboard/pages');
  revalidatePath('/dashboard/schedule');
  return { success: true };
}
