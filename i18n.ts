import { SupportedLanguage } from '../shared/types.js';

export interface TranslationsDict {
  brandSubtitle: string;
  selectLanguage: string;
  selectLanguagePrompt: string;
  breakingNews: string;
  marketIntelligence: string;
  liveMarketTicker: string;
  latestNews: string;
  featuredStory: string;
  keyPoints: string;
  executiveSummary: string;
  editorialAnalysis: string;
  readOriginalSource: string;
  sourceAttribution: string;
  multipleSourcesReported: string;
  relatedStories: string;
  relatedAssets: string;
  shareStory: string;
  copyLink: string;
  copied: string;
  searchPlaceholder: string;
  filterAll: string;
  filter24h: string;
  filter7d: string;
  filter30d: string;
  categories: {
    all: string;
    bitcoin: string;
    ethereum: string;
    altcoins: string;
    defi: string;
    regulation: string;
    exchanges: string;
    market: string;
    web3: string;
  };
  market: {
    title: string;
    subtitle: string;
    rank: string;
    asset: string;
    price: string;
    change24h: string;
    high24h: string;
    low24h: string;
    marketCap: string;
    volume24h: string;
    trend: string;
    searchCoins: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    successMessage: string;
    disclaimer: string;
  };
  footer: {
    disclaimer: string;
    sourcePolicy: string;
    privacy: string;
    terms: string;
    about: string;
    contact: string;
    copyright: string;
  };
  admin: {
    dashboard: string;
    automation: string;
    sources: string;
    affiliates: string;
    ads: string;
    settings: string;
    logout: string;
  };
}

export const DICTIONARIES: Record<SupportedLanguage, TranslationsDict> = {
  en: {
    brandSubtitle: 'GLOBAL CRYPTO INTELLIGENCE',
    selectLanguage: 'Choose Your Language',
    selectLanguagePrompt: 'Select your preferred language to experience CRYPTOVA with real-time editorial synthesis.',
    breakingNews: 'BREAKING INTELLIGENCE',
    marketIntelligence: 'Market Intelligence',
    liveMarketTicker: 'Live Markets',
    latestNews: 'Latest Briefings',
    featuredStory: 'Top Story',
    keyPoints: 'Key Factual Takeaways',
    executiveSummary: 'Executive Editorial Summary',
    editorialAnalysis: 'Intelligence Assessment',
    readOriginalSource: 'Read Original Source',
    sourceAttribution: 'Original Source',
    multipleSourcesReported: 'Multiple verified sources reported this development',
    relatedStories: 'Related Intelligence',
    relatedAssets: 'Monitored Assets',
    shareStory: 'Broadcast Story',
    copyLink: 'Copy URL',
    copied: 'Copied to clipboard!',
    searchPlaceholder: 'Search news, tokens, protocols, regulators...',
    filterAll: 'All Time',
    filter24h: 'Last 24 Hours',
    filter7d: 'Last 7 Days',
    filter30d: 'Last 30 Days',
    categories: {
      all: 'All Desks',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      altcoins: 'Altcoins',
      defi: 'DeFi',
      regulation: 'Regulation',
      exchanges: 'Exchanges',
      market: 'Macro Markets',
      web3: 'Web3 & Tech',
    },
    market: {
      title: 'Global Crypto Market Terminal',
      subtitle: 'Real-time verified pricing, liquidity volumes, and institutional benchmarks.',
      rank: 'Rank',
      asset: 'Asset',
      price: 'Price (USD)',
      change24h: '24h Change',
      high24h: '24h High',
      low24h: '24h Low',
      marketCap: 'Market Cap',
      volume24h: '24h Volume',
      trend: '7D Trend',
      searchCoins: 'Filter digital assets by name or ticker...',
    },
    newsletter: {
      title: 'STAY AHEAD OF CRYPTO',
      subtitle: 'Receive factual institutional summaries directly to your inbox. No noise. Pure intelligence.',
      placeholder: 'Enter your institutional or personal email...',
      button: 'Subscribe Free',
      successMessage: 'Subscription confirmed. Welcome to CRYPTOVA Intelligence.',
      disclaimer: 'Zero spam. Unsubscribe anytime. Verified cryptographic editorial standards.',
    },
    footer: {
      disclaimer: 'Financial Information Disclaimer: All information provided by CRYPTOVA is published strictly for informational, educational, and journalistic purposes. Nothing contained herein constitutes financial, investment, legal, or tax advice. Cryptocurrency trading involves substantial risk of loss.',
      sourcePolicy: 'Source Attribution Policy: CRYPTOVA respects copyright and journalist integrity. Articles are synthesized factual briefings with full attribution and direct links to original sources.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      about: 'About Us',
      contact: 'Editorial Contact',
      copyright: 'CRYPTOVA Global Intelligence. All rights reserved.',
    },
    admin: {
      dashboard: 'Dashboard',
      automation: 'Automation Center',
      sources: 'RSS Sources',
      affiliates: 'Affiliate Manager',
      ads: 'Ad Manager',
      settings: 'System Settings',
      logout: 'Sign Out',
    },
  },
  ar: {
    brandSubtitle: 'الذكاء الاستخباراتي للعملات المشفرة العالمية',
    selectLanguage: 'اختر لغتك المفضلة',
    selectLanguagePrompt: 'حدد لغتك لتصفح كريبتوفا مع تلخيص تحريري فوري ومترجم بدقة.',
    breakingNews: 'عاجل وحصري',
    marketIntelligence: 'استخبارات السوق',
    liveMarketTicker: 'الأسواق المباشرة',
    latestNews: 'أحدث التقارير',
    featuredStory: 'الخبر الرئيسي',
    keyPoints: 'أبرز النقاط والحقائق',
    executiveSummary: 'الملخص التحريري التنفيذي',
    editorialAnalysis: 'التحليل الاستراتيجي',
    readOriginalSource: 'قراءة المصدر الأصلي',
    sourceAttribution: 'المصدر الأصلي',
    multipleSourcesReported: 'أكدت مصادر متعددة موثقة هذه التطورات',
    relatedStories: 'تقارير ذات صلة',
    relatedAssets: 'الأصول المراقبة',
    shareStory: 'مشاركة التقرير',
    copyLink: 'نسخ الرابط',
    copied: 'تم النسخ إلى الحافظة!',
    searchPlaceholder: 'ابحث في الأخبار، الرموز، المنصات، القوانين...',
    filterAll: 'كافة الأوقات',
    filter24h: 'آخر 24 ساعة',
    filter7d: 'آخر 7 أيام',
    filter30d: 'آخر 30 يوماً',
    categories: {
      all: 'كافة الأقسام',
      bitcoin: 'بيتكوين',
      ethereum: 'إيثيريوم',
      altcoins: 'العملات البديلة',
      defi: 'التمويل اللامركزي',
      regulation: 'التشريعات والرقابة',
      exchanges: 'منصات التداول',
      market: 'أسواق المال',
      web3: 'ويب 3 والتكنولوجيا',
    },
    market: {
      title: 'محطة أسواق العملات المشفرة العالمية',
      subtitle: 'أسعار موثقة لحظياً، أحجام السيولة، ومؤشرات السوق المؤسسية.',
      rank: 'الترتيب',
      asset: 'الأصل المالي',
      price: 'السعر (دولار)',
      change24h: 'التغير خلال 24 ساعة',
      high24h: 'أعلى سعر 24 ساعة',
      low24h: 'أدنى سعر 24 ساعة',
      marketCap: 'القيمة السوقية',
      volume24h: 'حجم التداول 24 ساعة',
      trend: 'مسار 7 أيام',
      searchCoins: 'ابحث بالاسم أو الرمز...',
    },
    newsletter: {
      title: 'كن في طليعة أسواق الكريبتو',
      subtitle: 'احصل على ملخصات موثقة وموجزة مباشرة في بريدك الإلكتروني. حقائق مجردة بلا تشتيت.',
      placeholder: 'أدخل بريدك الإلكتروني...',
      button: 'اشتراك مجاني',
      successMessage: 'تم تأكيد اشتراكك بنجاح في كريبتوفا.',
      disclaimer: 'نحترم خصوصيتك بالكامل. يمكنك إلغاء الاشتراك في أي وقت.',
    },
    footer: {
      disclaimer: 'إخلاء المسؤولية المالية: جميع المواد المنشورة على منصة كريبتوفا هي لأغراض إعلامية وتثقيفية وصحفية فقط، ولا تعد نصيحة استثمارية أو مالية أو قانونية. ينطوي تداول الأصول الرقمية على مخاطر عالية.',
      sourcePolicy: 'سياسة المصادر: تلتزم كريبتوفا بحقوق النشر والشفافية الصحفية مع ذكر المصادر الأصلية وتضمين روابطها مباشرة.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      about: 'عن المنصة',
      contact: 'هيئة التحرير',
      copyright: 'كريبتوفا للذكاء المالي. جميع الحقوق محفوظة.',
    },
    admin: {
      dashboard: 'لوحة التحكم',
      automation: 'مركز الأتمتة',
      sources: 'مصادر الأخبار',
      affiliates: 'برامج الإحالة',
      ads: 'إدارة الإعلانات',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
    },
  },
  bn: {
    brandSubtitle: 'গ্লোবাল ক্রিপ্টো ইন্টেলিজেন্স প্ল্যাটফর্ম',
    selectLanguage: 'আপনার ভাষা নির্বাচন করুন',
    selectLanguagePrompt: 'রিয়েল-টাইম সম্পাদকীয় সারাংশ সহ CRYPTOVA অভিজ্ঞতা নিতে আপনার পছন্দের ভাষা নির্বাচন করুন।',
    breakingNews: 'ব্রেকিং নিউজ',
    marketIntelligence: 'মার্কেট ইন্টেলিজেন্স',
    liveMarketTicker: 'লাইভ মার্কেট',
    latestNews: 'সর্বশেষ সংবাদ',
    featuredStory: 'প্রধান সংবাদ',
    keyPoints: 'মূল তথ্যাবলী',
    executiveSummary: 'নির্বাহী সম্পাদকীয় সারসংক্ষেপ',
    editorialAnalysis: 'বিশ্লেষণ ও পর্যালোচনা',
    readOriginalSource: 'মূল উৎস পড়ুন',
    sourceAttribution: 'সংবাদের মূল উৎস',
    multipleSourcesReported: 'একাধিক যাচাইকৃত সংবাদমাধ্যম এই তথ্য নিশ্চিত করেছে',
    relatedStories: 'সম্পর্কিত সংবাদ',
    relatedAssets: 'সংশ্লিষ্ট ক্রিপ্টো কয়েন',
    shareStory: 'সংবাদ শেয়ার করুন',
    copyLink: 'লিঙ্ক কপি করুন',
    copied: 'লিঙ্ক কপি করা হয়েছে!',
    searchPlaceholder: 'খবর, কয়েন, এক্সচেঞ্জ বা রেগুলেশন খুঁজুন...',
    filterAll: 'সব সময়',
    filter24h: 'গত ২৪ ঘণ্টা',
    filter7d: 'গত ৭ দিন',
    filter30d: 'গত ৩০ দিন',
    categories: {
      all: 'সব বিভাগ',
      bitcoin: 'বিটকয়েন',
      ethereum: 'ইথেরিয়াম',
      altcoins: 'অল্টকয়েন',
      defi: 'ডিফাই (DeFi)',
      regulation: 'আইন ও নিয়ন্ত্রণ',
      exchanges: 'এক্সচেঞ্জ',
      market: 'মার্কেট ট্রেন্ড',
      web3: 'ওয়েব ৩ ও প্রযুক্তি',
    },
    market: {
      title: 'গ্লোবাল ক্রিপ্টো মার্কেট টার্মিনাল',
      subtitle: 'রিয়েল-টাইম যাচাইকৃত মূল্য, লিকুইডিটি এবং প্রাতিষ্ঠানিক পরিসংখ্যান।',
      rank: 'র‍্যাংক',
      asset: 'অ্যাসেট',
      price: 'মূল্য (USD)',
      change24h: '২৪ ঘণ্টার পরিবর্তন',
      high24h: '২৪ ঘণ্টার সর্বোচ্চ',
      low24h: '২৪ ঘণ্টার সর্বনিম্ন',
      marketCap: 'মার্কেট ক্যাপ',
      volume24h: '২৪ ঘণ্টার ভলিউম',
      trend: '৭ দিনের ট্রেন্ড',
      searchCoins: 'কয়েনের নাম বা প্রতীক দিয়ে খুঁজুন...',
    },
    newsletter: {
      title: 'ক্রিপ্টো বাজারে সবসময় এগিয়ে থাকুন',
      subtitle: 'সরাসরি আপনার ইনবক্সে বস্তুনিষ্ঠ তথ্যভিত্তিক সারাংশ পান। কোনো অপ্রয়োজনীয় তথ্য নয়।',
      placeholder: 'আপনার ইমেল ঠিকানা লিখুন...',
      button: 'বিনামূল্যে সাবস্ক্রাইব করুন',
      successMessage: 'আপনার সাবস্ক্রিপশন নিশ্চিত হয়েছে। CRYPTOVA-তে স্বাগতম।',
      disclaimer: 'আমরা স্প্যাম করি না। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।',
    },
    footer: {
      disclaimer: 'আর্থিক তথ্যের দাবিত্যাগ: CRYPTOVA-তে প্রকাশিত সমস্ত তথ্য শুধুমাত্র সাংবাদিকতা ও শিক্ষামূলক উদ্দেশ্যে প্রস্তুত। এটি কোনো আর্থিক বা বিনিয়োগ পরামর্শ নয়। ক্রিপ্টোকারেন্সি ট্রেডিংয়ে আর্থিক ঝুঁকির সম্ভাবনা রয়েছে।',
      sourcePolicy: 'উৎস স্বীকৃতি নীতি: CRYPTOVA কপিরাইট ও সাংবাদিকতার সততা সম্মান করে এবং প্রতিটি সংবাদের মূল উৎসের লিঙ্ক অন্তর্ভুক্ত করে।',
      privacy: 'গোপনীয়তা নীতি',
      terms: 'ব্যবহারের শর্তাবলী',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      copyright: 'CRYPTOVA গ্লোবাল ইন্টেলিজেন্স। সর্বস্বত্ব সংরক্ষিত।',
    },
    admin: {
      dashboard: 'ড্যাশবোর্ড',
      automation: 'অটোমেশন সেন্টার',
      sources: 'আরএসএস সোর্স',
      affiliates: 'অ্যাফিলিয়েট ম্যানেজার',
      ads: 'বিজ্ঞাপন ম্যানেজার',
      settings: 'সেটিংস',
      logout: 'লগআউট',
    },
  },
  de: {
    brandSubtitle: 'GLOBALE KRYPTO-INTELLIGENZ',
    selectLanguage: 'Wählen Sie Ihre Sprache',
    selectLanguagePrompt: 'Wählen Sie Ihre bevorzugte Sprache für redaktionelle Krypto-Analysen in Echtzeit.',
    breakingNews: 'EILMELDUNG',
    marketIntelligence: 'Markt-Intelligenz',
    liveMarketTicker: 'Live-Märkte',
    latestNews: 'Aktuelle Berichte',
    featuredStory: 'Top-Nachricht',
    keyPoints: 'Wesentliche Fakten',
    executiveSummary: 'Redaktionelle Zusammenfassung',
    editorialAnalysis: 'Strategische Einordnung',
    readOriginalSource: 'Originalquelle lesen',
    sourceAttribution: 'Quelle',
    multipleSourcesReported: 'Mehrere verifizierte Quellen bestätigten diese Meldung',
    relatedStories: 'Verwandte Analysen',
    relatedAssets: 'Relevante Krypto-Assets',
    shareStory: 'Beitrag teilen',
    copyLink: 'Link kopieren',
    copied: 'In die Zwischenablage kopiert!',
    searchPlaceholder: 'Suche nach Nachrichten, Coins, Regulierungen...',
    filterAll: 'Gesamter Zeitraum',
    filter24h: 'Letzte 24 Stunden',
    filter7d: 'Letzte 7 Tage',
    filter30d: 'Letzte 30 Tage',
    categories: {
      all: 'Alle Ressorts',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      altcoins: 'Altcoins',
      defi: 'DeFi',
      regulation: 'Regulierung',
      exchanges: 'Börsen',
      market: 'Märkte',
      web3: 'Web3 & Tech',
    },
    market: {
      title: 'Globales Krypto-Marktterminal',
      subtitle: 'Verifizierte Echtzeitpreise, Handelsvolumina und institutionelle Kennzahlen.',
      rank: 'Rang',
      asset: 'Asset',
      price: 'Preis (USD)',
      change24h: '24h Änderung',
      high24h: '24h Hoch',
      low24h: '24h Tief',
      marketCap: 'Marktkapitalisierung',
      volume24h: '24h Volumen',
      trend: '7T Trend',
      searchCoins: 'Nach Namen oder Tickersymbol filtern...',
    },
    newsletter: {
      title: 'IMMER EINEN SCHRITT VORAUS',
      subtitle: 'Erhalten Sie präzise institutionelle Berichte direkt in Ihr Postfach. Keine Gerüchte, reine Fakten.',
      placeholder: 'Ihre E-Mail-Adresse...',
      button: 'Kostenlos abonnieren',
      successMessage: 'Abonnement bestätigt. Willkommen bei CRYPTOVA.',
      disclaimer: 'Kein Spam. Jederzeit kündbar. Streng journalistische Standards.',
    },
    footer: {
      disclaimer: 'Finanzinformationen-Hinweis: Alle auf CRYPTOVA veröffentlichten Inhalte dienen ausschließlich journalistischen und informativen Zwecken und stellen keine Anlageberatung dar. Krypto-Handel birgt erhebliche Verlustrisiken.',
      sourcePolicy: 'Quellenrichtlinie: CRYPTOVA wahrt Urheberrechte und journalistische Standards mit direkter Quellenverlinkung.',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      about: 'Über uns',
      contact: 'Redaktionskontakt',
      copyright: 'CRYPTOVA Global Intelligence. Alle Rechte vorbehalten.',
    },
    admin: {
      dashboard: 'Dashboard',
      automation: 'Automationszentrale',
      sources: 'RSS-Quellen',
      affiliates: 'Affiliate-Manager',
      ads: 'Werbebanner',
      settings: 'Einstellungen',
      logout: 'Abmelden',
    },
  },
  es: {
    brandSubtitle: 'INTELIGENCIA CRIPTO GLOBAL',
    selectLanguage: 'Seleccione su idioma',
    selectLanguagePrompt: 'Elija su idioma preferido para acceder a CRYPTOVA con síntesis editorial en tiempo real.',
    breakingNews: 'ÚLTIMA HORA',
    marketIntelligence: 'Inteligencia de Mercado',
    liveMarketTicker: 'Mercados en Vivo',
    latestNews: 'Últimas Noticias',
    featuredStory: 'Noticia Destacada',
    keyPoints: 'Puntos Clave y Hechos',
    executiveSummary: 'Resumen Editorial Ejecutivo',
    editorialAnalysis: 'Análisis Estratégico',
    readOriginalSource: 'Leer fuente original',
    sourceAttribution: 'Fuente original',
    multipleSourcesReported: 'Múltiples fuentes contrastadas han reportado este hecho',
    relatedStories: 'Informes Relacionados',
    relatedAssets: 'Activos Monitoreados',
    shareStory: 'Compartir historia',
    copyLink: 'Copiar enlace',
    copied: '¡Enlace copiado al portapapeles!',
    searchPlaceholder: 'Buscar noticias, tokens, exchanges, regulación...',
    filterAll: 'Todo',
    filter24h: 'Últimas 24 horas',
    filter7d: 'Últimos 7 días',
    filter30d: 'Últimos 30 días',
    categories: {
      all: 'Todas las secciones',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      altcoins: 'Altcoins',
      defi: 'DeFi',
      regulation: 'Regulación',
      exchanges: 'Exchanges',
      market: 'Mercados',
      web3: 'Web3 & Tecnología',
    },
    market: {
      title: 'Terminal de Mercados Cripto Global',
      subtitle: 'Cotizaciones en tiempo real, volúmenes de liquidez y métricas institucionales.',
      rank: 'Puesto',
      asset: 'Activo',
      price: 'Precio (USD)',
      change24h: 'Cambio 24h',
      high24h: 'Máx 24h',
      low24h: 'Mín 24h',
      marketCap: 'Cap. de Mercado',
      volume24h: 'Volumen 24h',
      trend: 'Tendencia 7D',
      searchCoins: 'Filtrar por nombre o ticker...',
    },
    newsletter: {
      title: 'ANTICÍPESE AL MERCADO CRIPTO',
      subtitle: 'Reciba análisis sintéticos y objetivos directamente en su bandeja de entrada. Sin rumores, solo datos.',
      placeholder: 'Introduzca su correo electrónico...',
      button: 'Suscribirse Gratis',
      successMessage: 'Suscripción confirmada. Bienvenido a CRYPTOVA.',
      disclaimer: 'Cero spam. Cancela en cualquier momento. Rigor periodístico contrastado.',
    },
    footer: {
      disclaimer: 'Aviso sobre información financiera: Todo el contenido publicado en CRYPTOVA se difunde con fines meramente informativos y periodísticos. No constituye asesoramiento financiero ni de inversión.',
      sourcePolicy: 'Política de fuentes: CRYPTOVA respeta la propiedad intelectual y enlaza siempre a la fuente periodística original.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      about: 'Quiénes somos',
      contact: 'Contacto Editorial',
      copyright: 'CRYPTOVA Global Intelligence. Todos los derechos reservados.',
    },
    admin: {
      dashboard: 'Panel de Control',
      automation: 'Centro de Automatización',
      sources: 'Fuentes RSS',
      affiliates: 'Afiliados',
      ads: 'Banners Publicitarios',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
    },
  },
  fr: {
    brandSubtitle: 'INTELLIGENCE CRYPTO MONDIALE',
    selectLanguage: 'Choisissez votre langue',
    selectLanguagePrompt: 'Sélectionnez votre langue pour découvrir CRYPTOVA avec synthèse éditoriale en temps réel.',
    breakingNews: 'DERNIÈRE MINUTE',
    marketIntelligence: 'Intelligence de Marché',
    liveMarketTicker: 'Marchés en direct',
    latestNews: 'Dépêches Récentes',
    featuredStory: 'À la une',
    keyPoints: 'Faits et Points Clés',
    executiveSummary: 'Synthèse Éditoriale Exécutive',
    editorialAnalysis: 'Analyse Stratégique',
    readOriginalSource: 'Consulter la source originale',
    sourceAttribution: 'Source originale',
    multipleSourcesReported: 'Plusieurs sources vérifiées ont rapporté cette information',
    relatedStories: 'Analyses Associées',
    relatedAssets: 'Actifs Numériques Suivis',
    shareStory: 'Partager l’article',
    copyLink: 'Copier le lien',
    copied: 'Copié dans le presse-papiers !',
    searchPlaceholder: 'Rechercher actualités, tokens, régulation...',
    filterAll: 'Tout l’historique',
    filter24h: 'Dernières 24 heures',
    filter7d: '7 derniers jours',
    filter30d: '30 derniers jours',
    categories: {
      all: 'Toutes les rubriques',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      altcoins: 'Altcoins',
      defi: 'DeFi',
      regulation: 'Régulation',
      exchanges: 'Plateformes',
      market: 'Marchés',
      web3: 'Web3 & Tech',
    },
    market: {
      title: 'Terminal Mondial des Marchés Crypto',
      subtitle: 'Cours certifiés en direct, volumes de liquidité et benchmarks institutionnels.',
      rank: 'Rang',
      asset: 'Actif',
      price: 'Cours (USD)',
      change24h: 'Variation 24h',
      high24h: 'Haut 24h',
      low24h: 'Bas 24h',
      marketCap: 'Capitalisation',
      volume24h: 'Volume 24h',
      trend: 'Tendance 7J',
      searchCoins: 'Rechercher par nom ou symbole...',
    },
    newsletter: {
      title: 'PRENEZ UNE LONGUEUR D’AVANCE',
      subtitle: 'Recevez nos synthèses factuelles directement dans votre boîte mail. Pas de bruit, l’intelligence pure.',
      placeholder: 'Votre adresse e-mail...',
      button: 'S’abonner Gratuitement',
      successMessage: 'Abonnement validé. Bienvenue sur CRYPTOVA.',
      disclaimer: 'Zéro spam. Désabonnement à tout instant. Déontologie journalistique stricte.',
    },
    footer: {
      disclaimer: 'Avertissement légal : Les contenus de CRYPTOVA sont fournis à titre strictement journalistique et pédagogique. Ils ne constituent en aucun cas des conseils financiers ou d’investissement.',
      sourcePolicy: 'Politique de citations : CRYPTOVA honore le droit d’auteur et redirige systématiquement vers les sources officielles.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d’Utilisation',
      about: 'À propos',
      contact: 'Rédaction',
      copyright: 'CRYPTOVA Global Intelligence. Tous droits réservés.',
    },
    admin: {
      dashboard: 'Tableau de bord',
      automation: 'Centre d’Automatisation',
      sources: 'Sources RSS',
      affiliates: 'Affiliations',
      ads: 'Bannières Pub',
      settings: 'Paramètres',
      logout: 'Déconnexion',
    },
  },
};
