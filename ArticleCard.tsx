import React from 'react';
import { Article } from '../shared/types.js';
import { useLanguage } from '../context/LanguageContext.js';
import { Clock, Eye, Layers } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const { lang, getLocalizedPath } = useLanguage();
  const trans = article.translations[lang] || article.translations.en;
  const headline = trans?.headline || article.original_title;
  const summary = trans?.summary || '';
  const slug = trans?.slug || article.slug;

  const categoryColors: Record<string, string> = {
    Bitcoin: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Ethereum: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    Altcoins: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    DeFi: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Regulation: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    Exchanges: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    Market: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    Web3: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  };

  const badgeStyle = categoryColors[article.category] || 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  const formatRelativeTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (featured) {
    return (
      <article className="group relative rounded-3xl bg-[#090d18] border border-amber-500/30 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] transition-all hover:border-amber-500/60 hover:shadow-[0_0_70px_rgba(245,158,11,0.18)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full overflow-hidden min-h-[300px]">
            <img
              src={article.hero_image}
              alt={headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-[#090d18]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#090d18]/40 lg:to-[#090d18]" />

            {/* Badges */}
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${badgeStyle}`}>
                {article.category}
              </span>
              {article.is_breaking && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  Breaking
                </span>
              )}
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Meta row */}
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mb-3">
                <span className="text-amber-400/90 font-medium">{article.source_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatRelativeTime(article.published_at)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.view_count.toLocaleString()}
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-300 transition-colors leading-tight mb-4">
                <a href={getLocalizedPath(`/news/${slug}`)}>
                  {headline}
                </a>
              </h2>

              {/* Summary */}
              <p className="text-sm text-neutral-300 leading-relaxed mb-6 line-clamp-3">
                {summary}
              </p>

              {/* Key points preview */}
              {trans?.key_points && trans.key_points.length > 0 && (
                <div className="space-y-2 mb-6 hidden sm:block">
                  {trans.key_points.slice(0, 2).map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags and CTA */}
            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {article.related_coins.map(coin => (
                  <span
                    key={coin}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300"
                  >
                    ${coin}
                  </span>
                ))}
              </div>

              <a
                href={getLocalizedPath(`/news/${slug}`)}
                className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold"
              >
                Full Intelligence →
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article className="group flex flex-col rounded-2xl bg-[#090d18] border border-neutral-800/80 overflow-hidden hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] transition-all">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={article.hero_image}
          alt={headline}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-transparent" />

        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase border ${badgeStyle}`}>
            {article.category}
          </span>
        </div>

        {article.duplicate_sources && article.duplicate_sources.length > 0 && (
          <div className="absolute bottom-2 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Multiple Sources</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-2">
            <span className="text-amber-400/90 truncate max-w-[120px]">{article.source_name}</span>
            <span>•</span>
            <span>{formatRelativeTime(article.published_at)}</span>
          </div>

          {/* Headline */}
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-2 line-clamp-2">
            <a href={getLocalizedPath(`/news/${slug}`)}>
              {headline}
            </a>
          </h3>

          {/* Summary */}
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {summary}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1 text-[11px]">
            {article.related_coins.slice(0, 2).map(c => (
              <span key={c} className="text-neutral-400">${c}</span>
            ))}
          </div>

          <a
            href={getLocalizedPath(`/news/${slug}`)}
            className="text-amber-400 hover:text-amber-300 font-semibold"
          >
            Read Brief →
          </a>
        </div>
      </div>
    </article>
  );
};
