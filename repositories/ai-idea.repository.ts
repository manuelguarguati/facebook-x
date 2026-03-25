import { createClient } from '@/lib/supabase/server';

export interface AiIdea {
  id: string;
  user_id: string;
  idea: string;
  source: string;
  created_at: string;
}

export class AiIdeaRepository {
  async getRecentIdeas(limit: number = 3): Promise<AiIdea[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('ai_ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as AiIdea[];
  }

  async saveIdea(userId: string, idea: string, source: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('ai_ideas')
      .insert({
        user_id: userId,
        idea,
        source
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }
}
