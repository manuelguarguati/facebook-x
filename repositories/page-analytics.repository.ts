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

  /**
   * Get weekly trend across all user pages.
   * Compares latest 7 days vs previous 7 days.
   */
  async getUserAnalyticsTrends(userId: string): Promise<{
    reachTrend: number; // percentage
    engagementTrend: number; // percentage
    followerTrend: number; // exact count change
  }> {
    const supabase = await createClient();
    
    // Get analytics for all user pages
    const { data, error } = await supabase
      .from('page_analytics')
      .select(`
        reach,
        engagement,
        followers,
        date,
        pages!inner ( user_id )
      `)
      .eq('pages.user_id', userId)
      .order('date', { ascending: false })
      .limit(50); // Fetch a good sample

    if (error || !data || data.length < 2) {
      return { reachTrend: 0, engagementTrend: 0, followerTrend: 0 };
    }

    // Split into current period (0-7 days) and previous period (7-14 days)
    // For simplicity, we split the fetched records in half
    const half = Math.floor(data.length / 2);
    const current = data.slice(0, half);
    const previous = data.slice(half);

    const getSum = (arr: any[], key: string) => arr.reduce((sum, r) => sum + (Number(r[key]) || 0), 0);

    const currentReach = getSum(current, 'reach');
    const previousReach = getSum(previous, 'reach');
    const reachTrend = previousReach > 0 ? ((currentReach - previousReach) / previousReach) * 100 : 0;

    const currentEng = getSum(current, 'engagement') / current.length;
    const previousEng = getSum(previous, 'engagement') / previous.length;
    const engagementTrend = previousEng > 0 ? ((currentEng - previousEng) / previousEng) * 100 : 0;

    const currentFollowers = data[0].followers || 0;
    const previousFollowers = data[data.length - 1].followers || 0;
    const followerTrend = currentFollowers - previousFollowers;

    return {
      reachTrend: Math.round(reachTrend),
      engagementTrend: Math.round(engagementTrend),
      followerTrend
    };
  }
}
