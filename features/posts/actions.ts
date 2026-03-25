'use server';

import { getAIProvider } from '@/services/ai/ai.provider';
import { PostRepository } from '@/repositories/post.repository';
import { revalidatePath } from 'next/cache';

export async function generateAndSchedule(formData: FormData) {
  const topic = formData.get('topic') as string;
  const pageId = formData.get('pageId') as string;

  const ai = getAIProvider();
  const content = await ai.generateContent({
    topic,
    tone: 'professional'
  });

  const repo = new PostRepository();
  await repo.scheduleNewPost({
    page_id: pageId,
    content,
    status: 'scheduled',
    scheduled_at: new Date(Date.now() + 86400000).toISOString()
  });

  revalidatePath('/dashboard');
  return { success: true };
}
