import { createClient } from '@/lib/supabase/server';

// Matches public.posts schema:
// id, page_id, facebook_post_id, message, media_url, likes, comments, shares, reach, posted_at, created_at
export interface Post {
  id: string;
  page_id: string;
  facebook_post_id: string;
  message: string;
  media_url?: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  posted_at: string;
  created_at: string;
}

export class PostRepository {
  async getPagePosts(pageId: string, limit: number = 10): Promise<Post[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('page_id', pageId)
      .order('posted_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  }

  async getPostMetrics(postId: string): Promise<Post | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) return null;
    return data;
  }

  async savePostFromFacebook(postData: Partial<Post>): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('posts')
      .upsert(postData, { onConflict: 'facebook_post_id' });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  /**
   * Aggregates real published post stats for all user pages.
   * Returns total post count and combined engagement (likes + comments + shares).
   */
  async getUserPostStats(userId: string): Promise<{ totalPosts: number; totalEngagement: number }> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        likes,
        comments,
        shares,
        pages!inner ( user_id )
      `)
      .eq('pages.user_id', userId);

    if (error || !data) return { totalPosts: 0, totalEngagement: 0 };

    const totalPosts = data.length;
    const totalEngagement = data.reduce(
      (sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0),
      0
    );

    return { totalPosts, totalEngagement };
  }
}

