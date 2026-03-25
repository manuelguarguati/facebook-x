'use server';

import { generateWithFallback } from '@/services/ai/ai.provider';
import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function generateIdea(formData: FormData) {
  try {
    const topic = formData.get('topic') as string;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Inicia sesión para usar la IA' };

    const content = await generateWithFallback({ topic, tone: 'viral' });

    const repo = new AiIdeaRepository();
    await repo.saveIdea(user.id, topic, content);

    revalidatePath('/dashboard');
    return { success: true, content };
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return { success: false, error: error.message || 'Error al generar contenido' };
  }
}
