import { createClient } from '@/lib/supabase/server';

export class ScheduledPostRepository {
  async scheduleNewPost(userId: string, content: string, platformId: string, scheduledAt: string): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id: userId,
        content,
        platform_id: platformId,
        status: 'scheduled',
        scheduled_at: scheduledAt,
      })
      .select()
      .single();
      
    if (error) throw new Error(`DB Error: ${error.message}`);
    return data;
  }

  async getUserScheduledPosts(userId: string): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });
      
    if (error) throw new Error(error.message);
    return data || [];
  }
}
