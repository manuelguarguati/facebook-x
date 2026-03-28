-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- USERS
-- =========================
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  plan text DEFAULT 'free'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- FACEBOOK CONNECTIONS
-- =========================
CREATE TABLE public.facebook_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  facebook_user_id text,
  access_token text,
  token_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT facebook_connections_user_id_key UNIQUE (user_id)
);

-- =========================
-- PAGES
-- =========================
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  facebook_page_id text NOT NULL,
  page_name text,
  category text,
  connected boolean DEFAULT true,
  followers_count integer DEFAULT 0,
  fans_count integer DEFAULT 0,
  access_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT pages_facebook_page_id_user_id_key UNIQUE (facebook_page_id, user_id)
);

-- =========================
-- POSTS (FETCHED FROM FACEBOOK)
-- =========================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  facebook_post_id text UNIQUE,
  message text,
  media_url text,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  reach integer DEFAULT 0,
  posted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- SCHEDULED POSTS
-- =========================
CREATE TABLE public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  content text,
  media_url text,
  scheduled_for timestamptz NOT NULL,
  status text DEFAULT 'pending'::text, -- 'pending', 'published', 'failed'
  ai_generated boolean DEFAULT false,
  facebook_post_id text, -- ID of the post once published
  error_message text,   -- Log if publishing fails
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- GROWTH STRATEGIES
-- =========================
CREATE TABLE public.growth_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  niche text NOT NULL,
  style text NOT NULL,
  frequency text NOT NULL,
  duration_days integer NOT NULL,
  strategy_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- AI & CONTENT
-- =========================
CREATE TABLE public.ai_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  idea text,
  source text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  url text,
  image_url text,
  source text,
  published_at timestamptz,
  fetched_at timestamptz DEFAULT now()
);

CREATE TABLE public.generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.news_articles(id) ON DELETE SET NULL,
  caption text,
  hashtags text,
  status text DEFAULT 'draft'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  followers integer,
  engagement numeric,
  reach integer,
  date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.page_stats_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  followers_count integer NOT NULL DEFAULT 0,
  fans_count integer NOT NULL DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

CREATE TABLE public.ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  recommendation text,
  created_at timestamptz DEFAULT now()
);

-- =========================
-- SUBSCRIPTIONS
-- =========================
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  plan text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- FUNCTIONS & TRIGGERS
-- =========================

-- Trigger to update 'updated_at' automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to main tables
CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_updated_at_pages BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_updated_at_scheduled_posts BEFORE UPDATE ON public.scheduled_posts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_updated_at_growth_strategies BEFORE UPDATE ON public.growth_strategies FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_updated_at_facebook_connections BEFORE UPDATE ON public.facebook_connections FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
