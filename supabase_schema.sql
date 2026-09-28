-- ====================================================================
-- CRYPTOVA: Global Multilingual Cryptocurrency News & Market Intelligence
-- Supabase PostgreSQL Schema with Row Level Security (RLS) & Triggers
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles & Roles (RBAC for Admins and Public)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('superadmin', 'admin', 'editor', 'reader')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Sources (Approved RSS & API Sources)
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  rss_url TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL DEFAULT 'General',
  is_active BOOLEAN NOT NULL DEFAULT true,
  fetch_frequency_minutes INTEGER NOT NULL DEFAULT 15,
  last_fetched_at TIMESTAMPTZ,
  last_status TEXT DEFAULT 'idle',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  original_title TEXT NOT NULL,
  original_url TEXT NOT NULL UNIQUE,
  content_hash TEXT NOT NULL UNIQUE,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_logo TEXT,
  hero_image TEXT NOT NULL,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending', 'failed', 'archived')),
  view_count BIGINT NOT NULL DEFAULT 0,
  duplicate_sources JSONB DEFAULT '[]'::jsonb,
  affiliate_matches JSONB DEFAULT '[]'::jsonb,
  ad_campaign_id UUID,
  tags TEXT[] DEFAULT '{}',
  related_coins TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Article Translations (Multilingual: en, ar, bn, de, es, fr)
CREATE TABLE IF NOT EXISTS article_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'ar', 'bn', 'de', 'es', 'fr')),
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  editorial_content TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(article_id, language)
);

-- 6. Tags & Article Tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 7. Market Assets & Snapshots
CREATE TABLE IF NOT EXISTS market_assets (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_usd NUMERIC NOT NULL,
  change_24h NUMERIC NOT NULL DEFAULT 0,
  high_24h NUMERIC NOT NULL DEFAULT 0,
  low_24h NUMERIC NOT NULL DEFAULT 0,
  market_cap NUMERIC NOT NULL DEFAULT 0,
  volume_24h NUMERIC NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 999,
  sparkline JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS market_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  price_usd NUMERIC NOT NULL,
  volume_24h NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Affiliate Programs
CREATE TABLE IF NOT EXISTS affiliate_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  referral_url TEXT NOT NULL,
  referral_code TEXT,
  tracking_id TEXT,
  category TEXT NOT NULL DEFAULT 'Exchange',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  supported_countries TEXT[] DEFAULT '{}',
  supported_languages TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 10,
  max_links_per_article INTEGER NOT NULL DEFAULT 1,
  call_to_action TEXT NOT NULL DEFAULT 'Trade with verified security',
  clicks BIGINT NOT NULL DEFAULT 0,
  conversions BIGINT NOT NULL DEFAULT 0,
  estimated_revenue_usd NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Affiliate Clicks & Conversions
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_programs(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  country TEXT NOT NULL DEFAULT 'GLOBAL',
  language TEXT NOT NULL DEFAULT 'en',
  referrer TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_programs(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  amount_usd NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  external_tx_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Ad Campaigns (Banner Ads)
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  desktop_banner_url TEXT NOT NULL,
  mobile_banner_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  headline TEXT,
  sponsor_badge TEXT DEFAULT 'SPONSORED',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 10,
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  end_date TIMESTAMPTZ NOT NULL,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Automation Logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'success')),
  stage TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB
);

-- 12. Failed Articles Queue
CREATE TABLE IF NOT EXISTS failed_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  original_title TEXT NOT NULL,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  error_stage TEXT NOT NULL,
  error_message TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'en',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Indexes for High Performance Querying
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_content_hash ON articles(content_hash);
CREATE INDEX IF NOT EXISTS idx_translations_article_lang ON article_translations(article_id, language);
CREATE INDEX IF NOT EXISTS idx_translations_slug_lang ON article_translations(slug, language);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_active_priority ON ad_campaigns(is_active, priority DESC, end_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_symbol ON market_snapshots(symbol, recorded_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can read published articles & translations
CREATE POLICY "Public Read Published Articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public Read Published Translations" ON article_translations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_translations.article_id AND articles.status = 'published')
  );

CREATE POLICY "Public Read Sources" ON sources
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public Read Market Assets" ON market_assets
  FOR SELECT USING (true);

CREATE POLICY "Public Read Active Ads" ON ad_campaigns
  FOR SELECT USING (is_active = true AND end_date > now());

CREATE POLICY "Public Insert Newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Insert Affiliate Click" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

-- Admins full access
CREATE POLICY "Admin All Articles" ON articles FOR ALL USING (is_admin());
CREATE POLICY "Admin All Translations" ON article_translations FOR ALL USING (is_admin());
CREATE POLICY "Admin All Sources" ON sources FOR ALL USING (is_admin());
CREATE POLICY "Admin All Affiliates" ON affiliate_programs FOR ALL USING (is_admin());
CREATE POLICY "Admin All Ads" ON ad_campaigns FOR ALL USING (is_admin());
CREATE POLICY "Admin All Logs" ON automation_logs FOR ALL USING (is_admin());
CREATE POLICY "Admin All Settings" ON site_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin All Failed" ON failed_articles FOR ALL USING (is_admin());
