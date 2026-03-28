import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from './DashboardContent';
import { UserRepository } from '@/repositories/user.repository';
import { PageRepository } from '@/repositories/page.repository';
import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { PostRepository } from '@/repositories/post.repository';
import { PageAnalyticsRepository } from '@/repositories/page-analytics.repository';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

    const [recentIdeas, profile] = await Promise.all([
    new AiIdeaRepository().getRecentIdeas(),
    user ? new UserRepository().getUserProfile(user.id) : null,
  ]);

  // Real stats from DB — all default to 0 if no pages connected yet
  let totalFollowers = 0;
  let totalFans = 0;
  let pageCount = 0;
  let pendingPosts = 0;
  let totalPublishedPosts = 0;
  let totalEngagement = 0;
  let totalReach = 0;
  let trends = { reachTrend: 0, engagementTrend: 0, followerTrend: 0 };
  let userPages: any[] = [];

  if (user) {
    const pageRepo = new PageRepository();
    const postRepo = new ScheduledPostRepository();
    const publishedRepo = new PostRepository();

    const [followers, fans, pages, postCounts, postStats, analyticsSummary, analyticsTrends] = await Promise.all([
      pageRepo.getTotalFollowers(user.id),
      pageRepo.getTotalFans(user.id),
      pageRepo.getUserPages(user.id),
      postRepo.getUserPostCounts(user.id),
      publishedRepo.getUserPostStats(user.id),
      new PageAnalyticsRepository().getUserAnalyticsSummary(user.id),
      new PageAnalyticsRepository().getUserAnalyticsTrends(user.id),
    ]);

    totalFollowers = followers;
    totalFans = fans;
    userPages = pages;
    pageCount = pages.length;
    pendingPosts = postCounts.pending;
    totalPublishedPosts = postStats.totalPosts;
    totalEngagement = postStats.totalEngagement;
    totalReach = analyticsSummary.totalReach;
    trends = analyticsTrends;
  }

  return (
    <DashboardContent
      userEmail={profile?.email || user?.email || 'User'}
      userName={profile?.name || user?.user_metadata?.name || 'User'}
      userAvatar={profile?.avatar_url || user?.user_metadata?.avatar_url}
      recentIdeas={recentIdeas}
      pages={userPages}
      stats={{
        totalFollowers,
        totalFans,
        pageCount,
        totalPublishedPosts,
        pendingPosts,
        totalEngagement,
        totalReach,
        trends,
      }}
    />
  );
}
