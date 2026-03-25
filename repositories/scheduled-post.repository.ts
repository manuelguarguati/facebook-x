import { createClient } from '@/lib/supabase/server';

export interface ScheduledPost {
  id: string;
  page_id: string;
  content: string;
  media_url?: string;
  scheduled_for: string;
  status: 'pending' | 'published' | 'failed';
  ai_generated: boolean;
  created_at: string;
}

export class ScheduledPostRepository {
  async getPagePosts(pageId: string, limit: number = 20): Promise<ScheduledPost[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('page_id', pageId)
      .order('scheduled_for', { ascending: true })
      .limit(limit);

    if (error) return [];
    return data || [];
  }

  async getPostCount(pageId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('scheduled_posts')
      .select('*', { count: 'exact', head: true })
      .eq('page_id', pageId);

    if (error) return 0;
    return count || 0;
  }

  async scheduleNewPost(data: {
    page_id: string;
    content: string;
    scheduled_for: string;
    media_url?: string;
    ai_generated?: boolean;
  }): Promise<{ success: boolean; error?: string; data?: ScheduledPost }> {
    const supabase = await createClient();
    
    const { data: insertedData, error } = await supabase
      .from('scheduled_posts')
      .insert({
        ...data,
        status: 'pending'
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: insertedData };
  }
}
