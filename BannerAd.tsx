import React, { useEffect } from 'react';
import { AdCampaign } from '../shared/types.js';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface BannerAdProps {
  ad?: AdCampaign | null;
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ ad, className = '' }) => {
  useEffect(() => {
    if (ad?.id) {
      // Record impression in background
      fetch(`/api/ads/impression/${ad.id}`, { method: 'POST' }).catch(() => {});
    }
  }, [ad?.id]);

  if (!ad) {
    // If no ad campaign configured, display a sleek institutional partner placeholder
    return (
      <div className={`w-full my-8 p-6 rounded-2xl bg-gradient-to-r from-[#0d1220] via-[#101728] to-[#0d1220] border border-amber-500/20 text-center relative overflow-hidden ${className}`}>
        <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-amber-500/10 border-b border-l border-amber-500/20 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
          Sponsor Partner
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-amber-400/80 mb-1" />
          <h4 className="text-base font-bold text-neutral-200 uppercase tracking-wider font-mono">
            CRYPTOVA GLOBAL PARTNER INVENTORY
          </h4>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Reach institutional crypto investors and high-volume traders. Configure custom ad campaigns in the Admin Panel.
          </p>
          <a
            href="/admin/ads"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition-colors"
          >
            Configure Banner Campaign
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full my-8 rounded-2xl overflow-hidden border border-amber-500/25 bg-[#090d18] shadow-[0_0_40px_rgba(245,158,11,0.08)] group ${className}`}>
      {/* Sponsor Label */}
      <div className="px-4 py-1.5 bg-[#070b14] border-b border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <span className="flex items-center gap-1 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
          {ad.sponsor_badge || 'VERIFIED SPONSOR'}
        </span>
        <span className="text-neutral-400 uppercase tracking-wider">
          Campaign Priority #{ad.priority}
        </span>
      </div>

      {/* Clickable Banner Content */}
      <a
        href={`/api/ads/click/${ad.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
      >
        {/* Desktop Banner Image (Hidden on Mobile) */}
        <div className="hidden md:block relative h-48 sm:h-56 lg:h-64 w-full">
          <img
            src={ad.desktop_banner_url}
            alt={ad.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/40 to-transparent" />
        </div>

        {/* Mobile Banner Image (Visible on Mobile) */}
        <div className="block md:hidden relative h-48 w-full">
          <img
            src={ad.mobile_banner_url || ad.desktop_banner_url}
            alt={ad.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/50 to-transparent" />
        </div>

        {/* Overlay Banner Text and Call to Action */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0a0f1d]/95 border-t border-neutral-800/80">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-neutral-100 group-hover:text-amber-300 transition-colors uppercase tracking-wide">
              {ad.headline || ad.name}
            </h4>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Secure, audited infrastructure certified by global compliance standards.
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <span>Learn More</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};
