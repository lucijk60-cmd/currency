import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { Shield, AlertTriangle, FileText, Mail, HelpCircle, CheckCircle2 } from 'lucide-react';

interface LegalPageProps {
  pageType: 'privacy' | 'terms' | 'disclaimer' | 'source-policy' | 'about' | 'contact' | 'cookies';
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType }) => {
  const { lang, dict, getLocalizedPath } = useLanguage();

  const titles: Record<string, string> = {
    privacy: 'Privacy & Data Protection Policy',
    terms: 'Terms of Service & Usage Agreement',
    disclaimer: 'Financial & Investment Information Disclaimer',
    'source-policy': 'Editorial & Source Attribution Policy',
    about: 'About CRYPTOVA Intelligence',
    contact: 'Editorial Office & Global Bureau Contact',
    cookies: 'Cookie & Tracking Telemetry Policy',
  };

  const currentTitle = titles[pageType] || 'Legal Governance';

  return (
    <div className="min-h-screen bg-[#060911] text-neutral-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-[#080d1a] border border-amber-500/20">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            Institutional Governance & Disclosures
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel'] tracking-wide text-white">
            {currentTitle}
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Effective Date: March 2026 • Verified Standard of the CRYPTOVA Autonomous Newsroom
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 rounded-3xl bg-[#080d1a] border border-neutral-800 space-y-6 text-sm text-neutral-300 leading-relaxed font-normal">
          {pageType === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>CRITICAL NOTICE:</strong> No content published on CRYPTOVA constitutes financial, investment, legal, tax, or trading advice.
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-mono">1. Independent Journalistic Scope</h2>
              <p>
                CRYPTOVA functions strictly as an autonomous news aggregation, synthesis, and market intelligence platform. All articles, market tickers, statistical metrics, and editorial briefings are generated for informational and educational purposes only.
              </p>
              <h2 className="text-lg font-bold text-white font-mono">2. High-Risk Investment Warning</h2>
              <p>
                Cryptocurrency trading, decentralized finance protocols, derivatives, and digital asset holding involve substantial risk of financial loss. You should never invest funds that you cannot afford to lose completely.
              </p>
              <h2 className="text-lg font-bold text-white font-mono">3. Affiliate Disclosure Integration</h2>
              <p>
                In accordance with regulatory transparency standards, CRYPTOVA may receive referral compensation from verified ecosystem partners (such as exchanges or hardware wallet providers) when readers engage with designated referral links. These relationships do not influence objective editorial synthesis.
              </p>
            </div>
          )}

          {pageType === 'source-policy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-mono">1. Respect for Intellectual Property & Attribution</h2>
              <p>
                CRYPTOVA respects the reporting and intellectual property of global journalism. The platform NEVER reproduces, scrapes, or mirrors complete copyrighted third-party news articles verbatim.
              </p>
              <h2 className="text-lg font-bold text-white font-mono">2. Autonomous AI Editorial Synthesis</h2>
              <p>
                Incoming RSS feeds and press dispatches are parsed strictly for factual event milestones, figures, and dates. Our editorial AI synthesizes original concise briefings, extract key factual takeaways, and provides comprehensive direct attribution links back to the original publisher.
              </p>
              <h2 className="text-lg font-bold text-white font-mono">3. Copyright & Removal Inquiries</h2>
              <p>
                Publishers who wish to manage feed inclusion or update attribution schemas may contact our automated syndication desk at <code>editorial@cryptova.intelligence</code>.
              </p>
            </div>
          )}

          {pageType === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-mono">1. Zero Invasive Telemetry</h2>
              <p>
                CRYPTOVA does not collect personal identifiers, facial telemetry, or private wallet private keys. All market viewing and reading is open and anonymous.
              </p>
              <h2 className="text-lg font-bold text-white font-mono">2. Newsletter & Email Processing</h2>
              <p>
                Email addresses submitted to the "Stay Ahead of Crypto" dispatch are encrypted and used solely for scheduled editorial summaries. We never sell or exchange subscriber data.
              </p>
            </div>
          )}

          {pageType === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-mono">1. Acceptance of Terms</h2>
              <p>
                By navigating CRYPTOVA, you agree to comply with international internet usage conventions, acknowledging the non-financial advisory nature of all digital asset reporting.
              </p>
              <h2 className="text-lg font-bold text-white font-mono">2. System Availability & Accuracy</h2>
              <p>
                While market tickers and editorial algorithms operate 24/7 with multi-feed redundancy, CRYPTOVA makes no warranty regarding instantaneous market quote synchronicity during volatile macroeconomic events.
              </p>
            </div>
          )}

          {pageType === 'about' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-mono">The Futuristic Global Newsroom</h2>
              <p>
                CRYPTOVA was founded on a singular principle: Eliminate noise, eliminate sensationalism, and deliver real-time factual cryptocurrency intelligence across languages and borders.
              </p>
              <p>
                Through autonomous machine intelligence, we bridge disparate language barriers simultaneously across English, Arabic (with native RTL), Bengali, German, Spanish, and French, providing institutional investors and individuals with identical unmanipulated facts.
              </p>
            </div>
          )}

          {pageType === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-mono">Editorial Bureau & Inquiries</h2>
              <p>
                For syndication, publisher integration, advertising sponsorships, or correction requests:
              </p>
              <div className="p-4 rounded-xl bg-[#090e1c] border border-neutral-800 font-mono text-xs space-y-2">
                <div>Editorial Desk: <span className="text-amber-400">editorial@cryptova.intelligence</span></div>
                <div>Partnerships & Ads: <span className="text-amber-400">sponsorships@cryptova.intelligence</span></div>
                <div>Security & Bug Bounty: <span className="text-amber-400">security@cryptova.intelligence</span></div>
              </div>
            </div>
          )}

          {pageType === 'cookies' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-mono">Cookie Policy & Language Persistence</h2>
              <p>
                CRYPTOVA utilizes minimal client-side <code>localStorage</code> purely to remember your language selection (e.g. English, Arabic, Bengali, etc.) and ensure seamless routing without redundant splash prompts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
