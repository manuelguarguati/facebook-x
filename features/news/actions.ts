'use server';

import { NewsService } from '@/services/news/news.service';
import { getAIProvider } from '@/services/ai/ai.provider';
import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function fetchNews(topic: string) {
  const newsService = new NewsService();
  return await newsService.fetchTrendingTopics(topic);
}

export async function transformNewsToPost(newsTitle: string, newsUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const ai = getAIProvider();
  const content = await ai.generateContent({ 
    topic: `Create an engaging social media post sharing this news: ${newsTitle}. Link: ${newsUrl}`,
    tone: 'informative' 
  });

  const repo = new AiIdeaRepository();
  await repo.saveIdea(user.id, `News: ${newsTitle}`, content);

  revalidatePath('/dashboard/news');
  return { success: true, content };
}
