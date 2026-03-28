import { createClient } from '@/lib/supabase/server';

export interface ManagedPage {
  id: string;
  user_id: string;
  facebook_page_id: string;
  page_name: string;
  access_token: string;
  followers_count: number;
  fans_count: number;
  created_at?: string;
  updated_at?: string;
}

export class PageRepository {
  async getUserPages(userId: string): Promise<ManagedPage[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', userId)
      .order('page_name', { ascending: true });

    if (error) {
      console.error('Error fetching user pages:', error);
      return [];
    }
    return data || [];
  }

  async savePage(data: Omit<ManagedPage, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string; data?: ManagedPage }> {
    const supabase = await createClient();
    
    // Use upsert based on facebook_page_id and user_id to avoid duplicates
    const { data: insertedData, error } = await supabase
      .from('pages')
      .upsert({
        ...data
      }, { onConflict: 'facebook_page_id,user_id' })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: insertedData as ManagedPage };
  }

  async deletePage(id: string): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('pages')
      .delete()
      .eq('id', id);
  }

  async getTotalFollowers(userId: string): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('followers_count')
      .eq('user_id', userId);

    if (error || !data) return 0;
    return data.reduce((sum, p) => sum + (p.followers_count || 0), 0);
  }

  async getTotalFans(userId: string): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('fans_count')
      .eq('user_id', userId);

    if (error || !data) return 0;
    return data.reduce((sum, p) => sum + (p.fans_count || 0), 0);
  }

  async getPageCount(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('pages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) return 0;
    return count || 0;
  }
}
