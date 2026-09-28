/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { LanguageSelectorModal } from './components/LanguageSelectorModal.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';

// Public Pages
import { HomePage } from './pages/HomePage.js';
import { ArticlePage } from './pages/ArticlePage.js';
import { MarketPage } from './pages/MarketPage.js';
import { SearchPage } from './pages/SearchPage.js';
import { SetupWizardPage } from './pages/SetupWizardPage.js';
import { LegalPage } from './pages/LegalPage.js';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminAutomation } from './pages/admin/AdminAutomation.js';
import { AdminSources } from './pages/admin/AdminSources.js';
import { AdminAffiliates } from './pages/admin/AdminAffiliates.js';
import { AdminAffiliateAnalytics } from './pages/admin/AdminAffiliateAnalytics.js';
import { AdminAds } from './pages/admin/AdminAds.js';
import { AdminFailed } from './pages/admin/AdminFailed.js';
import { AdminSettings } from './pages/admin/AdminSettings.js';
import { AdminLogin } from './pages/admin/AdminLogin.js';

const RouterComponent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { lang } = useLanguage();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // Intercept clicks on local <a> links to prevent full page reloads
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.origin === window.location.origin &&
        !target.hasAttribute('download') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        const url = new URL(target.href);
        window.history.pushState({}, '', url.pathname + url.search);
        setCurrentPath(url.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Parse path and remove lang prefix (e.g. /ar/news/slug -> /news/slug)
  const segments = currentPath.split('/').filter(Boolean);
  const supportedLangs = ['en', 'ar', 'bn', 'de', 'es', 'fr'];

  let normalizedPath = currentPath;
  let subSegments = segments;

  if (segments.length > 0 && supportedLangs.includes(segments[0])) {
    subSegments = segments.slice(1);
    normalizedPath = '/' + subSegments.join('/');
  }

  // Admin Routes
  if (currentPath === '/login' || currentPath === '/admin/login') {
    return <AdminLogin />;
  }

  if (currentPath.startsWith('/admin')) {
    const adminToken = localStorage.getItem('cryptova_admin_token');
    if (!adminToken) {
      // Unauthenticated visitor attempting to access admin panel -> show login
      return <AdminLogin />;
    }

    let adminContent: React.ReactNode = <AdminDashboard />;
    if (currentPath === '/admin/automation') adminContent = <AdminAutomation />;
    else if (currentPath === '/admin/sources') adminContent = <AdminSources />;
    else if (currentPath === '/admin/affiliate') adminContent = <AdminAffiliates />;
    else if (currentPath === '/admin/affiliate/analytics') adminContent = <AdminAffiliateAnalytics />;
    else if (currentPath === '/admin/ads') adminContent = <AdminAds />;
    else if (currentPath === '/admin/failed') adminContent = <AdminFailed />;
    else if (currentPath === '/admin/settings') adminContent = <AdminSettings />;

    return (
      <AdminLayout currentPath={currentPath}>
        {adminContent}
      </AdminLayout>
    );
  }

  // Setup Wizard Route
  if (currentPath === '/setup' || normalizedPath === '/setup') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <SetupWizardPage />
        <Footer />
      </div>
    );
  }

  // Public Route Rendering
  let mainContent: React.ReactNode = <HomePage />;

  if (subSegments.length >= 2 && subSegments[0] === 'news') {
    // /news/:slug
    const slug = subSegments[1];
    mainContent = <ArticlePage slug={slug} />;
  } else if (subSegments.length >= 1 && subSegments[0] === 'market') {
    mainContent = <MarketPage />;
  } else if (subSegments.length >= 1 && subSegments[0] === 'search') {
    mainContent = <SearchPage />;
  } else if (subSegments.length >= 2 && subSegments[0] === 'category') {
    mainContent = <HomePage />;
  } else if (subSegments.length >= 2 && subSegments[0] === 'legal') {
    const pageType = subSegments[1] as any;
    mainContent = <LegalPage pageType={pageType} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#060911]">
      <LanguageSelectorModal />
      <Header />
      <div className="flex-1">
        {mainContent}
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <RouterComponent />
    </LanguageProvider>
  );
}
