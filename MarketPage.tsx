import React, { useEffect, useState } from 'react';
import { MarketAsset } from '../shared/types.js';
import { useLanguage } from '../context/LanguageContext.js';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Activity,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const MarketPage: React.FC = () => {
  const { dict } = useLanguage();
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'rank' | 'price' | 'change' | 'volume'>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/market');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets
    .filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let diff = 0;
      if (sortField === 'rank') diff = a.rank - b.rank;
      if (sortField === 'price') diff = a.price_usd - b.price_usd;
      if (sortField === 'change') diff = a.change_24h - b.change_24h;
      if (sortField === 'volume') diff = a.volume_24h - b.volume_24h;
      return sortAsc ? diff : -diff;
    });

  const toggleSort = (field: 'rank' | 'price' | 'change' | 'volume') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'rank');
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-neutral-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#080d1a] border border-amber-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-wide text-white">
                {dict.market.title}
              </h1>
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-1 max-w-xl">
              {dict.market.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-xs font-mono text-neutral-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Live Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Search & Quick Metrics */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={dict.market.searchCoins}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-[#090e1c] border border-neutral-800 focus:border-amber-400 focus:outline-none text-xs font-mono text-white placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span>Tracking {assets.length} Tier-1 Assets</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Direct Verified Feeds
            </span>
          </div>
        </div>

        {/* Main Interactive Table */}
        <div className="rounded-3xl bg-[#080d1a] border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-[#0a1020] text-neutral-400 text-[11px] uppercase tracking-wider">
                  <th
                    onClick={() => toggleSort('rank')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{dict.market.rank}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">{dict.market.asset}</th>
                  <th
                    onClick={() => toggleSort('price')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{dict.market.price}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('change')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{dict.market.change24h}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 hidden md:table-cell">{dict.market.high24h}</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">{dict.market.low24h}</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">{dict.market.marketCap}</th>
                  <th
                    onClick={() => toggleSort('volume')}
                    className="py-3.5 px-4 hidden sm:table-cell cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{dict.market.volume24h}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right rtl:text-left">{dict.market.trend}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredAssets.map(coin => {
                  const isPos = coin.change_24h >= 0;
                  return (
                    <tr
                      key={coin.id}
                      onClick={() => setSelectedAsset(coin)}
                      className="hover:bg-neutral-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 text-neutral-400 font-bold">{coin.rank}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-amber-400 text-xs">
                            {coin.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{coin.symbol}</div>
                            <div className="text-neutral-400 text-[11px]">{coin.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-neutral-100 text-sm">
                        ${coin.price_usd >= 1 ? coin.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price_usd.toFixed(4)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          isPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPos ? '+' : ''}{coin.change_24h}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-neutral-300 hidden md:table-cell">
                        ${coin.high_24h.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-neutral-400 hidden md:table-cell">
                        ${coin.low_24h.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-neutral-300 hidden lg:table-cell">
                        ${(coin.market_cap / 1e9).toFixed(2)}B
                      </td>
                      <td className="py-4 px-4 text-neutral-300 hidden sm:table-cell">
                        ${(coin.volume_24h / 1e6).toFixed(1)}M
                      </td>
                      <td className="py-4 px-4 text-right rtl:text-left">
                        {/* Mini Sparkline SVG */}
                        <div className="inline-block w-20 h-6">
                          <svg className="w-full h-full" viewBox="0 0 100 30">
                            {coin.sparkline && coin.sparkline.length > 1 && (
                              <polyline
                                fill="none"
                                stroke={isPos ? '#10b981' : '#f43f5e'}
                                strokeWidth="2"
                                points={coin.sparkline
                                  .map((val, idx) => {
                                    const min = Math.min(...coin.sparkline);
                                    const max = Math.max(...coin.sparkline);
                                    const range = max - min || 1;
                                    const x = (idx / (coin.sparkline.length - 1)) * 100;
                                    const y = 30 - ((val - min) / range) * 26;
                                    return `${x},${y}`;
                                  })
                                  .join(' ')}
                              />
                            )}
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Asset Modal / Drawer */}
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0b101c] border border-amber-500/30 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedAsset(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-neutral-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-base">
                  {selectedAsset.symbol.slice(0, 3)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-mono">
                    {selectedAsset.name} ({selectedAsset.symbol})
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    Institutional Benchmark Rank #{selectedAsset.rank}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Price (USD)</span>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    ${selectedAsset.price_usd.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">24h Performance</span>
                  <div className={`text-lg font-bold font-mono mt-1 ${selectedAsset.change_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedAsset.change_24h >= 0 ? '+' : ''}{selectedAsset.change_24h}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">24h High</span>
                  <div className="text-sm font-bold text-neutral-200 font-mono mt-1">
                    ${selectedAsset.high_24h.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">24h Low</span>
                  <div className="text-sm font-bold text-neutral-200 font-mono mt-1">
                    ${selectedAsset.low_24h.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Last verified: {new Date(selectedAsset.last_updated).toLocaleTimeString()}
                </span>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
