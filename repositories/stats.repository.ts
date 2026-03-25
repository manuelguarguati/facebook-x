import { createClient } from '@/lib/supabase/server';

export interface PageStatHistory {
  id: string;
  page_id: string;
  followers_count: number;
  fans_count: number;
  recorded_at: string;
}

export class StatsRepository {
  async getPageHistory(pageId: string): Promise<PageStatHistory[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_stats_history')
      .select('*')
      .eq('page_id', pageId)
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('Error fetching page stats history:', error);
      return [];
    }
    return data || [];
  }

  async recordStats(data: Omit<PageStatHistory, 'id'>): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('page_stats_history')
      .insert(data);
  }

  async getFollowersLost(pageId: string, days: number = 7): Promise<number> {
    const supabase = await createClient();
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const { data, error } = await supabase
      .from('page_stats_history')
      .select('followers_count, fans_count')
      .eq('page_id', pageId)
      .gte('recorded_at', dateLimit.toISOString())
      .order('recorded_at', { ascending: true });

    if (error || !data || data.length < 2) return 0;

    const oldest = data[0].followers_count;
    const newest = data[data.length - 1].followers_count;
    
    // If it decreased, return the difference as a positive number
    return Math.max(0, oldest - newest);
  }
}
