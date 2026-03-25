-- EXTENSIONES NECESARIAS
create extension if not exists "pgcrypto";

-- =========================
-- USERS
-- =========================
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  avatar_url text,
  plan text default 'free',
  created_at timestamp default now()
);

-- =========================
-- FACEBOOK CONNECTIONS
-- =========================
create table facebook_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  facebook_user_id text,
  access_token text,
  token_expires_at timestamp,
  created_at timestamp default now()
);

-- =========================
-- PAGES
-- =========================
create table pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  facebook_page_id text,
  page_name text,
  followers integer default 0,
  category text,
  connected boolean default true,
  created_at timestamp default now()
);

-- =========================
-- POSTS (TRAIDOS DE FACEBOOK)
-- =========================
create table posts (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  facebook_post_id text,
  message text,
  media_url text,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  reach integer default 0,
  posted_at timestamp,
  created_at timestamp default now()
);

-- =========================
-- POSTS PROGRAMADOS
-- =========================
create table scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  content text,
  media_url text,
  scheduled_for timestamp,
  status text default 'pending',
  ai_generated boolean default false,
  created_at timestamp default now()
);

-- =========================
-- IDEAS IA
-- =========================
create table ai_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  idea text,
  source text,
  created_at timestamp default now()
);

-- =========================
-- NEWS ARTICLES
-- =========================
create table news_articles (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  url text,
  image_url text,
  source text,
  published_at timestamp,
  fetched_at timestamp default now()
);

-- =========================
-- GENERATED CONTENT FROM NEWS
-- =========================
create table generated_content (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  article_id uuid references news_articles(id),
  caption text,
  hashtags text,
  status text default 'draft',
  created_at timestamp default now()
);

-- =========================
-- PAGE ANALYTICS
-- =========================
create table page_analytics (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id),
  followers integer,
  engagement numeric,
  reach integer,
  date date,
  created_at timestamp default now()
);

-- =========================
-- AI RECOMMENDATIONS
-- =========================
create table ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  page_id uuid references pages(id),
  recommendation text,
  created_at timestamp default now()
);

-- =========================
-- SUBSCRIPTIONS
-- =========================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  plan text,
  status text,
  current_period_end timestamp,
  created_at timestamp default now()
);
