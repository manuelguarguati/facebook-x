'use server';

import { getAIProvider } from '@/services/ai/ai.provider';
import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function generateIdea(formData: FormData) {
  const topic = formData.get('topic') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const ai = getAIProvider();
  const content = await ai.generateContent({ topic, tone: 'viral' });

  const repo = new AiIdeaRepository();
  await repo.saveIdea(user.id, topic, content);

  revalidatePath('/dashboard');
  return { success: true, content };
}
