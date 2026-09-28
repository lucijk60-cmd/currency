import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../shared/types.js';
import { Globe, Sparkles, Check, ArrowRight } from 'lucide-react';

export const LanguageSelectorModal: React.FC = () => {
  const { lang, setLanguage, showLanguageModal, setShowLanguageModal } = useLanguage();

  if (!showLanguageModal) return null;

  const handleSelect = (selectedLang: SupportedLanguage) => {
    setLanguage(selectedLang);
    setShowLanguageModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070a]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-amber-500/25 rounded-2xl shadow-[0_0_80px_rgba(245,158,11,0.12)] overflow-hidden p-6 sm:p-10">
        {/* Futuristic glowing ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-amber-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Monogram branding */}
        <div className="relative flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Next-Gen Autonomous Newsroom
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-white font-['Cinzel'] flex items-center gap-3">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              CRYPTOVA
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-neutral-400 mt-2 uppercase">
            Global Crypto Intelligence
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-4" />
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center justify-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            Choose Your Language
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-md mx-auto">
            Select your preferred dispatch language. Factual editorial briefings and markets will stream in real-time.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {SUPPORTED_LANGUAGES.map(item => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`group relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-[#0d1322]/80 border-neutral-800 hover:border-amber-500/40 hover:bg-[#121a2f] text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <div className="font-semibold text-base flex items-center gap-2">
                      <span className={item.dir === 'rtl' ? 'font-serif text-lg' : ''}>
                        {item.nativeName}
                      </span>
                      {item.dir === 'rtl' && (
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          RTL
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-800 group-hover:bg-amber-500/20 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80 text-xs text-neutral-400 font-mono">
          <span>Zero manual translation needed</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            AI Editorial Core Active
          </span>
        </div>
      </div>
    </div>
  );
};
