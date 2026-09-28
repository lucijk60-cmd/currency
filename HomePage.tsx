import React, { useEffect, useState } from 'react';
import { Article, MarketAsset } from '../shared/types.js';
import { useLanguage } from '../context/LanguageContext.js';
import { ArticleCard } from '../components/ArticleCard.js';
import { MarketTicker } from '../components/MarketTicker.js';
import {
  TrendingUp,
  Flame,
  ArrowRight,
  Shield,
  Coins,
  Cpu,
  Landmark,
  Building2,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { lang, dict, getLocalizedPath } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load articles and market data
    Promise.all([
      fetch('/api/articles?limit=40').then(r => r.json()),
      fetch('/api/market').then(r => r.json()),
    ])
      .then(([artData, mktData]) => {
        if (artData.items) setArticles(artData.items);
        if (mktData.assets) setMarketAssets(mktData.assets);
      })
      .catch(err => console.error('Home data load error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Sections decomposition
  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1, 7);
  const bitcoinArticles = articles.filter(a => a.category === 'Bitcoin');
  const ethereumArticles = articles.filter(a => a.category === 'Ethereum');
  const altcoinsArticles = articles.filter(a => a.category === 'Altcoins');
  const defiArticles = articles.filter(a => a.category === 'DeFi' || a.category === 'Web3');
  const regulationArticles = articles.filter(a => a.category === 'Regulation');
  const exchangeArticles = articles.filter(a => a.category === 'Exchanges');
  const trendingArticles = [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 5);

  const filterCategories = [
    { id: 'all', label: dict.categories.all },
    { id: 'bitcoin', label: dict.categories.bitcoin },
    { id: 'ethereum', label: dict.categories.ethereum },
    { id: 'altcoins', label: dict.categories.altcoins },
    { id: 'defi', label: dict.categories.defi },
    { id: 'regulation', label: dict.categories.regulation },
    { id: 'exchanges', label: dict.categories.exchanges },
  ];

  const filteredArticles = activeCategory === 'all'
    ? latestArticles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase()).slice(0, 6);

  return (
    <div className="w-full min-h-screen bg-[#060911] text-neutral-100">
      {/* 2. Market Ticker Bar */}
      <MarketTicker />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
        {/* 3. MAIN HERO NEWS */}
        {featuredArticle && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                  {dict.featuredStory}
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Verified Global Wire
              </span>
            </div>

            <ArticleCard article={featuredArticle} featured={true} />
          </section>
        )}

        {/* 4. LATEST NEWS WITH CATEGORY TABS */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel'] tracking-wide text-white">
                {dict.latestNews}
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Autonomous editorial synthesis filtered from verified international newsrooms.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {filterCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* 5. BITCOIN DESK & ETHEREUM DESK SPLIT */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bitcoin Desk */}
          <div className="p-6 rounded-3xl bg-[#080d1a] border border-amber-500/25 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
                  ₿
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Cinzel']">
                    {dict.categories.bitcoin} Desk
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                    Sovereign & Macro Reserve Assets
                  </span>
                </div>
              </div>
              <a
                href={getLocalizedPath('/category/bitcoin')}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                Desk Wire <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              {bitcoinArticles.slice(0, 3).map(art => {
                const trans = art.translations[lang] || art.translations.en;
                return (
                  <div key={art.id} className="p-3.5 rounded-xl bg-[#0b1224] border border-neutral-800/80 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-1.5">
                      <span className="text-amber-400/90">{art.source_name}</span>
                      <span>•</span>
                      <span>{art.published_at.split('T')[0]}</span>
                    </div>
                    <a
                      href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                      className="font-bold text-sm text-neutral-200 hover:text-amber-300 transition-colors line-clamp-2"
                    >
                      {trans.headline || art.original_title}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ethereum Desk */}
          <div className="p-6 rounded-3xl bg-[#080d1a] border border-blue-500/25 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
                  Ξ
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Cinzel']">
                    {dict.categories.ethereum} Desk
                  </h3>
                  <span className="text-[10px] font-mono text-blue-400/80 uppercase">
                    Smart Contracts & Modular Scaling
                  </span>
                </div>
              </div>
              <a
                href={getLocalizedPath('/category/ethereum')}
                className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                Desk Wire <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              {ethereumArticles.slice(0, 3).map(art => {
                const trans = art.translations[lang] || art.translations.en;
                return (
                  <div key={art.id} className="p-3.5 rounded-xl bg-[#0b1224] border border-neutral-800/80 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-1.5">
                      <span className="text-blue-400/90">{art.source_name}</span>
                      <span>•</span>
                      <span>{art.published_at.split('T')[0]}</span>
                    </div>
                    <a
                      href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                      className="font-bold text-sm text-neutral-200 hover:text-blue-300 transition-colors line-clamp-2"
                    >
                      {trans.headline || art.original_title}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. ALTCOINS & DEFI / WEB3 SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Altcoins */}
          <div className="p-6 rounded-3xl bg-[#080d1a] border border-purple-500/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white font-['Cinzel']">
                  {dict.categories.altcoins}
                </h3>
              </div>
              <a href={getLocalizedPath('/category/altcoins')} className="text-xs font-mono text-purple-400 hover:underline">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {altcoinsArticles.length > 0 ? (
                altcoinsArticles.slice(0, 3).map(art => {
                  const trans = art.translations[lang] || art.translations.en;
                  return (
                    <a
                      key={art.id}
                      href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                      className="block p-3 rounded-xl bg-[#0a0f1e] hover:bg-[#0f172e] border border-neutral-800/80 transition-colors"
                    >
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-purple-300 line-clamp-2">
                        {trans.headline || art.original_title}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                        {art.source_name} • {art.tags.slice(0, 2).join(', ')}
                      </span>
                    </a>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-[#0a0f1e] text-xs text-neutral-400 font-mono">
                  Autonomous scanner collecting altcoin telemetry...
                </div>
              )}
            </div>
          </div>

          {/* DeFi / Web3 */}
          <div className="p-6 rounded-3xl bg-[#080d1a] border border-emerald-500/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-['Cinzel']">
                  {dict.categories.defi} & Web3
                </h3>
              </div>
              <a href={getLocalizedPath('/category/defi')} className="text-xs font-mono text-emerald-400 hover:underline">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {defiArticles.slice(0, 3).map(art => {
                const trans = art.translations[lang] || art.translations.en;
                return (
                  <a
                    key={art.id}
                    href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                    className="block p-3 rounded-xl bg-[#0a0f1e] hover:bg-[#0f172e] border border-neutral-800/80 transition-colors"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-emerald-300 line-clamp-2">
                      {trans.headline || art.original_title}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                      {art.source_name} • {art.tags.slice(0, 2).join(', ')}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. REGULATION & EXCHANGES DESKS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Regulation */}
          <div className="p-6 rounded-3xl bg-[#080d1a] border border-rose-500/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold text-white font-['Cinzel']">
                  {dict.categories.regulation}
                </h3>
              </div>
              <a href={getLocalizedPath('/category/regulation')} className="text-xs font-mono text-rose-400 hover:underline">
                Legal Feed →
              </a>
            </div>
            <div className="space-y-3">
              {regulationArticles.slice(0, 3).map(art => {
                const trans = art.translations[lang] || art.translations.en;
                return (
                  <a
                    key={art.id}
                    href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                    className="block p-3 rounded-xl bg-[#0a0f1e] hover:bg-[#0f172e] border border-neutral-800/80 transition-colors"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-rose-300 line-clamp-2">
                      {trans.headline || art.original_title}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                      {art.source_name} • {art.published_at.split('T')[0]}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Exchanges */}
          <div className="p-6 rounded-3xl bg-[#080d1a] border border-cyan-500/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-['Cinzel']">
                  {dict.categories.exchanges}
                </h3>
              </div>
              <a href={getLocalizedPath('/category/exchanges')} className="text-xs font-mono text-cyan-400 hover:underline">
                Exchange Feed →
              </a>
            </div>
            <div className="space-y-3">
              {exchangeArticles.slice(0, 3).map(art => {
                const trans = art.translations[lang] || art.translations.en;
                return (
                  <a
                    key={art.id}
                    href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                    className="block p-3 rounded-xl bg-[#0a0f1e] hover:bg-[#0f172e] border border-neutral-800/80 transition-colors"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-cyan-300 line-clamp-2">
                      {trans.headline || art.original_title}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                      {art.source_name} • {art.published_at.split('T')[0]}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. TRENDING STORIES SECTION */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0a0e1c] via-[#0d1428] to-[#0a0e1c] border border-amber-500/20">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
              Trending Intelligence Heatmap
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {trendingArticles.map((art, index) => {
              const trans = art.translations[lang] || art.translations.en;
              return (
                <a
                  key={art.id}
                  href={getLocalizedPath(`/news/${trans.slug || art.slug}`)}
                  className="p-4 rounded-2xl bg-[#070a14]/90 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-2xl font-black font-mono text-neutral-400 group-hover:text-amber-400 transition-colors">
                      0{index + 1}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white mt-2 line-clamp-3 leading-snug">
                      {trans.headline || art.original_title}
                    </h4>
                  </div>
                  <div className="mt-4 pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>{art.category}</span>
                    <span className="text-amber-400">{art.view_count.toLocaleString()} reads</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 9. MARKET OVERVIEW TERMINAL */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#070b14] border border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
                  {dict.market.title}
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                {dict.market.subtitle}
              </p>
            </div>

            <a
              href={getLocalizedPath('/market')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold transition-colors w-fit"
            >
              <span>Full Market Terminal</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 px-3">#</th>
                  <th className="pb-3 px-3">{dict.market.asset}</th>
                  <th className="pb-3 px-3">{dict.market.price}</th>
                  <th className="pb-3 px-3">{dict.market.change24h}</th>
                  <th className="pb-3 px-3 hidden md:table-cell">{dict.market.marketCap}</th>
                  <th className="pb-3 px-3 hidden sm:table-cell">{dict.market.volume24h}</th>
                  <th className="pb-3 px-3 text-right rtl:text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {marketAssets.slice(0, 7).map(coin => {
                  const isPos = coin.change_24h >= 0;
                  return (
                    <tr key={coin.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3 px-3 text-neutral-400 font-semibold">{coin.rank}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{coin.symbol}</span>
                          <span className="text-neutral-400 hidden sm:inline">{coin.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-200">
                        ${coin.price_usd >= 1 ? coin.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price_usd.toFixed(4)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                          {isPos ? '+' : ''}{coin.change_24h}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400 hidden md:table-cell">
                        ${(coin.market_cap / 1e9).toFixed(2)}B
                      </td>
                      <td className="py-3 px-3 text-neutral-400 hidden sm:table-cell">
                        ${(coin.volume_24h / 1e6).toFixed(1)}M
                      </td>
                      <td className="py-3 px-3 text-right rtl:text-left">
                        <a
                          href={getLocalizedPath('/market')}
                          className="text-amber-400 hover:underline text-[11px]"
                        >
                          Trade View →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
