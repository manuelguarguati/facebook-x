'use server';

import { generateWithFallback } from '@/services/ai/ai.provider';
import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { revalidatePath } from 'next/cache';

export async function generateAndSchedule(formData: FormData) {
  const topic = formData.get('topic') as string;
  const pageId = formData.get('pageId') as string;

  const content = await generateWithFallback({
    topic,
    tone: 'professional'
  });

  const repo = new ScheduledPostRepository();
  await repo.scheduleNewPost({
    page_id: pageId,
    content,
    scheduled_for: new Date(Date.now() + 86400000).toISOString(),
    ai_generated: true
  });

  revalidatePath('/dashboard');
  return { success: true };
}
