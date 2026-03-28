import { createClient } from '@/lib/supabase/server';

export interface ScheduledPost {
  id: string;
  page_id: string;
  content: string;
  media_url?: string;
  scheduled_for: string;
  status: 'pending' | 'published' | 'failed';
  ai_generated: boolean;
  facebook_post_id?: string; // ID of the post after publication
  error_message?: string;   // Log if publication fails
  created_at: string;
  updated_at?: string;
  // Joined relation (not a real column)
  pages?: {
    facebook_page_id: string;
    access_token?: string;
  };
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

  async getUserPostCounts(userId: string): Promise<{ total: number; pending: number; published: number }> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        status,
        pages!inner ( user_id )
      `)
      .eq('pages.user_id', userId);

    if (error || !data) return { total: 0, pending: 0, published: 0 };

    const total = data.length;
    const pending = data.filter(p => p.status === 'pending').length;
    const published = data.filter(p => p.status === 'published').length;

    return { total, pending, published };
  }

  async scheduleNewPost(data: {
    page_id: string;
    content: string;
    scheduled_for: string;
    media_url?: string;
    ai_generated?: boolean;
    status?: 'pending' | 'published' | 'failed';
    facebook_post_id?: string;
  }): Promise<{ success: boolean; error?: string; data?: ScheduledPost }> {
    const supabase = await createClient();

    const { data: insertedData, error } = await supabase
      .from('scheduled_posts')
      .insert({
        ...data,
        status: data.status || 'pending'
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: insertedData };
  }

  async getUserScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        pages!inner (
          user_id
        )
      `)
      .eq('pages.user_id', userId)
      .order('scheduled_for', { ascending: true });

    if (error) return [];
    return data || [];
  }

  async getDuePosts(): Promise<ScheduledPost[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        pages (
          facebook_page_id,
          access_token
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString());

    if (error) return [];
    return data || [];
  }

  async updatePostStatus(
    id: string, 
    status: 'published' | 'failed', 
    metadata?: { facebook_post_id?: string; error_message?: string }
  ): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('scheduled_posts')
      .update({ 
        status,
        ...metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  }
}
