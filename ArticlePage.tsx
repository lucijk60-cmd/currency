import React, { useEffect, useState } from 'react';
import { Article, AdCampaign } from '../shared/types.js';
import { useLanguage } from '../context/LanguageContext.js';
import { BannerAd } from '../components/BannerAd.js';
import { AffiliateBox } from '../components/AffiliateBox.js';
import { ArticleCard } from '../components/ArticleCard.js';
import {
  Clock,
  Calendar,
  Eye,
  ExternalLink,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Layers,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Twitter,
  Facebook,
} from 'lucide-react';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { lang, dict, getLocalizedPath } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [activeAd, setActiveAd] = useState<AdCampaign | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.article) {
          setArticle(data.article);
          setActiveAd(data.activeAd || null);
          setRelated(data.related || []);
        }
      })
      .catch(err => console.error('Article fetch error:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060911] flex items-center justify-center p-8 text-neutral-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span>Decrypting and Synthesizing Intelligence Dossier...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#060911] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold font-['Cinzel'] text-white mb-2">
          Intelligence Record Not Found
        </h2>
        <p className="text-sm text-neutral-400 mb-6">
          The requested cryptographic briefing may have been archived or updated.
        </p>
        <a
          href={getLocalizedPath('/')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-xs font-mono"
        >
          Return to Global Newsroom
        </a>
      </div>
    );
  }

  const trans = article.translations[lang] || article.translations.en;
  const headline = trans?.headline || article.original_title;
  const summary = trans?.summary || '';
  const keyPoints = trans?.key_points || [];
  const editorial = trans?.editorial_content || '';
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = `https://twitter.com/intent/tweet?text=${encodeURIComponent(headline)}&url=${encodeURIComponent(shareUrl)}`;
  const shareTelegram = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(headline)}`;
  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(headline + ' ' + shareUrl)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <article className="min-h-screen bg-[#060911] text-neutral-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
          <a href={getLocalizedPath('/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href={getLocalizedPath(`/category/${article.category.toLowerCase()}`)} className="text-amber-400">
            {article.category}
          </a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px] text-neutral-400">{headline}</span>
        </nav>

        {/* Category & Attributes */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            {article.category} Desk
          </span>
          {article.is_breaking && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono uppercase tracking-wider animate-pulse">
              Breaking Intelligence
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1424] border border-neutral-800 text-xs font-mono text-neutral-400">
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            {article.view_count.toLocaleString()} reads
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Cinzel'] tracking-wide leading-tight mb-6">
          {headline}
        </h1>

        {/* Meta Bar: Published, Updated, Source */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e1c] border border-neutral-800/80 mb-8 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>Updated: {new Date(article.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
            </div>
          </div>

          {/* Source Attribution & Read Original Source */}
          <div className="flex items-center gap-3">
            <span className="text-neutral-400">{dict.sourceAttribution}:</span>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold transition-colors"
            >
              <span>{article.source_name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Multiple sources duplicate report note */}
        {article.duplicate_sources && article.duplicate_sources.length > 0 && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs font-mono text-amber-300">
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>
              {dict.multipleSourcesReported}: {article.duplicate_sources.map(s => s.name).join(', ')}
            </span>
          </div>
        )}

        {/* Hero Image with Cinematic Framing */}
        <div className="relative rounded-3xl overflow-hidden border border-neutral-800 mb-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <img
            src={article.hero_image}
            alt={headline}
            className="w-full h-80 sm:h-96 md:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-neutral-400 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
            Source Imagery: Verified institutional digital asset wire broadcast via CRYPTOVA Intelligence.
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1428] to-[#0a0f1d] border-l-4 rtl:border-l-0 rtl:border-r-4 border-amber-500 mb-8 shadow-[0_0_30px_rgba(245,158,11,0.06)]">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            {dict.executiveSummary}
          </div>
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-serif">
            {summary}
          </p>
        </div>

        {/* Key Points (3–5 Takeaways) */}
        {keyPoints.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1c] border border-neutral-800 mb-10">
            <h3 className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {dict.keyPoints}
            </h3>
            <ul className="space-y-3">
              {keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Editorial Explanation & In-Depth Analysis */}
        <div className="mb-10">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-4">
            {dict.editorialAnalysis}
          </h3>
          <div className="prose prose-invert max-w-none text-neutral-300 text-base sm:text-lg leading-relaxed space-y-6 whitespace-pre-line font-normal">
            {editorial}
          </div>
        </div>

        {/* Related Crypto Assets */}
        {article.related_coins.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#080d1a] border border-neutral-800 flex items-center justify-between flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-amber-400 font-bold">{dict.relatedAssets}:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {article.related_coins.map(c => (
                <a
                  key={c}
                  href={getLocalizedPath('/market')}
                  className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 text-xs font-mono font-bold text-neutral-200 hover:text-amber-300 transition-colors"
                >
                  ${c}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Read Original Source Button */}
        <div className="p-6 rounded-2xl bg-[#090d18] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h4 className="text-sm font-bold text-white font-mono">
              Original Verification & Source Attribution
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review full raw dispatch, regulatory filings, or initial release.
            </p>
          </div>
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-mono text-xs font-semibold transition-colors flex-shrink-0"
          >
            <span>{dict.readOriginalSource}</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>

        {/* Contextual Affiliate / Referral Section (when relevant) */}
        {article.affiliate_matches && article.affiliate_matches.length > 0 && (
          <AffiliateBox insertions={article.affiliate_matches} />
        )}

        {/* ========================================================= */}
        {/* MANDATORY BANNER ADVERTISEMENT DIRECTLY BELOW ARTICLE */}
        {/* ========================================================= */}
        <div className="my-10">
          <BannerAd ad={activeAd} />
        </div>

        {/* Social Sharing Bar (Requirement 32) */}
        <div className="p-4 rounded-2xl bg-[#090d18] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <span className="text-xs font-mono text-neutral-400 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            {dict.shareStory}
          </span>

          <div className="flex items-center gap-2">
            <a
              href={shareX}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Share on X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={shareTelegram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Share on Telegram"
            >
              <MessageCircle className="w-4 h-4 text-blue-400" />
            </a>
            <a
              href={shareWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
            </a>
            <a
              href={shareFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4 text-indigo-400" />
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? dict.copied : dict.copyLink}</span>
            </button>
          </div>
        </div>

        {/* Related News Section */}
        {related.length > 0 && (
          <section className="pt-8 border-t border-neutral-800/80">
            <h3 className="text-xl font-bold font-['Cinzel'] text-white mb-6">
              {dict.relatedStories}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map(r => (
                <ArticleCard key={r.id} article={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
