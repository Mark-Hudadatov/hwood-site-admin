/**
 * SERVICE PAGE
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { Service, Subservice, Story } from '../domain/types';
import { supabase } from '../services/supabase';
import { getStories } from '../services/data/dataService';
import { ROUTES } from '../router';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none"><rect width="800" height="1000" fill="#1a1a1a"/><g transform="translate(360, 460)" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.4"><rect x="0" y="0" width="80" height="50" rx="3"/><rect x="8" y="12" width="20" height="30" rx="2"/><rect x="33" y="12" width="20" height="30" rx="2"/><rect x="58" y="12" width="15" height="20" rx="2"/><circle cx="18" cy="27" r="2" fill="#ffffff" fill-opacity="0.4"/><circle cx="43" cy="27" r="2" fill="#ffffff" fill-opacity="0.4"/><circle cx="65" cy="22" r="1.5" fill="#ffffff" fill-opacity="0.4"/></g></svg>`)}`;

// =============================================================================
// SUBSERVICE CARD
// =============================================================================

interface SubserviceCardProps {
  subservice: Subservice & { visibilityStatus?: string };
  onClick: () => void;
}

const SubserviceCard: React.FC<SubserviceCardProps> = ({ subservice, onClick }) => {
  const isComingSoon = subservice.visibilityStatus === 'coming_soon';
  const [imgSrc, setImgSrc] = useState(subservice.imageUrl || FALLBACK_IMAGE);

  return (
    <div
      className={`relative w-[280px] md:w-[300px] flex-shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-lg ${
        isComingSoon ? '' : 'group cursor-pointer'
      }`}
      onClick={isComingSoon ? undefined : onClick}
    >
      <img
        src={imgSrc}
        alt={subservice.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
          isComingSoon ? 'grayscale brightness-50' : 'group-hover:scale-105'
        }`}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />

      {isComingSoon && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
          <Clock className="w-10 h-10 text-white mb-3" />
          <span className="text-white text-body-lg font-medium uppercase tracking-wider">Coming Soon</span>
        </div>
      )}

      {!isComingSoon && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      )}

      <div className={`absolute bottom-0 left-0 right-0 p-5 ${isComingSoon ? 'opacity-50' : ''}`}>
        <h3 className="text-white text-body-lg font-semibold mb-1 leading-tight">{subservice.title}</h3>
        {subservice.description && (
          <p className="text-white/70 text-meta-sm leading-snug line-clamp-2">{subservice.description}</p>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// HORIZONTAL SCROLL WITH ARROWS
// =============================================================================

interface HorizontalScrollProps {
  children: React.ReactNode;
  title: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'right' ? 340 : -340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-neutral-900 text-h1 font-medium tracking-tight">
          {title}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              showLeftArrow
                ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer'
                : 'border-neutral-300 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              showRightArrow
                ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer'
                : 'border-neutral-300 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
        <div className="w-4 flex-shrink-0" />
      </div>
    </div>
  );
};

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="w-full bg-neutral-200 h-[300px]" />
    <div className="px-16 py-12">
      <div className="h-10 w-64 bg-neutral-200 rounded mb-8" />
      <div className="flex gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-[300px] flex-shrink-0">
            <div className="aspect-[3/4] bg-neutral-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// =============================================================================
// NOT FOUND STATE
// =============================================================================

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-h1 font-medium text-neutral-900 mb-4">Service Not Found</h1>
      <p className="text-body text-neutral-600 mb-8">The service you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
        Back to Home
      </Link>
    </div>
  </div>
);

// =============================================================================
// HELPERS
// =============================================================================

function deriveHeroColors(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  const dark  = `#${toHex(Math.round(r * 0.42))}${toHex(Math.round(g * 0.44))}${toHex(Math.round(b * 0.42))}`;
  const deep  = `#${toHex(Math.round(r * 0.25))}${toHex(Math.round(g * 0.27))}${toHex(Math.round(b * 0.25))}`;
  const glow       = `rgba(${r},${g},${b},0.22)`;
  const glow2      = `rgba(${r},${g},${b},0.12)`;
  const softTint   = `rgba(${r},${g},${b},0.06)`;
  const softBorder = `rgba(${r},${g},${b},0.14)`;
  const softText   = `rgba(${r},${g},${b},0.7)`;
  const softDark   = `rgba(${r},${g},${b},0.85)`;
  return { dark, deep, glow, glow2, softTint, softBorder, softText, softDark };
}

interface OrderTypeConfig {
  label: string; labelHe: string;
  chipBg: string; chipFg: string; chipBorder: string;
  ctaLabel: string; ctaLabelHe: string;
  howTitle: string; howTitleHe: string;
}

const ORDER_TYPE_MAP: Record<string, OrderTypeConfig> = {
  'browse-and-order': {
    label: 'CATALOG', labelHe: 'קטלוג',
    chipBg: 'rgba(0,95,95,0.18)', chipFg: '#5ce3c9', chipBorder: 'rgba(0,212,170,0.30)',
    ctaLabel: 'Browse the catalog', ctaLabelHe: 'עיין בקטלוג',
    howTitle: 'From your first click to a costed plan in 24 hours.',
    howTitleHe: 'מהקליק הראשון לתוכנית מחירים תוך 24 שעות.',
  },
  'send-file-and-process': {
    label: 'SERVICE', labelHe: 'שירות',
    chipBg: 'rgba(29,78,216,0.22)', chipFg: '#7fa8ff', chipBorder: 'rgba(91,157,255,0.30)',
    ctaLabel: 'Upload your DXF', ctaLabelHe: 'העלה קובץ DXF',
    howTitle: 'From your DXF to a costed plan.',
    howTitleHe: 'מה-DXF שלך לתוכנית מחירים.',
  },
  'describe-and-request': {
    label: 'PROJECT', labelHe: 'פרויקט',
    chipBg: 'rgba(180,83,9,0.22)', chipFg: '#f4a64b', chipBorder: 'rgba(244,166,75,0.32)',
    ctaLabel: 'Describe your project', ctaLabelHe: 'תאר את הפרויקט',
    howTitle: 'From your first idea to an installed result.',
    howTitleHe: 'מהרעיון הראשון לתוצאה מותקנת.',
  },
  'informational': {
    label: 'INFO', labelHe: 'מידע',
    chipBg: 'rgba(115,115,115,0.18)', chipFg: '#d4d4d4', chipBorder: 'rgba(163,163,163,0.30)',
    ctaLabel: 'Get in touch', ctaLabelHe: 'צור קשר',
    howTitle: 'How we work.',
    howTitleHe: 'איך אנחנו עובדים.',
  },
};

function getOrderTypeConfig(orderType?: string): OrderTypeConfig {
  return ORDER_TYPE_MAP[orderType || 'informational'] || ORDER_TYPE_MAP['informational'];
}

interface PageContent {
  howSteps: { n: string; en: { t: string; d: string }; he: { t: string; d: string } }[];
  whoIntro: { en: string; he: string };
  who: { n: string; role: { en: string; he: string }; title: { en: string; he: string }; desc: { en: string; he: string } }[];
}

const PAGE_CONTENT: Record<string, PageContent> = {
  'browse-and-order': {
    howSteps: [
      { n: '01', en: { t: 'Browse the catalog',      d: '30+ ready cabinet modules. Filter by size, function, doors.' },        he: { t: 'עיין בקטלוג',         d: '30+ מודולי ארונות מוכנים. סנן לפי גודל, פונקציה, דלתות.' } },
      { n: '02', en: { t: 'Configure & add to list', d: 'Pick variant, material, edge band. Build your set.' },                  he: { t: 'הגדר והוסף לרשימה',  d: 'בחר וריאנט, חומר, עיטוף קצה. בנה את הסט שלך.' } },
      { n: '03', en: { t: 'Get a costed quote',      d: 'Within 1 business day. Materials, lead time, breakdown.' },            he: { t: 'קבל הצעת מחיר',      d: 'תוך יום עסקים. חומרים, זמן אספקה, פירוט.' } },
      { n: '04', en: { t: 'Production & delivery',   d: 'We manufacture and deliver to your site or workshop.' },              he: { t: 'ייצור ואספקה',       d: 'אנחנו מייצרים ומספקים לאתר שלך.' } },
    ],
    whoIntro: { en: 'If you produce cabinets at scale, we speak the same language.', he: 'אם אתם מייצרים ארונות בקנה מידה, אנחנו מדברים באותה שפה.' },
    who: [
      { n: '01/03', role: { en: 'Cabinet manufacturers', he: 'יצרני ארונות' },    title: { en: 'Series & project-based factories', he: 'מפעלים סדרתיים ופרויקטאלים' }, desc: { en: 'Repeatable manufacturing, dimensional consistency, predictable SKU throughput.',            he: 'ייצור חוזר, עקביות מידות, תפוקת SKU צפויה.' } },
      { n: '02/03', role: { en: 'Kitchen studios',       he: 'סטודיואי מטבחים' }, title: { en: 'Studio retailers shipping series',    he: 'קמעונאי סטודיו המשגרים סדרות' },       desc: { en: 'Standard modules, fast lead time, white-label ready.',                                   he: 'מודולים סטנדרטיים, זמן אספקה מהיר, מוכן לתיוג פרטי.' } },
      { n: '03/03', role: { en: 'Fit-out contractors',   he: 'קבלני פנים' },       title: { en: 'Site-ready cabinetry',               he: 'ארונות מוכנים לאתר' },                  desc: { en: 'Pre-assembled units, on-site delivery scheduling, system-compatible.',                    he: 'יחידות מורכבות מראש, תזמון אספקה לאתר, תואם מערכת.' } },
    ],
  },
  'send-file-and-process': {
    howSteps: [
      { n: '01', en: { t: 'Send your file',     d: 'DXF, DWG, panel XLS, or sketch — drag and drop.' },              he: { t: 'שלח את הקובץ',   d: 'DXF, DWG, XLS פנלים, או סקיצה — גרור ושחרר.' } },
      { n: '02', en: { t: 'Spec confirmation',  d: 'We confirm material, edge, quantity. Costed plan back to you.' }, he: { t: 'אישור מפרט',     d: 'אנחנו מאשרים חומר, קצה, כמות. תוכנית מחירים אליך.' } },
      { n: '03', en: { t: 'CNC processing',     d: 'Cut, edge-banded, drilled. Quality-checked before shipping.' },  he: { t: 'עיבוד CNC',      d: 'חיתוך, עיטוף קצה, קידוח. בדיקת איכות לפני משלוח.' } },
      { n: '04', en: { t: 'Pickup or delivery', d: 'Collect from Netanya or we ship to your site.' },                he: { t: 'איסוף או משלוח', d: 'אסוף מנתניה או שנשלח לאתר שלך.' } },
    ],
    whoIntro: { en: 'If you process panels for clients, we speak the same language.', he: 'אם אתם מעבדים פנלים ללקוחות, אנחנו מדברים באותה שפה.' },
    who: [
      { n: '01/03', role: { en: 'Carpentry & joinery',   he: 'נגרות ועיבוד עץ' },    title: { en: 'Pro workshops scaling output',  he: 'סדנאות מקצועיות המגדילות תפוקה' }, desc: { en: 'Send DXF or panel list; we cut, edge, and ship back ready-to-assemble.', he: 'שלח DXF או רשימת פנלים; אנחנו חותכים, מעטפים ומשגרים מוכן להרכבה.' } },
      { n: '02/03', role: { en: 'Architecture studios',  he: 'סטודיואי אדריכלות' },  title: { en: 'Custom panel processing',       he: 'עיבוד פנלים מותאם' },              desc: { en: 'Spec-driven CNC machining for non-standard geometry.',                he: 'עיבוד CNC מבוסס מפרט לגאומטריה לא סטנדרטית.' } },
      { n: '03/03', role: { en: 'Facade contractors',    he: 'קבלני חזית' },          title: { en: 'Facade & ACP processing',       he: 'עיבוד חזית ו-ACP' },              desc: { en: 'ACP, HPL, and aluminum composite cutting under Skylum brand.',         he: 'חיתוך ACP, HPL ואלומיניום קומפוזיט תחת מותג Skylum.' } },
    ],
  },
  'describe-and-request': {
    howSteps: [
      { n: '01', en: { t: 'Describe your vision', d: "Photos, sketch, words. We don't need CAD to start." }, he: { t: 'תאר את החזון',      d: 'תמונות, סקיצה, מילים. לא צריך CAD כדי להתחיל.' } },
      { n: '02', en: { t: 'Engineering brief',    d: 'We translate your idea into a manufacturing spec.' },   he: { t: 'ברף הנדסי',         d: 'אנחנו מתרגמים את הרעיון שלך למפרט ייצור.' } },
      { n: '03', en: { t: 'Materials & quote',    d: 'Pick finishes, get a costed proposal you can compare.' }, he: { t: 'חומרים והצעת מחיר', d: 'בחר גימורים, קבל הצעה מפורטת להשוואה.' } },
      { n: '04', en: { t: 'Build & install',      d: 'Production at our facility, install at yours.' },        he: { t: 'בנייה והתקנה',      d: 'ייצור במפעל שלנו, התקנה אצלך.' } },
    ],
    whoIntro: { en: 'If you build one-of-a-kind interiors, we speak the same language.', he: 'אם אתם בונים פנים ייחודיים, אנחנו מדברים באותה שפה.' },
    who: [
      { n: '01/03', role: { en: 'Private clients',     he: 'לקוחות פרטיים' },  title: { en: 'End-to-end custom kitchens',      he: 'מטבחים מותאמים אישית מקצה לקצה' }, desc: { en: 'From a sketch on paper to installed kitchen — engineering, materials, fitting.', he: 'מסקיצה על נייר למטבח מותקן — הנדסה, חומרים, התקנה.' } },
      { n: '02/03', role: { en: 'Interior designers', he: 'מעצבי פנים' },      title: { en: 'Designer-led custom interiors',   he: 'פנים מותאמים בהובלת מעצב' },       desc: { en: 'We translate your design into manufacturing-ready specs.',                         he: 'אנחנו מתרגמים את העיצוב שלך למפרטים מוכנים לייצור.' } },
      { n: '03/03', role: { en: 'Architects',          he: 'אדריכלים' },        title: { en: 'Bespoke residential projects',    he: 'פרויקטים למגורים ייחודיים' },       desc: { en: 'Cabinetry, fronts, custom storage — engineered to your design.',                  he: 'ארונות, חזיתות, אחסון מותאם — מהונדס לפי העיצוב שלך.' } },
    ],
  },
  'informational': {
    howSteps: [
      { n: '01', en: { t: 'Browse our range',  d: 'Explore materials, systems, and panel options.' },                     he: { t: 'עיין בטווח שלנו', d: 'חקור חומרים, מערכות ואפשרויות פנלים.' } },
      { n: '02', en: { t: 'Request samples',   d: 'We send material samples to your office or site.' },                  he: { t: 'בקש דוגמאות',    d: 'אנחנו שולחים דוגמאות חומר למשרד או לאתר שלך.' } },
      { n: '03', en: { t: 'Specify & order',   d: 'Confirm spec, quantities and delivery schedule.' },                   he: { t: 'ציין והזמן',      d: 'אשר מפרט, כמויות ולוח זמנים לאספקה.' } },
      { n: '04', en: { t: 'Site delivery',     d: 'Panels delivered labelled and sequenced for installation.' },        he: { t: 'אספקה לאתר',     d: 'פנלים מסופקים עם תיוג ורצף להתקנה.' } },
    ],
    whoIntro: { en: 'If you specify or source building materials, we speak the same language.', he: 'אם אתם מציינים או מקורדים חומרי בנייה, אנחנו מדברים באותה שפה.' },
    who: [
      { n: '01/03', role: { en: 'Specifiers & architects', he: 'מציינים ואדריכלים' }, title: { en: 'Spec-grade materials',       he: 'חומרים ברמת מפרט' },          desc: { en: 'ACP, HPL and composite panels to project specification.',                                         he: 'פנלי ACP, HPL וקומפוזיט לפי מפרט הפרויקט.' } },
      { n: '02/03', role: { en: 'Facade contractors',      he: 'קבלני חזית' },         title: { en: 'Ready-cut panel supply',    he: 'אספקת פנלים חתוכים מוכנים' }, desc: { en: 'Panels cut to your elevation drawings, delivered to site.',                                        he: 'פנלים חתוכים לפי שרטוטי חזית, מסופקים לאתר.' } },
      { n: '03/03', role: { en: 'Main contractors',        he: 'קבלנים ראשיים' },       title: { en: 'Supply & logistics',        he: 'אספקה ולוגיסטיקה' },          desc: { en: 'Bulk supply with sequenced delivery to match your programme.',                                    he: 'אספקה בכמות גדולה עם משלוח מרוצף התואם לתכנית שלך.' } },
    ],
  },
};

function getPageContent(orderType?: string): PageContent {
  return PAGE_CONTENT[orderType || 'informational'] || PAGE_CONTENT['informational'];
}

// =============================================================================
// MAIN SERVICE PAGE
// =============================================================================

export const ServicePage: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const lang = getCurrentLang();

  const [service, setService] = useState<Service | null>(null);
  const [subservices, setSubservices] = useState<(Subservice & { visibilityStatus?: string })[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [orderType, setOrderType] = useState<string>('informational');
  const [brand, setBrand] = useState<string>('hwood');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!serviceSlug) return;

      setIsLoading(true);

      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .eq('slug', serviceSlug)
        .single();

      if (serviceData) {
        setService({
          id: serviceData.id,
          slug: serviceData.slug,
          title: lang === 'he' && serviceData.title_he ? serviceData.title_he : serviceData.title_en,
          description: lang === 'he' && serviceData.description_he ? serviceData.description_he : serviceData.description_en || '',
          imageUrl: serviceData.image_url || '',
          heroImageUrl: serviceData.hero_image_url,
          accentColor: serviceData.accent_color,
        });

        if (serviceData.order_type) setOrderType(serviceData.order_type);
        if (serviceData.brand) setBrand(serviceData.brand);

        const { data: subsData } = await supabase
          .from('subservices')
          .select('*')
          .eq('service_id', serviceData.id)
          .in('visibility_status', ['visible', 'coming_soon'])
          .order('sort_order', { ascending: true });

        if (subsData) {
          setSubservices(subsData.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            serviceId: s.service_id,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
            imageUrl: s.image_url || '',
            heroImageUrl: s.hero_image_url,
            visibilityStatus: s.visibility_status,
          })));
        }

        const allStories = await getStories();
        setStories(allStories.slice(0, 3));
      }

      setIsLoading(false);
    };

    loadData();
    window.scrollTo(0, 0);
  }, [serviceSlug, lang]);

  const handleSubserviceClick = (subservice: Subservice) => {
    navigate(ROUTES.SUBSERVICE(subservice.slug));
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!service) return <NotFound />;

  const accentColor = service.accentColor || '#D48F28';
  const heroColors = deriveHeroColors(accentColor);
  const otConfig = getOrderTypeConfig(orderType);
  const content = getPageContent(orderType);
  const isSkylum = brand === 'skylum';

  return (
    <div className="w-full flex flex-col bg-white">

      {/* ── HERO ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 360, display: 'flex', alignItems: 'flex-end', paddingBottom: 52,
      }}>
        {/* Gradient background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${heroColors.deep} 0%, ${heroColors.dark} 55%, ${heroColors.deep} 100%)`,
        }} />
        {/* Radial glow spots */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 18% 55%, ${heroColors.glow} 0%, transparent 55%),
            radial-gradient(ellipse at 75% 15%, ${heroColors.glow2} 0%, transparent 45%),
            radial-gradient(ellipse at 90% 85%, ${heroColors.glow2} 0%, transparent 40%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-16 lg:px-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
            <span className="cursor-pointer hover:text-white transition-colors" style={{ color: 'inherit' }} onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{service.title}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {isSkylum ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 4, background: 'rgba(20,26,92,0.7)', color: '#cfe4ff', border: '1px solid rgba(127,201,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: '#7FC9FF', flexShrink: 0 }} />
                SKYLUM
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 4, background: 'rgba(0,95,95,0.15)', color: '#5ce3c9', border: '1px solid rgba(0,212,170,0.30)', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: '#5ce3c9', flexShrink: 0 }} />
                HWOOD
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 4, background: otConfig.chipBg, color: otConfig.chipFg, border: `1px solid ${otConfig.chipBorder}`, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {lang === 'he' ? otConfig.labelHe : otConfig.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-semibold leading-none tracking-tight mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', maxWidth: 700 }}>
            {service.title}
          </h1>

          {/* Description */}
          {service.description && (
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: 560, fontWeight: 300 }}>
              {service.description}
            </p>
          )}
        </div>
      </div>

      {/* ── SUBSERVICES — UNCHANGED ── */}
      <div
        className="w-full px-4 md:px-12 lg:px-16 pb-20"
        style={{ background: `linear-gradient(180deg, ${heroColors.dark} 0%, ${heroColors.deep} 100%)` }}
      >
        {subservices.length > 0 ? (
          <HorizontalScroll title="Solutions">
            {subservices.map((sub) => (
              <SubserviceCard
                key={sub.id}
                subservice={sub}
                onClick={() => handleSubserviceClick(sub)}
              />
            ))}
          </HorizontalScroll>
        ) : (
          <div className="text-center py-12 text-[#1A1A1A]/60">
            No solutions available for this service yet.
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '72px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${heroColors.deep} 0%, ${heroColors.dark} 50%, ${heroColors.deep} 100%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 15% 60%, ${heroColors.glow} 0%, transparent 50%), radial-gradient(ellipse at 85% 25%, ${heroColors.glow2} 0%, transparent 45%)`, pointerEvents: 'none' }} />

        <div className="relative z-10 px-6 md:px-16 lg:px-20">
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: otConfig.chipFg, marginBottom: 14 }}>
            {lang === 'he' ? 'איך זה עובד' : 'How it works'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fff', marginBottom: 48, maxWidth: 680 }}>
            {lang === 'he' ? otConfig.howTitleHe : otConfig.howTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {content.howSteps.map((step, i) => (
              <div key={step.n} style={{ position: 'relative' }}>
                {i < 3 && (
                  <div className="hidden lg:block" style={{ position: 'absolute', right: -10, top: 24, zIndex: 1, color: 'rgba(255,255,255,0.25)', fontSize: 18, lineHeight: 1 }}>→</div>
                )}
                <div style={{ padding: '24px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(8px)', height: '100%' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: otConfig.chipFg, marginBottom: 14 }}>{step.n}</div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
                    {lang === 'he' ? step.he.t : step.en.t}
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                    {lang === 'he' ? step.he.d : step.en.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section style={{ padding: '72px 0', background: '#fff' }}>
        <div className="px-6 md:px-16 lg:px-20">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a3a3a3', marginBottom: 6 }}>
                {lang === 'he' ? 'עבודות' : 'Work'}
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a', margin: 0 }}>
                {lang === 'he' ? 'פורטפוליו' : 'Portfolio'}
              </h2>
            </div>
            <button
              onClick={() => navigate('/portfolio')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0a0a0a', background: 'transparent', border: 0, cursor: 'pointer' }}
            >
              {lang === 'he' ? 'כל הפרויקטים' : 'View all projects'} →
            </button>
          </div>
          <div style={{ height: 1, background: '#e5e5e5', marginBottom: 32 }} />

          {stories.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {stories.map(story => (
                <div
                  key={story.id}
                  onClick={() => navigate(`/stories/${story.slug}`)}
                  style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: '#f5f5f5', border: '1px solid #ebebeb', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px -8px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#e5e5e5' }}>
                    {story.imageUrl ? (
                      <img src={story.imageUrl} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#d4d4d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a3a3a3', marginBottom: 6 }}>{story.type}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', lineHeight: 1.35, marginBottom: 6 }}>{story.title}</h3>
                    {story.excerpt && (
                      <p style={{ fontSize: 13, color: '#737373', lineHeight: 1.55, margin: 0 }}>{story.excerpt}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ aspectRatio: '4/3', borderRadius: 12, border: '1.5px dashed #d4d4d4', background: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c4c4c4' }}>Project slot</div>
                  <div style={{ fontSize: 12, color: '#c4c4c4' }}>Awaiting first case study</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section style={{ padding: '72px 0', background: heroColors.softTint, borderTop: `1px solid ${heroColors.softBorder}` }}>
        <div className="px-6 md:px-16 lg:px-20">
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: heroColors.softDark, marginBottom: 12, opacity: 0.7 }}>
            {lang === 'he' ? 'למי זה מיועד' : 'Who this is for'}
          </div>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: heroColors.softDark, marginBottom: 36, maxWidth: 560, lineHeight: 1.55, fontWeight: 400 }}>
            {lang === 'he' ? content.whoIntro.he : content.whoIntro.en}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {content.who.map(w => (
              <div key={w.n} style={{ padding: '22px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: `1px solid ${heroColors.softBorder}`, backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: heroColors.softText, marginBottom: 8 }}>{w.n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: heroColors.softText, marginBottom: 5, opacity: 0.75 }}>
                  {lang === 'he' ? w.role.he : w.role.en}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: heroColors.softDark, marginBottom: 8, lineHeight: 1.3 }}>
                  {lang === 'he' ? w.title.he : w.title.en}
                </h4>
                <p style={{ fontSize: 13, color: heroColors.softText, lineHeight: 1.55, margin: 0 }}>
                  {lang === 'he' ? w.desc.he : w.desc.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${heroColors.deep} 0%, ${heroColors.dark} 60%, ${heroColors.deep} 100%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 25% 50%, ${heroColors.glow} 0%, transparent 55%)`, pointerEvents: 'none' }} />

        <div className="relative z-10 px-6 md:px-16 lg:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: otConfig.chipFg, marginBottom: 10 }}>
              {lang === 'he' ? 'התחל עכשיו' : 'Start now'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0, lineHeight: 1.15 }}>
              {lang === 'he' ? otConfig.ctaLabelHe : otConfig.ctaLabel}
            </h2>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: heroColors.dark, border: 0, padding: '14px 28px', borderRadius: 999, flexShrink: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.3)' }}
          >
            {lang === 'he' ? otConfig.ctaLabelHe : otConfig.ctaLabel}
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

    </div>
  );
};
