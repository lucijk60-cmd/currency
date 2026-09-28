import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';
import { RssSource } from '../src/shared/types.js';

export interface RawNewsItem {
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceLogo?: string;
  imageUrl?: string;
  contentHash: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: true,
  trimValues: true,
});

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImage(item: any): string | undefined {
  if (item['media:content'] && item['media:content']['@_url']) {
    return item['media:content']['@_url'];
  }
  if (item['enclosure'] && item['enclosure']['@_url']) {
    return item['enclosure']['@_url'];
  }
  if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
    return item['media:thumbnail']['@_url'];
  }
  // Try extracting from description HTML if any
  const desc = item.description || item['content:encoded'] || '';
  const match = typeof desc === 'string' ? desc.match(/<img[^>]+src=["']([^"']+)["']/i) : null;
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

export async function fetchRssFeed(source: RssSource): Promise<{ success: boolean; items: RawNewsItem[]; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(source.rss_url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CRYPTOVA-Intelligence/2.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parsed = parser.parse(xmlText);

    // RSS 2.0 or Atom
    let rawItems: any[] = [];
    if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
      rawItems = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
    } else if (parsed.feed && parsed.feed.entry) {
      rawItems = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
    }

    const items: RawNewsItem[] = [];

    for (const item of rawItems) {
      const title = typeof item.title === 'string' ? item.title : item.title?.['#text'] || '';
      let url = '';
      if (typeof item.link === 'string') {
        url = item.link;
      } else if (item.link?.['@_href']) {
        url = item.link['@_href'];
      } else if (item.guid && typeof item.guid === 'string' && item.guid.startsWith('http')) {
        url = item.guid;
      }

      if (!title || !url) continue;

      const rawContent = item['content:encoded'] || item.content?.['#text'] || item.content || item.description || '';
      const cleanContent = stripHtml(typeof rawContent === 'string' ? rawContent : '');
      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
      const imageUrl = extractImage(item);

      const contentHash = crypto
        .createHash('sha256')
        .update(url.toLowerCase() + title.toLowerCase())
        .digest('hex');

      items.push({
        title: stripHtml(title),
        url: url.trim(),
        content: cleanContent.slice(0, 1500),
        publishedAt: new Date(pubDate).toISOString(),
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.website_url,
        sourceLogo: source.logo_url,
        imageUrl,
        contentHash,
      });
    }

    return { success: true, items };
  } catch (err: any) {
    return {
      success: false,
      items: [],
      error: err.message || 'Unknown network or parsing error',
    };
  }
}
