-- ==========================================
-- OPTIMIZATION (INDEXES)
-- ==========================================

-- Performance indexes for foreign keys (essential for joins and filtering)
CREATE INDEX IF NOT EXISTS idx_pages_user_id ON public.pages(user_id);
CREATE INDEX IF NOT EXISTS idx_facebook_connections_user_id ON public.facebook_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_page_id ON public.scheduled_posts(page_id);
CREATE INDEX IF NOT EXISTS idx_posts_page_id ON public.posts(page_id);
CREATE INDEX IF NOT EXISTS idx_growth_strategies_user_id ON public.growth_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_strategies_page_id ON public.growth_strategies(page_id);
CREATE INDEX IF NOT EXISTS idx_ai_ideas_user_id ON public.ai_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_id ON public.page_analytics(page_id);
CREATE INDEX IF NOT EXISTS idx_page_stats_history_page_id ON public.page_stats_history(page_id);

-- Date based indexes for ordering
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON public.scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_posts_posted_at ON public.posts(posted_at);

-- ==========================================
-- SECURITY (ROW LEVEL SECURITY)
-- ==========================================

-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_stats_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies

-- USERS: Users can only see/edit their own profile
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- FACEBOOK CONNECTIONS: Ownership based
CREATE POLICY "Users can manage own connections" ON public.facebook_connections 
  USING (auth.uid() = user_id);

-- PAGES: Ownership based
CREATE POLICY "Users can manage own pages" ON public.pages 
  USING (auth.uid() = user_id);

-- SCHEDULED POSTS: Based on page ownership
CREATE POLICY "Users can manage own scheduled posts" ON public.scheduled_posts
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- POSTS: Based on page ownership
CREATE POLICY "Users can view own page posts" ON public.posts
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- GROWTH STRATEGIES: Ownership based
CREATE POLICY "Users can manage own growth strategies" ON public.growth_strategies
  USING (user_id = auth.uid());

-- AI IDEAS: Ownership based
CREATE POLICY "Users can manage own ai ideas" ON public.ai_ideas
  USING (user_id = auth.uid());

-- PAGE ANALYTICS: Based on page ownership
CREATE POLICY "Users can view own page analytics" ON public.page_analytics
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- PAGE STATS HISTORY: Based on page ownership
CREATE POLICY "Users can view own page history" ON public.page_stats_history
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- SUBSCRIPTIONS: Ownership based
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  USING (user_id = auth.uid());
