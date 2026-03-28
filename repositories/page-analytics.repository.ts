import { createClient } from '@/lib/supabase/server';

// Matches public.page_analytics:
// id, page_id, followers, engagement, reach, date, created_at
export interface PageAnalytic {
  id: string;
  page_id: string;
  followers: number;
  engagement: number;
  reach: number;
  date: string;
  created_at: string;
}

export class PageAnalyticsRepository {
  /**
   * Get aggregated totals across all user pages:
   * - totalReach: sum of reach across all pages latest record
   * - avgEngagement: average engagement rate
   */
  async getUserAnalyticsSummary(userId: string): Promise<{
    totalReach: number;
    avgEngagement: number;
  }> {
    const supabase = await createClient();

    // Get all analytics for user's pages (latest per page)
    const { data, error } = await supabase
      .from('page_analytics')
      .select(`
        reach,
        engagement,
        pages!inner ( user_id )
      `)
      .eq('pages.user_id', userId)
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      return { totalReach: 0, avgEngagement: 0 };
    }

    const totalReach = data.reduce((sum, r) => sum + (r.reach || 0), 0);
    const avgEngagement =
      data.reduce((sum, r) => sum + (Number(r.engagement) || 0), 0) / data.length;

    return {
      totalReach,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
    };
  }

  /**
   * Record a fresh analytics snapshot for a page.
   */
  async recordAnalytics(data: {
    page_id: string;
    followers: number;
    engagement: number;
    reach: number;
    date: string;
  }): Promise<void> {
    const supabase = await createClient();
    await supabase.from('page_analytics').insert(data);
  }

  /**
   * Get analytics history for a single page (for charts).
   */
  async getPageHistory(pageId: string, limit: number = 30): Promise<PageAnalytic[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_analytics')
      .select('*')
      .eq('page_id', pageId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  }
}
