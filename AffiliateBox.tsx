import React from 'react';
import { AffiliateInsertion } from '../shared/types.js';
import { Shield, ExternalLink, Info } from 'lucide-react';

interface AffiliateBoxProps {
  insertions?: AffiliateInsertion[];
}

export const AffiliateBox: React.FC<AffiliateBoxProps> = ({ insertions }) => {
  if (!insertions || insertions.length === 0) return null;

  return (
    <div className="my-8 space-y-4">
      {insertions.map((aff, idx) => (
        <div
          key={`${aff.program_id}-${idx}`}
          className="p-5 rounded-2xl bg-gradient-to-r from-[#0c1222] via-[#0f172a] to-[#0c1222] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.06)]"
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-mono font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Verified Ecosystem Partner
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">
              Context: {aff.context_matched}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <h4 className="text-base font-bold text-white tracking-wide">
                {aff.call_to_action}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Official verified referral portal for {aff.program_name}.
              </p>
            </div>

            <a
              href={aff.referral_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] flex-shrink-0"
            >
              <span>Explore Official Portal</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>

          {/* Localized Transparent Affiliate Disclosure */}
          <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-start gap-2 text-[11px] text-neutral-400 font-mono leading-relaxed">
            <Info className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
            <span>{aff.disclosure}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
