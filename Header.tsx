import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { SUPPORTED_LANGUAGES, Article } from '../shared/types.js';
import {
  Globe,
  Search,
  Menu,
  X,
  ArrowUpRight,
  Radio,
  Terminal,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, config, dict, setLanguage, setShowLanguageModal, getLocalizedPath } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [breakingNews, setBreakingNews] = useState<Article | null>(null);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const handleDiscreetDoubleAction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const now = Date.now();
    // Deliberate double-click / rapid double-tap (within 450ms)
    if (now - lastTapRef.current < 450) {
      lastTapRef.current = 0;
      window.location.href = isAdminLoggedIn ? '/admin' : '/login';
    } else {
      // Single click does nothing!
      lastTapRef.current = now;
    }
  };

  useEffect(() => {
    // Check if admin is currently authenticated
    const token = localStorage.getItem('cryptova_admin_token');
    setIsAdminLoggedIn(!!token);

    // Fetch breaking article
    fetch('/api/articles?limit=5')
      .then(res => res.json())
      .then(data => {
        if (data.items?.length) {
          const breaking = data.items.find((a: Article) => a.is_breaking) || data.items[0];
          setBreakingNews(breaking);
        }
      })
      .catch(() => {});

    // Click outside handler for language dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: dict.marketIntelligence, path: '/market' },
    { label: dict.categories.bitcoin, path: '/category/bitcoin' },
    { label: dict.categories.ethereum, path: '/category/ethereum' },
    { label: dict.categories.altcoins, path: '/category/altcoins' },
    { label: dict.categories.defi, path: '/category/defi' },
    { label: dict.categories.regulation, path: '/category/regulation' },
    { label: dict.categories.exchanges, path: '/category/exchanges' },
  ];

  const breakingTitle = breakingNews
    ? breakingNews.translations[lang]?.headline || breakingNews.original_title
    : null;
  const breakingSlug = breakingNews
    ? breakingNews.translations[lang]?.slug || breakingNews.slug
    : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a12]/95 backdrop-blur-md border-b border-neutral-800/80">
      {/* Top Breaking News Strip */}
      {breakingTitle && breakingSlug && (
        <div className="w-full bg-gradient-to-r from-amber-950/40 via-[#0a0f1d] to-amber-950/40 border-b border-amber-500/20 py-1.5 px-4 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold tracking-wider text-[10px] uppercase flex-shrink-0 animate-pulse">
                <Radio className="w-3 h-3 text-amber-400" />
                {dict.breakingNews}
              </span>
              <a
                href={getLocalizedPath(`/news/${breakingSlug}`)}
                className="text-neutral-200 hover:text-amber-300 truncate transition-colors flex items-center gap-1"
              >
                <span>{breakingTitle}</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400 flex-shrink-0" />
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3 text-neutral-400 text-[11px] flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Real-Time Autonomous Feed</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo Branding */}
        <div className="flex items-center gap-6">
          <a href={getLocalizedPath('/')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <span className="font-['Cinzel'] font-black text-xl bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  C
                </span>
              </div>
            </div>

            <div>
              <div className="font-['Cinzel'] font-black text-2xl tracking-wider text-white flex items-center gap-1">
                <span>CRYPTOVA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase -mt-0.5">
                {dict.brandSubtitle}
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 pl-4 rtl:pl-0 rtl:pr-4 border-l rtl:border-l-0 rtl:border-r border-neutral-800">
            {navLinks.map(link => (
              <a
                key={link.path}
                href={getLocalizedPath(link.path)}
                className="px-3 py-1.5 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/60 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Action Icons & Language Selector */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger */}
          <a
            href={getLocalizedPath('/search')}
            className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
            title="Search"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-neutral-400">Search</span>
          </a>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 transition-all text-xs font-mono font-medium"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{config.flag}</span>
              <span className="hidden sm:inline font-semibold">{config.name}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 rounded-xl bg-[#0b101c] border border-neutral-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-800/80">
                  {dict.selectLanguage}
                </div>
                {SUPPORTED_LANGUAGES.map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      item.code === lang
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.nativeName}</span>
                    </span>
                    {item.dir === 'rtl' && (
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-neutral-800 text-amber-400">
                        RTL
                      </span>
                    )}
                  </button>
                ))}
                <div className="pt-1.5 mt-1 border-t border-neutral-800/80">
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false);
                      setShowLanguageModal(true);
                    }}
                    className="w-full text-center py-1 text-[11px] text-amber-400 hover:underline font-mono"
                  >
                    View All 6 Languages
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Discreet System Node Icon - Requires deliberate DOUBLE-CLICK / DOUBLE-TAP to access */}
          <div className="relative">
            <button
              type="button"
              onClick={handleDiscreetDoubleAction}
              onDoubleClick={(e) => {
                e.preventDefault();
                window.location.href = isAdminLoggedIn ? '/admin' : '/login';
              }}
              onTouchEnd={handleDiscreetDoubleAction}
              className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 text-neutral-500 hover:text-neutral-400 transition-all select-none cursor-default flex items-center justify-center active:scale-95"
              aria-label="Terminal Node"
            >
              <Terminal className="w-4 h-4 text-neutral-500 hover:text-neutral-400" />
              {isAdminLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 absolute top-1.5 right-1.5 animate-pulse" />
              )}
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-neutral-800 bg-[#070b14] px-4 py-4 animate-in slide-in-from-top">
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <a
                key={link.path}
                href={getLocalizedPath(link.path)}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500 px-2">
              <span>© 2026 CRYPTOVA Intelligence</span>
              <button
                type="button"
                onClick={handleDiscreetDoubleAction}
                onTouchEnd={handleDiscreetDoubleAction}
                className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-500 active:scale-90 transition-all"
                aria-label="System Node"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
