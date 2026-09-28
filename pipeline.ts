import { db } from './db.js';
import { fetchRssFeed } from './rss.js';
import { processArticleWithAI } from './gemini.js';
import { matchAndInsertAffiliates } from './affiliate.js';
import { Article } from '../src/shared/types.js';

let isRunning = false;
let intervalHandle: NodeJS.Timeout | null = null;

const HERO_IMAGES_FALLBACK = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
];

export async function runNewsPipeline(): Promise<{
  processed: number;
  published: number;
  duplicates: number;
  failed: number;
}> {
  const settings = db.getSettings();
  if (settings.automation_paused) {
    db.addLog('info', 'fetch', 'Automation is currently paused by administrator.');
    return { processed: 0, published: 0, duplicates: 0, failed: 0 };
  }

  if (isRunning) {
    db.addLog('info', 'fetch', 'News pipeline is already in execution. Skipping concurrent cycle.');
    return { processed: 0, published: 0, duplicates: 0, failed: 0 };
  }

  isRunning = true;
  let processed = 0;
  let published = 0;
  let duplicates = 0;
  let failed = 0;

  try {
    db.addLog('info', 'fetch', 'Starting automated global news collection across approved RSS feeds...');
    const sources = db.getSources().filter(s => s.is_active);

    for (const source of sources) {
      db.addLog('info', 'fetch', `Fetching feed: ${source.name} (${source.rss_url})`);
      const feedResult = await fetchRssFeed(source);

      if (!feedResult.success || !feedResult.items.length) {
        db.saveSource({
          ...source,
          last_status: 'error',
          last_fetched_at: new Date().toISOString(),
          error_message: feedResult.error || 'Empty feed payload',
        });
        db.addLog('warn', 'fetch', `Failed to retrieve feed from ${source.name}: ${feedResult.error}`);
        continue;
      }

      db.saveSource({
        ...source,
        last_status: 'success',
        last_fetched_at: new Date().toISOString(),
        error_message: undefined,
      });

      // Process up to 2 newest items per source per cycle to maintain pace without overloading
      const itemsToProcess = feedResult.items.slice(0, 2);

      for (const item of itemsToProcess) {
        processed++;

        // Gentle pacing between feed items
        await new Promise(resolve => setTimeout(resolve, 800));

        // 1. DUPLICATE CHECK
        const duplicateCheck = db.checkDuplicateArticle(item.url, item.contentHash, item.title);
        if (duplicateCheck.isDuplicate) {
          duplicates++;
          if (duplicateCheck.matchedArticle) {
            // Group duplicate sources as requested: "Multiple sources reported this story"
            const currentSources = duplicateCheck.matchedArticle.duplicate_sources || [];
            if (!currentSources.some(s => s.name === source.name)) {
              currentSources.push({ name: source.name, url: item.url });
              duplicateCheck.matchedArticle.duplicate_sources = currentSources;
              db.saveArticle(duplicateCheck.matchedArticle);
              db.addLog('info', 'duplicate_check', `Duplicate story grouped under: "${duplicateCheck.matchedArticle.original_title}" from ${source.name}`);
            }
          }
          continue;
        }

        // 2. AI EDITORIAL SYNTHESIS & TRANSLATION
        try {
          db.addLog('info', 'ai_editor', `AI Editor analyzing raw news: "${item.title.slice(0, 60)}..."`);
          const aiResult = await processArticleWithAI({
            rawTitle: item.title,
            rawContent: item.content,
            sourceName: source.name,
            sourceUrl: source.website_url,
          });

          // 3. AFFILIATE MATCHING
          const affiliateMatches = matchAndInsertAffiliates({
            headline: aiResult.translations.en.headline,
            summary: aiResult.translations.en.summary,
            editorial: aiResult.translations.en.editorial_content,
            tags: aiResult.tags,
            relatedCoins: aiResult.related_coins,
            detectedEntities: aiResult.detected_entities,
          });

          // 4. BANNER AD ASSIGNMENT (MANDATORY on every article)
          const activeAd = db.getActiveAd();

          // 5. CHOOSE IMAGE
          const heroImage = item.imageUrl || HERO_IMAGES_FALLBACK[Math.floor(Math.random() * HERO_IMAGES_FALLBACK.length)];

          // 6. BUILD FINAL PRODUCTION ARTICLE
          const articleId = `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const finalArticle: Article = {
            id: articleId,
            slug: aiResult.translations.en.slug || `article-${Date.now()}`,
            category: aiResult.category,
            original_title: item.title,
            original_url: item.url,
            content_hash: item.contentHash,
            source_id: source.id,
            source_name: source.name,
            source_url: source.website_url,
            source_logo: source.logo_url,
            published_at: item.publishedAt || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'published',
            hero_image: heroImage,
            is_breaking: Boolean(published === 0 && Math.random() > 0.6),
            view_count: 1,
            duplicate_sources: [],
            translations: aiResult.translations,
            affiliate_matches: affiliateMatches,
            ad_campaign_id: activeAd?.id,
            tags: aiResult.tags,
            related_coins: aiResult.related_coins,
          };

          db.saveArticle(finalArticle);
          published++;

          db.addLog(
            'success',
            'publish',
            `Published article: "${finalArticle.translations.en.headline.slice(0, 50)}..." in 6 languages.`,
            {
              category: finalArticle.category,
              affiliateCount: affiliateMatches.length,
              adAttached: Boolean(activeAd),
            }
          );
        } catch (itemErr: any) {
          failed++;
          db.addLog('warn', 'ai_editor', `Notice processing item "${item.title.slice(0, 50)}": ${itemErr.message}`);
          db.addFailedArticle({
            original_url: item.url,
            original_title: item.title,
            source_name: source.name,
            error_stage: 'ai_editor',
            error_message: itemErr.message || 'Processing notice',
          });
        }
      }
    }

    // 7. RUN AUTOMATED RETENTION CLEANUP
    db.runRetentionCleanup();
  } catch (err: any) {
    db.addLog('error', 'fetch', `Pipeline runtime fatal error: ${err.message}`);
  } finally {
    isRunning = false;
  }

  return { processed, published, duplicates, failed };
}

export async function retryFailedArticles(): Promise<{ retried: number; recovered: number }> {
  const failedList = db.getFailedArticles();
  let recovered = 0;
  let retried = 0;

  for (const failedItem of failedList) {
    retried++;
    if (failedItem.retry_count >= 3) {
      continue; // Kept in failed queue for admin inspection
    }

    try {
      const aiResult = await processArticleWithAI({
        rawTitle: failedItem.original_title,
        rawContent: failedItem.original_title,
        sourceName: failedItem.source_name,
        sourceUrl: failedItem.original_url,
      });

      const activeAd = db.getActiveAd();
      const articleId = `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const recoveredArticle: Article = {
        id: articleId,
        slug: aiResult.translations.en.slug || `recovered-${Date.now()}`,
        category: aiResult.category,
        original_title: failedItem.original_title,
        original_url: failedItem.original_url,
        content_hash: `recovered-${Date.now()}`,
        source_id: 'recovered',
        source_name: failedItem.source_name,
        source_url: failedItem.original_url,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published',
        hero_image: HERO_IMAGES_FALLBACK[0],
        view_count: 1,
        translations: aiResult.translations,
        ad_campaign_id: activeAd?.id,
        tags: aiResult.tags,
        related_coins: aiResult.related_coins,
      };

      db.saveArticle(recoveredArticle);
      db.removeFailedArticle(failedItem.id);
      recovered++;
      db.addLog('success', 'publish', `Successfully recovered failed article: "${recoveredArticle.original_title}"`);
    } catch (err: any) {
      db.addFailedArticle({
        original_url: failedItem.original_url,
        original_title: failedItem.original_title,
        source_name: failedItem.source_name,
        error_stage: 'retry',
        error_message: err.message,
      });
    }
  }

  return { retried, recovered };
}

export function startBackgroundPipelineScheduler(intervalMinutes = 15) {
  if (intervalHandle) {
    clearInterval(intervalHandle);
  }
  const ms = Math.max(intervalMinutes, 5) * 60 * 1000;
  intervalHandle = setInterval(() => {
    runNewsPipeline().catch(err => console.error('[Pipeline Background Scheduler] Error:', err));
  }, ms);
}
