export type SupportedLanguage = 'en' | 'ar' | 'bn' | 'de' | 'es' | 'fr';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇦🇪' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', flag: '🇧🇩' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
];

export interface ArticleTranslation {
  headline: string;
  summary: string;
  key_points: string[];
  editorial_content: string;
  seo_title: string;
  seo_description: string;
  slug: string;
}

export interface AffiliateInsertion {
  program_id: string;
  program_name: string;
  referral_url: string;
  disclosure: string;
  context_matched: string;
  call_to_action: string;
}

export interface Article {
  id: string;
  slug: string;
  category: 'Bitcoin' | 'Ethereum' | 'Altcoins' | 'DeFi' | 'Regulation' | 'Exchanges' | 'Market' | 'Web3';
  original_title: string;
  original_url: string;
  content_hash: string;
  source_id: string;
  source_name: string;
  source_url: string;
  source_logo?: string;
  published_at: string;
  updated_at: string;
  status: 'published' | 'pending' | 'failed' | 'archived';
  hero_image: string;
  is_breaking?: boolean;
  view_count: number;
  duplicate_sources?: { name: string; url: string }[];
  translations: Record<SupportedLanguage, ArticleTranslation>;
  affiliate_matches?: AffiliateInsertion[];
  ad_campaign_id?: string;
  tags: string[];
  related_coins: string[];
}

export interface RssSource {
  id: string;
  name: string;
  website_url: string;
  rss_url: string;
  logo_url: string;
  language: string;
  category: string;
  is_active: boolean;
  fetch_frequency_minutes: number;
  last_fetched_at?: string;
  last_status?: 'success' | 'error' | 'idle';
  error_message?: string;
}

export interface AffiliateProgram {
  id: string;
  program_name: string;
  company_name: string;
  referral_url: string;
  referral_code: string;
  tracking_id: string;
  category: string;
  keywords: string[];
  supported_countries: string[];
  supported_languages: string[];
  is_active: boolean;
  priority: number;
  max_links_per_article: number;
  call_to_action: string;
  clicks: number;
  conversions: number;
  estimated_revenue_usd: number;
}

export interface AffiliateClick {
  id: string;
  affiliate_id: string;
  program_name: string;
  article_id?: string;
  timestamp: string;
  country: string;
  language: SupportedLanguage;
  referrer?: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  desktop_banner_url: string;
  mobile_banner_url: string;
  target_url: string;
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  headline?: string;
  sponsor_badge?: string;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  price_usd: number;
  change_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  volume_24h: number;
  rank: number;
  sparkline: number[];
  last_updated: string;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  stage: 'fetch' | 'duplicate_check' | 'ai_editor' | 'translation' | 'affiliate' | 'publish' | 'cleanup';
  message: string;
  details?: Record<string, unknown>;
}

export interface SiteSettings {
  retention_days: number;
  automation_paused: boolean;
  fetch_interval_minutes: number;
  affiliate_disclosure: Record<SupportedLanguage, string>;
  banner_ads_enabled: boolean;
  ai_model: string;
  site_name: string;
  site_description: string;
  contact_email: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  language: SupportedLanguage;
}

export interface SetupStatus {
  supabase: { connected: boolean; error?: string; host?: string };
  auth: { configured: boolean; adminExists: boolean; googleOauthReady: boolean };
  gemini: { connected: boolean; model: string };
  sources: { count: number; active: number };
  marketApi: { connected: boolean; assetCount: number; provider: string };
  affiliates: { count: number; active: number };
  ads: { count: number; active: number };
  seo: { configured: boolean; sitemapUrl: string };
  automation: { running: boolean; lastRun?: string; nextRun?: string; articlesToday: number };
}
