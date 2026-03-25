'use server';

import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function schedulePost(formData: FormData) {
  const content = formData.get('content') as string;
  const scheduledAt = formData.get('scheduledAt') as string;
  const platformId = formData.get('platformId') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const repo = new ScheduledPostRepository();
  await repo.scheduleNewPost(user.id, content, platformId, new Date(scheduledAt).toISOString());

  revalidatePath('/dashboard/schedule');
  return { success: true };
}
