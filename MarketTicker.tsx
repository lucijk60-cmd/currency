import React, { useEffect, useState } from 'react';
import { MarketAsset } from '../shared/types.js';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export const MarketTicker: React.FC = () => {
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const { getLocalizedPath } = useLanguage();

  const loadMarket = async () => {
    try {
      const res = await fetch('/api/market');
      if (res.ok) {
        const data = await res.json();
        if (data.assets) setAssets(data.assets);
      }
    } catch (err) {
      console.warn('Market ticker fetch failed:', err);
    }
  };

  useEffect(() => {
    loadMarket();
    const interval = setInterval(loadMarket, 25000); // 25s live ticker pulse
    return () => clearInterval(interval);
  }, []);

  if (!assets.length) return null;

  return (
    <div className="w-full bg-[#05080f] border-y border-neutral-800/80 overflow-hidden select-none py-2 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Ticker badge */}
        <div className="flex-shrink-0 flex items-center gap-2 pr-4 rtl:pr-0 rtl:pl-4 border-r rtl:border-r-0 rtl:border-l border-neutral-800 text-xs font-mono font-semibold text-amber-400">
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">LIVE WIRE</span>
        </div>

        {/* Scrollable / flowing tickers */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth pl-4 rtl:pl-0 rtl:pr-4 py-0.5">
          {assets.map(asset => {
            const isPositive = asset.change_24h >= 0;
            return (
              <a
                key={asset.id}
                href={getLocalizedPath('/market')}
                className="flex-shrink-0 flex items-center gap-2 px-2.5 py-1 rounded bg-[#0b101c]/90 border border-neutral-800/70 hover:border-amber-500/40 transition-colors group"
              >
                <span className="font-mono font-bold text-xs text-neutral-200 group-hover:text-amber-300">
                  {asset.symbol}
                </span>
                <span className="font-mono text-xs text-neutral-300">
                  ${asset.price_usd >= 1 ? asset.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price_usd.toFixed(4)}
                </span>
                <span
                  className={`flex items-center text-[11px] font-mono font-medium px-1.5 py-0.2 rounded ${
                    isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isPositive ? '+' : ''}{asset.change_24h}%
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
