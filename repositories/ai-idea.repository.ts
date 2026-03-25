import { createClient } from '@/lib/supabase/server';

export class AiIdeaRepository {
  async saveIdea(userId: string, topic: string, generatedContent: string): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ai_ideas')
      .insert({
        user_id: userId,
        topic,
        content: generatedContent,
      })
      .select()
      .single();
      
    if (error) throw new Error(`DB Error: ${error.message}`);
    return data;
  }

  async getRecentIdeas(): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ai_ideas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) throw new Error(error.message);
    return data || [];
  }
}
