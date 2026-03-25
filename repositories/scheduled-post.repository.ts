import { createClient } from '@/lib/supabase/server';

export interface ScheduledPost {
  id: string;
  user_id: string;
  content: string;
  scheduled_at: string;
  platform_id?: string;
  created_at: string;
  status: 'pending' | 'published' | 'failed';
}

export class ScheduledPostRepository {
  async getUserPosts(userId: string, limit: number = 5): Promise<ScheduledPost[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (error) return [];
    return data || [];
  }

  async getPostCount(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('scheduled_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) return 0;
    return count || 0;
  }

  async createPost(userId: string, content: string, scheduledAt: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    
    // Server-side check is handled at the action level, but could be inserted here
    const { error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id: userId,
        content,
        scheduled_at: scheduledAt,
        status: 'pending'
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async scheduleNewPost(userId: string, content: string, platformId: string, scheduledAt: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id: userId,
        content,
        platform_id: platformId,
        scheduled_at: scheduledAt,
        status: 'pending'
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async getUserScheduledPosts(userId: string, limit: number = 20): Promise<ScheduledPost[]> {
    return this.getUserPosts(userId, limit);
  }
}
