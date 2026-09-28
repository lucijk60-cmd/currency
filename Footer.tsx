import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { SUPPORTED_LANGUAGES } from '../shared/types.js';
import { Send, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, dict, setLanguage, getLocalizedPath } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[#05080e] border-t border-neutral-800/80 text-neutral-300">
      {/* Newsletter Section: "Stay Ahead of Crypto" */}
      <div className="border-b border-neutral-800/80 bg-gradient-to-b from-[#080d1a] to-[#05080e] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4 uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            Institutional Intelligence Dispatch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel'] tracking-wide mb-3">
            {dict.newsletter.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto mb-8">
            {dict.newsletter.subtitle}
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-sm max-w-md mx-auto flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>{dict.newsletter.successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={dict.newsletter.placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-[#090e1c] border border-neutral-700 focus:border-amber-400 focus:outline-none text-white text-sm placeholder:text-neutral-500 font-mono"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? '...' : dict.newsletter.button}</span>
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-neutral-400 font-mono mt-4">
            {dict.newsletter.disclaimer}
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1">
            <div className="font-['Cinzel'] font-black text-2xl tracking-wider text-white mb-2">
              CRYPTOVA
            </div>
            <div className="text-xs font-mono text-amber-400/90 tracking-widest uppercase mb-4">
              Global Crypto Intelligence
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Autonomous editorial platform aggregating, synthesizing, and translating global cryptocurrency developments with institutional rigor and complete source attribution.
            </p>
          </div>

          {/* Desks Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold mb-4">
              News Desks
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li><a href={getLocalizedPath('/category/bitcoin')} className="hover:text-amber-400 transition-colors">{dict.categories.bitcoin}</a></li>
              <li><a href={getLocalizedPath('/category/ethereum')} className="hover:text-amber-400 transition-colors">{dict.categories.ethereum}</a></li>
              <li><a href={getLocalizedPath('/category/altcoins')} className="hover:text-amber-400 transition-colors">{dict.categories.altcoins}</a></li>
              <li><a href={getLocalizedPath('/category/defi')} className="hover:text-amber-400 transition-colors">{dict.categories.defi}</a></li>
              <li><a href={getLocalizedPath('/category/regulation')} className="hover:text-amber-400 transition-colors">{dict.categories.regulation}</a></li>
              <li><a href={getLocalizedPath('/category/exchanges')} className="hover:text-amber-400 transition-colors">{dict.categories.exchanges}</a></li>
            </ul>
          </div>

          {/* Global Languages */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold mb-4">
              Languages
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {SUPPORTED_LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-left rtl:text-right px-2.5 py-1.5 rounded-lg border transition-all ${
                    l.code === lang
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                      : 'border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="mr-1.5 rtl:mr-0 rtl:ml-1.5">{l.flag}</span>
                  <span>{l.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Architecture & Directory */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold mb-4">
              Platform & Verification
            </h4>
            <ul className="space-y-2 text-xs font-mono text-neutral-400">
              <li><a href="/market" className="hover:text-amber-400 transition-colors">Market Intelligence Terminal</a></li>
              <li><a href="/search" className="hover:text-amber-400 transition-colors">News Archive Intelligence</a></li>
              <li><a href="/legal/terms" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              <li><a href="/legal/privacy" className="hover:text-amber-400 transition-colors">Privacy Protocol</a></li>
              <li><a href="/legal/editorial-policy" className="hover:text-amber-400 transition-colors">Editorial Guidelines</a></li>
              <li><a href="/sitemap.xml" target="_blank" className="hover:text-neutral-200 transition-colors">XML Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Mandatory Financial Disclaimer & Source Policy */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#080d1a] border border-neutral-800/80 space-y-3 mb-8">
          <div className="flex items-start gap-2.5 text-xs text-neutral-400 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{dict.footer.disclaimer}</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{dict.footer.sourcePolicy}</span>
          </div>
        </div>

        {/* Copyright & Legal Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 border-t border-neutral-800/80 pt-6">
          <div>{dict.footer.copyright}</div>
          <div className="flex items-center gap-6">
            <a href={getLocalizedPath('/legal/privacy')} className="hover:text-neutral-200 transition-colors">{dict.footer.privacy}</a>
            <a href={getLocalizedPath('/legal/terms')} className="hover:text-neutral-200 transition-colors">{dict.footer.terms}</a>
            <a href={getLocalizedPath('/legal/about')} className="hover:text-neutral-200 transition-colors">{dict.footer.about}</a>
            <a href={getLocalizedPath('/legal/contact')} className="hover:text-neutral-200 transition-colors">{dict.footer.contact}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
