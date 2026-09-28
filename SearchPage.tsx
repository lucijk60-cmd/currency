import React, { useState, useEffect } from 'react';
import { Article } from '../shared/types.js';
import { useLanguage } from '../context/LanguageContext.js';
import { ArticleCard } from '../components/ArticleCard.js';
import { Search, Filter, Calendar, Tag, RefreshCw } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { lang, dict } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('search', query.trim());
      if (category !== 'all') params.append('category', category);
      params.append('language', lang);
      params.append('limit', '50');

      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      if (data.items) {
        let results: Article[] = data.items;
        // Filter by time locally
        if (timeFilter !== 'all') {
          const now = Date.now();
          const limits: Record<string, number> = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
          };
          const limitMs = limits[timeFilter] || 0;
          if (limitMs > 0) {
            results = results.filter(a => now - new Date(a.published_at).getTime() <= limitMs);
          }
        }
        setArticles(results);
      }
    } catch (err) {
      console.error('Search query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [category, timeFilter, lang]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="min-h-screen bg-[#060911] text-neutral-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1a] border border-amber-500/20">
          <h1 className="text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-wide text-white mb-2">
            Intelligence Dossier Search
          </h1>
          <p className="text-xs font-mono text-neutral-400 mb-6">
            Search across global crypto news, tokens, protocols, regulators, and sources.
          </p>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3.5 rounded-2xl bg-[#0a0f20] border border-neutral-700 focus:border-amber-400 focus:outline-none text-sm font-mono text-white placeholder:text-neutral-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Execute Search</span>
            </button>
          </form>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-neutral-800 text-xs font-mono">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-400">Desk:</span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="bg-[#0b1224] border border-neutral-700 text-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="all">{dict.categories.all}</option>
                <option value="bitcoin">{dict.categories.bitcoin}</option>
                <option value="ethereum">{dict.categories.ethereum}</option>
                <option value="altcoins">{dict.categories.altcoins}</option>
                <option value="defi">{dict.categories.defi}</option>
                <option value="regulation">{dict.categories.regulation}</option>
                <option value="exchanges">{dict.categories.exchanges}</option>
              </select>
            </div>

            {/* Time filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-400">Timeframe:</span>
              <select
                value={timeFilter}
                onChange={e => setTimeFilter(e.target.value)}
                className="bg-[#0b1224] border border-neutral-700 text-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="all">{dict.filterAll}</option>
                <option value="24h">{dict.filter24h}</option>
                <option value="7d">{dict.filter7d}</option>
                <option value="30d">{dict.filter30d}</option>
              </select>
            </div>

            <div className="text-neutral-400 ml-auto rtl:ml-0 rtl:mr-auto">
              Found {articles.length} verified intelligence records
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(art => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-[#080d1a] border border-neutral-800">
            <Search className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-300 font-mono">
              No matching intelligence reports located
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Try searching for alternative cryptocurrency ticker symbols, protocol names, or clearing active filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
