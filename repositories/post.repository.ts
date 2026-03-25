import { createClient } from '@/lib/supabase/server';

export class PostRepository {
  async scheduleNewPost(post: any): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('posts').insert(post).select().single();
    if (error) throw new Error(`Database Error: ${error.message}`);
    return data;
  }

  async getDuePosts(): Promise<any[]> {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('posts')
      .select('*, pages(access_token, id)')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now);
    if (error) throw new Error(error.message);
    return data || [];
  }
  
  async updatePostStatus(id: string, status: string, platformId?: string, errorMsg?: string) {
    const supabase = await createClient();
    await supabase.from('posts').update({ status, platform_id: platformId, error_msg: errorMsg }).eq('id', id);
  }

  async getPostsForOverview(): Promise<any[]> {
    const supabase = await createClient();
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(10);
    return data || [];
  }
}
