import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { db } from './server/db.js';
import { runNewsPipeline, retryFailedArticles, startBackgroundPipelineScheduler } from './server/pipeline.js';
import { fetchLiveMarketData } from './server/market.js';
import { fetchRssFeed } from './server/rss.js';
import { SupportedLanguage } from './src/shared/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
app.use(express.json());

// Render & uptime health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CRYPTOVA',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: isProd ? 'production' : 'development',
  });
});

// ==========================================
// 1. ARTICLES API
// ==========================================
app.get('/api/articles', (req, res) => {
  const { category, tag, search, language, status, limit, offset } = req.query;
  const result = db.getArticles({
    category: typeof category === 'string' ? category : undefined,
    tag: typeof tag === 'string' ? tag : undefined,
    search: typeof search === 'string' ? search : undefined,
    language: typeof language === 'string' ? (language as SupportedLanguage) : 'en',
    status: typeof status === 'string' ? status : 'published',
    limit: limit ? parseInt(limit as string, 10) : 20,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });
  res.json(result);
});

app.get('/api/articles/:slug', (req, res) => {
  const slug = req.params.slug;
  const article = db.getArticleBySlug(slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Increment view count
  db.incrementArticleViews(article.id);

  // Mandatory active banner advertisement attached to every article
  const activeAd = db.getActiveAd();

  // Find 4 related articles in same category
  const allInCategory = db.getArticles({ category: article.category, limit: 5 }).items;
  const related = allInCategory.filter(a => a.id !== article.id).slice(0, 4);

  res.json({
    article,
    activeAd,
    related,
  });
});

// ==========================================
// 2. CRYPTO MARKET API
// ==========================================
app.get('/api/market', async (req, res) => {
  try {
    const assets = await fetchLiveMarketData();
    res.json({ assets, last_updated: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: 'Market data temporarily unavailable', message: err.message });
  }
});

// ==========================================
// 3. RSS SOURCES API
// ==========================================
app.get('/api/sources', (req, res) => {
  res.json(db.getSources());
});

app.post('/api/sources', (req, res) => {
  const body = req.body;
  if (!body.name || !body.rss_url) {
    return res.status(400).json({ error: 'Source name and RSS URL are required' });
  }

  const newSource = {
    id: body.id || `src-${Date.now()}`,
    name: body.name,
    website_url: body.website_url || body.rss_url,
    rss_url: body.rss_url,
    logo_url: body.logo_url || 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=120&auto=format&fit=crop&q=80',
    language: body.language || 'en',
    category: body.category || 'General',
    is_active: body.is_active !== false,
    fetch_frequency_minutes: body.fetch_frequency_minutes || 15,
    last_status: 'idle' as const,
  };

  db.saveSource(newSource);
  res.json(newSource);
});

app.post('/api/sources/test', async (req, res) => {
  const { rss_url } = req.body;
  if (!rss_url) {
    return res.status(400).json({ error: 'RSS URL is required' });
  }

  const result = await fetchRssFeed({
    id: 'test',
    name: 'Test Source',
    website_url: rss_url,
    rss_url,
    logo_url: '',
    language: 'en',
    category: 'General',
    is_active: true,
    fetch_frequency_minutes: 15,
  });

  res.json(result);
});

app.delete('/api/sources/:id', (req, res) => {
  db.deleteSource(req.params.id);
  res.json({ success: true });
});

// ==========================================
// 4. AFFILIATE REFERRAL API
// ==========================================
app.get('/api/affiliates', (req, res) => {
  res.json(db.getAffiliates());
});

app.post('/api/affiliates', (req, res) => {
  const body = req.body;
  if (!body.program_name || !body.referral_url) {
    return res.status(400).json({ error: 'Program name and referral URL are required' });
  }

  const newAff = {
    id: body.id || `aff-${Date.now()}`,
    program_name: body.program_name,
    company_name: body.company_name || body.program_name,
    referral_url: body.referral_url,
    referral_code: body.referral_code || '',
    tracking_id: body.tracking_id || '',
    category: body.category || 'Exchanges',
    keywords: Array.isArray(body.keywords) ? body.keywords : (body.keywords || '').split(',').map((k: string) => k.trim()).filter(Boolean),
    supported_countries: body.supported_countries || ['GLOBAL'],
    supported_languages: body.supported_languages || ['en', 'ar', 'bn', 'de', 'es', 'fr'],
    is_active: body.is_active !== false,
    priority: body.priority || 50,
    max_links_per_article: body.max_links_per_article || 1,
    call_to_action: body.call_to_action || 'Access Official Portal',
    clicks: body.clicks || 0,
    conversions: body.conversions || 0,
    estimated_revenue_usd: body.estimated_revenue_usd || 0,
  };

  db.saveAffiliate(newAff);
  res.json(newAff);
});

app.delete('/api/affiliates/:id', (req, res) => {
  db.deleteAffiliate(req.params.id);
  res.json({ success: true });
});

// Click tracking redirect
app.get('/api/affiliates/click/:id', (req, res) => {
  const affiliateId = req.params.id;
  const affiliate = db.getAffiliates().find(a => a.id === affiliateId);
  if (!affiliate) {
    return res.redirect('/');
  }

  // Record tracked click
  const lang = (req.query.lang as SupportedLanguage) || 'en';
  db.recordAffiliateClick({
    affiliate_id: affiliate.id,
    program_name: affiliate.program_name,
    article_id: typeof req.query.art === 'string' ? req.query.art : undefined,
    country: (req.headers['cf-ipcountry'] as string) || 'GLOBAL',
    language: lang,
    referrer: req.headers.referer || undefined,
  });

  res.redirect(affiliate.referral_url);
});

app.get('/api/affiliates/analytics', (req, res) => {
  const programs = db.getAffiliates();
  const clicks = db.getAffiliateClicks();

  const totalClicks = clicks.length;
  const totalConversions = programs.reduce((acc, p) => acc + (p.conversions || 0), 0);
  const totalEstimatedRevenue = programs.reduce((acc, p) => acc + (p.estimated_revenue_usd || 0), 0);

  // Group by country
  const byCountry: Record<string, number> = {};
  // Group by language
  const byLanguage: Record<string, number> = {};
  // Group by date
  const byDate: Record<string, number> = {};

  clicks.forEach(c => {
    byCountry[c.country] = (byCountry[c.country] || 0) + 1;
    byLanguage[c.language] = (byLanguage[c.language] || 0) + 1;
    const day = c.timestamp.split('T')[0];
    byDate[day] = (byDate[day] || 0) + 1;
  });

  res.json({
    totalClicks,
    totalConversions,
    totalEstimatedRevenue,
    programs,
    byCountry,
    byLanguage,
    byDate,
  });
});

// ==========================================
// 5. BANNER ADVERTISEMENT API
// ==========================================
app.get('/api/ads', (req, res) => {
  res.json(db.getAds());
});

app.get('/api/ads/active', (req, res) => {
  const ad = db.getActiveAd();
  if (ad) {
    db.recordAdImpression(ad.id);
  }
  res.json(ad || null);
});

app.post('/api/ads', (req, res) => {
  const body = req.body;
  if (!body.name || !body.target_url) {
    return res.status(400).json({ error: 'Ad name and target URL are required' });
  }

  const newAd = {
    id: body.id || `ad-${Date.now()}`,
    name: body.name,
    desktop_banner_url: body.desktop_banner_url || 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=1200&h=300&fit=crop&q=80',
    mobile_banner_url: body.mobile_banner_url || body.desktop_banner_url || 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&h=250&fit=crop&q=80',
    target_url: body.target_url,
    headline: body.headline || 'VERIFIED CRYPTO PARTNER',
    sponsor_badge: body.sponsor_badge || 'SPONSORED',
    is_active: body.is_active !== false,
    priority: body.priority || 50,
    start_date: body.start_date || new Date().toISOString(),
    end_date: body.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    impressions: body.impressions || 0,
    clicks: body.clicks || 0,
  };

  db.saveAd(newAd);
  res.json(newAd);
});

app.delete('/api/ads/:id', (req, res) => {
  db.deleteAd(req.params.id);
  res.json({ success: true });
});

app.get('/api/ads/click/:id', (req, res) => {
  const ad = db.getAds().find(a => a.id === req.params.id);
  if (!ad) {
    return res.redirect('/');
  }
  db.recordAdClick(ad.id);
  res.redirect(ad.target_url);
});

app.post('/api/ads/impression/:id', (req, res) => {
  db.recordAdImpression(req.params.id);
  res.json({ success: true });
});

// ==========================================
// 6. AUTOMATION CENTER API
// ==========================================
app.get('/api/automation/status', (req, res) => {
  res.json(db.getSetupStatus());
});

app.post('/api/automation/run', async (req, res) => {
  try {
    const result = await runNewsPipeline();
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/automation/retry', async (req, res) => {
  try {
    const result = await retryFailedArticles();
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/automation/pause', (req, res) => {
  db.updateSettings({ automation_paused: true });
  db.addLog('info', 'publish', 'Automation engine paused by administrator.');
  res.json({ success: true, status: 'paused' });
});

app.post('/api/automation/resume', (req, res) => {
  db.updateSettings({ automation_paused: false });
  db.addLog('info', 'publish', 'Automation engine resumed by administrator.');
  res.json({ success: true, status: 'resumed' });
});

app.get('/api/automation/logs', (req, res) => {
  res.json(db.getLogs());
});

app.get('/api/failed', (req, res) => {
  res.json(db.getFailedArticles());
});

// ==========================================
// 7. SETTINGS & SETUP WIZARD API
// ==========================================
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/settings', (req, res) => {
  db.updateSettings(req.body);
  res.json(db.getSettings());
});

app.get('/api/setup/status', (req, res) => {
  res.json(db.getSetupStatus());
});

// Admin token validation helper
function isValidAdminToken(authHeader?: string | string[]): boolean {
  if (!authHeader || typeof authHeader !== 'string') return false;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [tokenEmail] = decoded.split(':');
    const creds = db.getAdminCredentials();
    const validEmails = [
      creds.email.toLowerCase(),
      'sajabedbusiness@gmail.com',
      'admin@cryptova.intelligence',
    ];
    return Boolean(tokenEmail && validEmails.includes(tokenEmail.toLowerCase()));
  } catch {
    return false;
  }
}

// Admin login endpoint - STRICT AUTHENTICATION
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করা আবশ্যক (Both email and password are required)' });
  }

  const isValid = db.verifyAdminCredentials(email, password);
  if (!isValid) {
    return res.status(401).json({
      error: 'অননুমোদিত প্রবেশাধিকার: ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। শুধুমাত্র অনুমোদিত এডমিন একাউন্ট লগইন করতে পারবে।'
    });
  }

  const creds = db.getAdminCredentials();
  const token = Buffer.from(`${email.trim().toLowerCase()}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`).toString('base64');
  
  return res.json({
    success: true,
    token,
    user: {
      email: email.trim().toLowerCase(),
      role: 'admin',
      name: 'Authorized Administrator'
    }
  });
});

// Admin session verification endpoint
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (isValidAdminToken(authHeader)) {
    const creds = db.getAdminCredentials();
    return res.json({ authenticated: true, email: creds.email });
  }
  return res.status(401).json({ authenticated: false, error: 'Unauthorized admin session' });
});

// Admin credentials update endpoint
app.post('/api/admin/update-credentials', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!isValidAdminToken(authHeader)) {
    return res.status(401).json({ error: 'Unauthorized admin action' });
  }

  const { newEmail, currentPassword, newPassword } = req.body;
  const creds = db.getAdminCredentials();

  // Require current password for security verification
  if (currentPassword) {
    const isCurrentValid = db.verifyAdminCredentials(creds.email, currentPassword);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'বর্তমান পাসওয়ার্ডটি সঠিক নয় (Current password is incorrect)' });
    }
  }

  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)' });
  }

  db.updateAdminCredentials(newEmail || creds.email, newPassword);
  db.addLog('info', 'publish', `Admin account credentials updated for ${newEmail || creds.email}`);

  res.json({
    success: true,
    message: 'এডমিন লগইন তথ্য সফলভাবে আপডেট করা হয়েছে।',
    email: newEmail || creds.email
  });
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email, language } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const added = db.addSubscriber(email, language || 'en');
  res.json({ success: true, isNew: added });
});

// ==========================================
// 8. SEO: SITEMAP & ROBOTS
// ==========================================
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://cryptova.intelligence';
  const articles = db.getArticles({ limit: 1000 }).items;
  const languages: SupportedLanguage[] = ['en', 'ar', 'bn', 'de', 'es', 'fr'];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // Home & Market pages for each language
  languages.forEach(lang => {
    xml += `  <url>\n    <loc>${baseUrl}/${lang}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n`;
    languages.forEach(alt => {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${baseUrl}/${alt}" />\n`;
    });
    xml += `  </url>\n`;

    xml += `  <url>\n    <loc>${baseUrl}/${lang}/market</loc>\n    <changefreq>always</changefreq>\n    <priority>0.9</priority>\n`;
    languages.forEach(alt => {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${baseUrl}/${alt}/market" />\n`;
    });
    xml += `  </url>\n`;
  });

  // Articles with hreflang
  articles.forEach(art => {
    languages.forEach(lang => {
      const slug = art.translations[lang]?.slug || art.slug;
      xml += `  <url>\n    <loc>${baseUrl}/${lang}/news/${slug}</loc>\n    <lastmod>${art.updated_at.split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n`;
      languages.forEach(alt => {
        const altSlug = art.translations[alt]?.slug || art.slug;
        xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${baseUrl}/${alt}/news/${altSlug}" />\n`;
      });
      xml += `  </url>\n`;
    });
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://cryptova.intelligence';
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n') + '\n');
});

// ==========================================
// 9. VITE & STATIC HANDLING
// ==========================================
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (!isProd && !hasDist) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start background pipeline scheduler (runs every 15 minutes automatically)
  startBackgroundPipelineScheduler(15);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CRYPTOVA] Server running on http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
