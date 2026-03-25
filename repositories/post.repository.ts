import { createClient } from '@/lib/supabase/server';

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
}
