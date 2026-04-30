/**
 * SERVICE PAGE — v2.1
 * ====================
 * Fix: hero gradient now uses inline style (reliable, no CSS-file dependency).
 * Fix: 4 distinct themes from Design System (teal/indigo/copper/skylum).
 * Fix: hero_theme field in Supabase drives the theme; fallback from order_type+brand.
 *
 * Hero theme resolution order:
 *   1. svc.hero_theme (set in admin panel, stored in services.hero_theme)
 *   2. Inferred from order_type + brand
 *   3. Default → 'teal'
 *
 * Admin control: Admin sets hero_theme in AdminServices (select dropdown).
 *   No code change needed when adding new services or swapping themes.
 *   accent_color overrides only the highlight/glow color within the active theme.
 *
 * 7-block structure:
 *   01 Hero · 02 Subservices · 03 How to Order · 04 Who Orders This
 *   05 About the Factory · 06 Portfolio · 07 CTA Banner
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight, Clock,
  FileUp, Layers, UserCheck, Grid2X2, SlidersHorizontal, Send,
  PenLine, Paperclip, Phone, Info, Building2,
} from 'lucide-react';

import { Service, Subservice, Story } from '../domain/types';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';
import {
  HOW_TO_ORDER_MAP,
  WHO_ORDERS_MAP,
  CTA_MAP,
  resolveOrderType,
  resolveBrand,
  OrderType,
  Brand,
} from '../services/data/serviceContextMap';

// =============================================================================
// HERO THEMES
// Four presets from Design System v2.1.
// theme key is stored in services.hero_theme (admin-controlled).
// Fallback is inferred from order_type + brand.
// =============================================================================

export type HeroTheme = 'teal' | 'indigo' | 'copper' | 'skylum';

interface HeroThemeConfig {
  /** CSS gradient string applied as inline style on the hero section */
  gradient: string;
  /** Decorative SVG element rendered on the right of the hero */
  svgPattern: 'cnc' | 'catalog' | 'kitchen' | 'facade';
  /** Highlight color — title accent span + glow dot */
  highlight: string;
  /** Glow box-shadow for the dot */
  glowShadow: string;
}

const HERO_THEMES: Record<HeroTheme, HeroThemeConfig> = {
  /** Factory Teal — send-file-and-process (CNC Services) */
  teal: {
    gradient: [
      'radial-gradient(120% 80% at 90% 10%, rgba(0,212,170,.28) 0%, transparent 55%)',
      'radial-gradient(90% 100% at 15% 110%, rgba(0,95,95,.55) 0%, transparent 60%)',
      'linear-gradient(135deg, #002828 0%, #003d3d 45%, #001a1a 100%)',
    ].join(', '),
    svgPattern: 'cnc',
    highlight: '#00d4aa',
    glowShadow: '0 0 24px rgba(0,212,170,.9)',
  },
  /** Catalog Indigo — browse-and-order (Cabinet Modules, Fronts) */
  indigo: {
    gradient: [
      'radial-gradient(120% 80% at 90% 10%, rgba(91,157,255,.28) 0%, transparent 55%)',
      'radial-gradient(90% 100% at 15% 110%, rgba(26,58,95,.60) 0%, transparent 60%)',
      'linear-gradient(135deg, #0a1a35 0%, #1a3a5f 45%, #050d1f 100%)',
    ].join(', '),
    svgPattern: 'catalog',
    highlight: '#5b9dff',
    glowShadow: '0 0 24px rgba(91,157,255,.9)',
  },
  /** Workshop Copper — describe-and-request (Custom Kitchen, Facade HWOOD) */
  copper: {
    gradient: [
      'radial-gradient(120% 80% at 90% 10%, rgba(244,166,75,.22) 0%, transparent 55%)',
      'radial-gradient(90% 100% at 15% 110%, rgba(74,40,23,.65) 0%, transparent 60%)',
      'linear-gradient(135deg, #2a1810 0%, #4a2817 45%, #180a04 100%)',
    ].join(', '),
    svgPattern: 'kitchen',
    highlight: '#F4A64B',
    glowShadow: '0 0 24px rgba(244,166,75,.9)',
  },
  /** Skylum Facade — brand: skylum (Facade Systems & ACP) */
  skylum: {
    gradient: [
      'radial-gradient(120% 80% at 85% 10%, rgba(0,145,219,.35) 0%, transparent 55%)',
      'radial-gradient(90% 100% at 10% 110%, rgba(16,80,160,.65) 0%, transparent 60%)',
      'linear-gradient(135deg, #141A5C 0%, #1050A0 45%, #0D1440 100%)',
    ].join(', '),
    svgPattern: 'facade',
    highlight: '#7FC9FF',
    glowShadow: '0 0 24px rgba(127,201,255,.9)',
  },
};

/** Default theme per order_type + brand */
const DEFAULT_THEME: Record<Brand, Record<OrderType, HeroTheme>> = {
  hwood: {
    'browse-and-order':      'indigo',
    'send-file-and-process': 'teal',
    'describe-and-request':  'copper',
  },
  skylum: {
    'browse-and-order':      'skylum',
    'send-file-and-process': 'skylum',
    'describe-and-request':  'skylum',
  },
};

const resolveHeroTheme = (
  heroThemeRaw: string | null | undefined,
  brand: Brand,
  orderType: OrderType,
): HeroTheme => {
  const valid: HeroTheme[] = ['teal', 'indigo', 'copper', 'skylum'];
  if (heroThemeRaw && valid.includes(heroThemeRaw as HeroTheme)) {
    return heroThemeRaw as HeroTheme;
  }
  return DEFAULT_THEME[brand][orderType];
};

// =============================================================================
// HELPERS
// =============================================================================

// TODO: extract to src/utils/lang.ts
const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('i18nextLng')?.startsWith('he') ? 'he' : 'en';
};

const t = (en: string, he: string, lang: 'en' | 'he') => (lang === 'he' ? he : en);

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileUp, Layers, UserCheck, Grid2X2, SlidersHorizontal, Send, PenLine, Paperclip, Phone,
};

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">' +
  '<rect width="800" height="600" fill="#1a1a1a"/>' +
  '<g transform="translate(360,280)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.2">' +
  '<rect x="0" y="0" width="80" height="50" rx="3"/>' +
  '<rect x="8" y="12" width="20" height="28" rx="2"/>' +
  '<rect x="33" y="12" width="20" height="28" rx="2"/>' +
  '</g></svg>'
)}`;

// =============================================================================
// TYPES
// =============================================================================

interface ServiceFull extends Service {
  brand: Brand;
  orderType: OrderType;
  heroTheme: HeroTheme;
  visibilityStatus?: string;
}

interface SubserviceWithStatus extends Subservice {
  visibilityStatus?: string;
}

// =============================================================================
// DECORATIVE SVG PATTERNS (theme-specific, right side of hero)
// =============================================================================

const HeroSVGPattern: React.FC<{ pattern: HeroThemeConfig['svgPattern'] }> = ({ pattern }) => {
  const base = 'absolute right-0 bottom-0 w-[520px] h-[300px] opacity-[0.2] text-white pointer-events-none';
  if (pattern === 'cnc') return (
    <svg className={base} viewBox="0 0 620 360" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="40" y="40" width="540" height="280" rx="6" />
      <path d="M70 70 H320 V150 H180 V230 H500 V120 H420" />
      <circle cx="320" cy="150" r="5" /><circle cx="180" cy="230" r="5" />
      <circle cx="500" cy="120" r="5" /><circle cx="420" cy="120" r="5" />
    </svg>
  );
  if (pattern === 'catalog') return (
    <svg className={base} viewBox="0 0 640 300" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="40" y="30" width="120" height="110" rx="2" />
      <rect x="170" y="30" width="160" height="110" rx="2" />
      <rect x="340" y="30" width="100" height="110" rx="2" />
      <rect x="450" y="30" width="140" height="110" rx="2" />
      <rect x="40" y="150" width="200" height="110" rx="2" />
      <rect x="250" y="150" width="80" height="110" rx="2" />
      <rect x="340" y="150" width="140" height="110" rx="2" />
      <rect x="490" y="150" width="100" height="110" rx="2" />
      <line x1="170" y1="18" x2="330" y2="18" strokeDasharray="2 3" />
    </svg>
  );
  if (pattern === 'kitchen') return (
    <svg className={base} viewBox="0 0 660 300" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="20" y1="248" x2="640" y2="248" />
      <rect x="60" y="170" width="90" height="78" /><rect x="150" y="170" width="70" height="78" />
      <rect x="220" y="170" width="110" height="78" /><rect x="236" y="186" width="78" height="46" />
      <rect x="330" y="170" width="140" height="78" /><circle cx="400" cy="208" r="12" />
      <rect x="470" y="170" width="110" height="78" />
      <rect x="60" y="60" width="160" height="70" /><rect x="220" y="44" width="110" height="86" />
      <rect x="470" y="60" width="110" height="70" />
      <path d="M258 44 L258 28 L292 28 L292 44" />
      <line x1="220" y1="16" x2="330" y2="16" strokeDasharray="2 3" />
    </svg>
  );
  // facade
  return (
    <svg className={base} viewBox="0 0 660 300" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="20" y1="264" x2="640" y2="264" />
      <rect x="60" y="30" width="540" height="234" />
      {[120,180,240,300,360,420,480,540].map(x => <line key={x} x1={x} y1="30" x2={x} y2="264" />)}
      {[76,122,168,214].map(y => <line key={y} x1="60" y1={y} x2="600" y2={y} />)}
      <rect x="180" y="76" width="60" height="46" fill="currentColor" fillOpacity="0.18" />
      <rect x="360" y="122" width="60" height="46" fill="currentColor" fillOpacity="0.18" />
      <rect x="480" y="76" width="60" height="46" fill="currentColor" fillOpacity="0.18" />
      <line x1="180" y1="18" x2="240" y2="18" strokeDasharray="2 3" />
    </svg>
  );
};

// =============================================================================
// BRAND BADGE
// =============================================================================

const BrandBadge: React.FC<{ brand: Brand }> = ({ brand }) => (
  brand === 'skylum'
    ? <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-600 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />SKYLUM
      </span>
    : <span className="inline-flex items-center gap-1.5 bg-white/12 backdrop-blur-sm text-white border border-white/25 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />HWOOD
      </span>
);

// =============================================================================
// ORDER TYPE BADGE
// =============================================================================

const ORDER_TYPE_META: Record<OrderType, { label_en: string; label_he: string; icon: React.ComponentType<{ className?: string }> }> = {
  'browse-and-order':      { label_en: 'Browse & order',      label_he: 'עיון והזמנה',     icon: Grid2X2 },
  'send-file-and-process': { label_en: 'Send file & process', label_he: 'שלח קובץ לעיבוד', icon: FileUp  },
  'describe-and-request':  { label_en: 'Describe & request',  label_he: 'תאר ובקש',        icon: PenLine },
};

const OrderTypeBadge: React.FC<{ orderType: OrderType; lang: 'en' | 'he' }> = ({ orderType, lang }) => {
  const meta = ORDER_TYPE_META[orderType];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1.5 bg-white text-blue-700 border border-blue-200 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
      <Icon className="w-3 h-3" />
      {t(meta.label_en, meta.label_he, lang)}
    </span>
  );
};

// =============================================================================
// BLOCK 01 — HERO
// =============================================================================

const Block01Hero: React.FC<{ service: ServiceFull; lang: 'en' | 'he' }> = ({ service, lang }) => {
  const [visible, setVisible] = useState(false);
  const isRTL = lang === 'he';
  const theme = HERO_THEMES[service.heroTheme];
  // accent_color can override the highlight color
  const highlight = service.accentColor || theme.highlight;
  const glowShadow = service.accentColor
    ? `0 0 24px ${service.accentColor}99`
    : theme.glowShadow;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center gap-2 text-xs text-neutral-500">
          <Link to={ROUTES.HOME} className="hover:text-brand transition-colors">{t('Home', 'בית', lang)}</Link>
          <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-neutral-900">{service.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: theme.gradient, minHeight: '360px' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Hero photo overlay (if set in admin) */}
        {service.heroImageUrl && (
          <img
            src={service.heroImageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}

        {/* Theme-specific decorative SVG */}
        <HeroSVGPattern pattern={theme.svgPattern} />

        {/* Glow dot */}
        <div className="absolute top-8 right-20 w-2 h-2 rounded-full pointer-events-none"
          style={{ background: highlight, boxShadow: glowShadow }} />

        {/* Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center ${isRTL ? 'text-right items-end' : ''}`}
          style={{ minHeight: '360px', paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="max-w-[640px]">

            {/* Badges */}
            <div className={`flex items-center gap-2 mb-5 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BrandBadge brand={service.brand} />
              <OrderTypeBadge orderType={service.orderType} lang={lang} />
            </div>

            {/* Title */}
            <h1
              className={`font-display font-semibold text-white mb-4 tracking-tight leading-[1.08] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)' }}
            >
              {/* Split last word for highlight — same pattern as Design System */}
              {service.title.split(' ').slice(0, -2).join(' ')}{' '}
              <span style={{ color: highlight }}>
                {service.title.split(' ').slice(-2).join(' ')}
              </span>
            </h1>

            {/* Description */}
            {service.description && (
              <p
                className={`text-[15px] leading-[1.6] text-white/75 max-w-[520px] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '150ms' }}
              >
                {service.description}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

// =============================================================================
// BLOCK 02 — SUBSERVICES
// =============================================================================

const SubserviceCard: React.FC<{
  subservice: SubserviceWithStatus;
  onClick: () => void;
  lang: 'en' | 'he';
}> = ({ subservice, onClick, lang }) => {
  const isComingSoon = subservice.visibilityStatus === 'coming_soon';
  const [imgSrc, setImgSrc] = useState(subservice.imageUrl || FALLBACK_IMAGE);

  return (
    <article
      className={`flex-shrink-0 relative w-[280px] md:w-[300px] h-[420px] rounded-3xl overflow-hidden group
        ${isComingSoon ? 'opacity-60 border-4 border-transparent cursor-default' : 'card-industrial cursor-pointer'}`}
      onClick={isComingSoon ? undefined : onClick}
    >
      <img
        src={imgSrc}
        alt={subservice.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500
          ${isComingSoon ? 'grayscale brightness-50' : 'group-hover:scale-105'}`}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />
      <div className={`absolute inset-0 transition-all duration-300
        ${isComingSoon ? 'bg-black/40' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-brand/80 group-hover:via-brand/30'}`} />

      {isComingSoon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Clock className="w-10 h-10 text-white mb-3" />
          <span className="text-white text-sm font-bold uppercase tracking-widest">{t('Coming Soon', 'בקרוב', lang)}</span>
        </div>
      )}

      <div className="relative h-full p-8 flex flex-col text-white z-10">
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold bg-brand px-2.5 py-1.5 rounded-sm text-white">
            {subservice.title.split(' ')[0]}
          </span>
        </div>
        <div className="mt-auto">
          <h3 className="text-xl font-bold mb-3 tracking-tight leading-tight">{subservice.title}</h3>
          {subservice.description && (
            <p className="text-sm leading-relaxed font-light text-white/70 mb-6 line-clamp-2">{subservice.description}</p>
          )}
          {!isComingSoon && (
            <div className="pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('Explore', 'לחקור', lang)}</span>
              <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'he' ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
            </div>
          )}
        </div>
      </div>
      {!isComingSoon && <div className="absolute bottom-0 left-0 h-0.5 bg-white/60 w-0 group-hover:w-full transition-all duration-300" />}
    </article>
  );
};

const Block02Subservices: React.FC<{
  subservices: SubserviceWithStatus[];
  lang: 'en' | 'he';
  onSubserviceClick: (s: Subservice) => void;
}> = ({ subservices, lang, onSubserviceClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => { el?.removeEventListener('scroll', checkScroll); window.removeEventListener('resize', checkScroll); };
  }, [subservices]);

  if (subservices.length === 0) return null;
  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });

  return (
    <section className="bg-neutral-50 py-20 border-t border-neutral-200 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className={`flex items-end justify-between gap-8 pb-8 border-b border-neutral-200 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
          <div className={lang === 'he' ? 'text-right' : ''}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3">
              {t('What we run on the line', 'מה שאנחנו מריצים', lang)}
            </p>
            <h2 className="font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-neutral-900">
              {t('Subservices', 'תת-שירותים', lang)}
            </h2>
          </div>
          <div className={`flex gap-3 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
            {([['left', showLeft], ['right', showRight]] as const).map(([dir, enabled]) => (
              <button key={dir} onClick={() => scroll(dir)} disabled={!enabled}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200
                  ${enabled ? 'border-neutral-300 text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900' : 'border-neutral-200 text-neutral-300 cursor-not-allowed'}`}
                aria-label={dir === 'left' ? t('Previous', 'הקודם', lang) : t('Next', 'הבא', lang)}>
                {dir === 'left' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={scrollRef}
        className="scroll-x-bleed flex gap-6 pb-8">
        {subservices.map((s) => (
          <SubserviceCard key={s.id} subservice={s} onClick={() => onSubserviceClick(s)} lang={lang} />
        ))}
        <div className="w-8 flex-shrink-0" />
      </div>
    </section>
  );
};

// =============================================================================
// BLOCK 03 — HOW TO ORDER
// =============================================================================

const Block03HowToOrder: React.FC<{ orderType: OrderType; lang: 'en' | 'he' }> = ({ orderType, lang }) => {
  const data = HOW_TO_ORDER_MAP[orderType];
  const isRTL = lang === 'he';
  return (
    <section className="bg-white py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`mb-14 max-w-2xl ${isRTL ? 'text-right' : ''}`}>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3">{t(data.eyebrow_en, data.eyebrow_he, lang)}</p>
          <h2 className="font-display text-[2.25rem] leading-[1.15] font-semibold tracking-tight text-neutral-900 mb-4">{t(data.title_en, data.title_he, lang)}</h2>
          <p className="text-base text-neutral-600 leading-relaxed">{t(data.subtitle_en, data.subtitle_he, lang)}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-6 items-stretch mb-10">
          {data.steps.map((step, idx) => {
            const Icon = STEP_ICONS[step.icon] || Info;
            return (
              <React.Fragment key={step.number}>
                <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm flex flex-col">
                  <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">{t('Step', 'שלב', lang)} {step.number}</span>
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className={`font-display text-[1.25rem] leading-[1.3] font-semibold tracking-tight text-neutral-900 mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {t(step.title_en, step.title_he, lang)}
                  </h3>
                  <p className={`text-sm text-neutral-600 leading-relaxed ${isRTL ? 'text-right' : ''}`}>{t(step.body_en, step.body_he, lang)}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:flex items-center justify-center text-neutral-300">
                    <ArrowRight className={`w-7 h-7 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* File formats box — send-file only */}
        {data.fileFormatsBox.show && (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className={`flex items-start gap-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="w-11 h-11 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-2">{t('Accepted formats', 'פורמטים מקובלים', lang)}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.fileFormatsBox.formats.map((f) => (
                    <span key={f.label} className="inline-flex items-center rounded-sm border border-neutral-300 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700">{f.label}</span>
                  ))}
                </div>
                <p className="text-sm text-neutral-600">{t(data.fileFormatsBox.note_en, data.fileFormatsBox.note_he, lang)}</p>
              </div>
            </div>
            <div className={`md:border-s md:border-neutral-200 md:ps-6 flex-shrink-0 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-1.5">{t('Pricing model', 'מודל תמחור', lang)}</p>
              <p className="text-sm text-neutral-900 font-medium leading-snug">{t(data.fileFormatsBox.pricing_en, data.fileFormatsBox.pricing_he, lang)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// =============================================================================
// BLOCK 04 — WHO ORDERS THIS
// =============================================================================

const Block04WhoOrders: React.FC<{ orderType: OrderType; lang: 'en' | 'he' }> = ({ orderType, lang }) => {
  const data = WHO_ORDERS_MAP[orderType];
  const isRTL = lang === 'he';
  const tags = lang === 'he' ? data.tags_he : data.tags_en;
  return (
    <section className="bg-neutral-50 py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-16 items-start ${isRTL ? 'lg:grid-cols-[1fr_360px]' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3">{t(data.eyebrow_en, data.eyebrow_he, lang)}</p>
            <h2 className="font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-neutral-900 mb-4">{t(data.title_en, data.title_he, lang)}</h2>
            <p className="text-base text-neutral-600 leading-relaxed">{t(data.subtitle_en, data.subtitle_he, lang)}</p>
          </div>
          <div className={`flex flex-wrap gap-3 pt-2 ${isRTL ? 'justify-end' : ''}`}>
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-700 px-5 py-2.5 text-sm font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// BLOCK 05 — ABOUT THE FACTORY
// =============================================================================

const Block05AboutFactory: React.FC<{ brand: Brand; lang: 'en' | 'he' }> = ({ brand, lang }) => {
  const isRTL = lang === 'he';
  const isSkylum = brand === 'skylum';
  const body_en = isSkylum
    ? 'Skylum is the facade and HPL/ACP division of HWOOD Group. We supply and process aluminum systems, ACP panels, and HPL for contractors and facade companies across Israel.'
    : 'HWOOD operates a multi-line CNC facility serving architects, contractors, and carpenters across Israel. Repeatable output, validated files, and materials sourced from Egger, Kronospan, and Rehau.';
  const body_he = isSkylum
    ? 'סקיילום היא חטיבת החזיתות ו-HPL/ACP של קבוצת HWOOD. אנחנו מספקים ומעבדים מערכות אלומיניום, לוחות ACP וחומר HPL לקבלנים ברחבי ישראל.'
    : 'HWOOD מפעילה מתקן CNC רב-קווי המשרת אדריכלים, קבלנים ונגרים ברחבי ישראל. תפוקה חוזרת, קבצים מאומתים וחומרים ממקורות Egger, Kronospan ו-Rehau.';

  return (
    <section className="relative overflow-hidden text-white py-24 bg-surface-dark">
      {/* Stripe accent */}
      <div className="sv-stripe-band" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isRTL ? 'direction-rtl' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-4">{t('The facility', 'המתקן', lang)}</p>
            <h2 className="font-display text-[2.5rem] leading-[1.1] font-semibold tracking-tight mb-6">
              {t(isSkylum ? 'Facade systems from' : 'Production out of', isSkylum ? 'מערכות חזיתות מ' : 'ייצור מ', lang)}{' '}
              <span style={{ color: '#00d4aa' }}>{t('Netanya', 'נתניה', lang)}</span>
            </h2>
            <p className="text-[17px] leading-[1.65] font-light text-white/75 max-w-[520px] mb-10">{t(body_en, body_he, lang)}</p>
            <div className={`grid grid-cols-2 gap-8 pt-10 border-t border-white/10 ${isRTL ? 'text-right' : ''}`}>
              {[{ value: '20+', label_en: 'Years of production', label_he: 'שנות ייצור' }, { value: '300+', label_en: 'Projects delivered', label_he: 'פרויקטים שסופקו' }].map((s) => (
                <div key={s.value}>
                  <div className="text-[3rem] font-semibold leading-none tracking-tight" style={{ color: '#00d4aa' }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mt-3">{t(s.label_en, s.label_he, lang)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[5/4] rounded-3xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-neutral-900" />
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 500 400" preserveAspectRatio="none">
              <defs><pattern id="gf" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4aa" strokeWidth=".6" /></pattern></defs>
              <rect width="500" height="400" fill="url(#gf)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
              <Building2 className="w-12 h-12 mb-3 opacity-60" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-medium">{t('Facility photography', 'צילומי המתקן', lang)}</span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/25 mt-1">{t('Workshop · CNC line · Netanya', 'סדנה · קו CNC · נתניה', lang)}</span>
            </div>
            <div className={`absolute bottom-5 ${isRTL ? 'right-5' : 'left-5'} text-[10px] uppercase tracking-[0.15em] font-bold text-white/50`}>
              {isSkylum ? 'SKYLUM' : 'HWOOD'} · {t('Netanya facility', 'מתקן נתניה', lang)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// BLOCK 06 — PORTFOLIO
// =============================================================================

// TODO: Add .eq('service_slug', serviceSlug) once service_slug column exists on stories table.

const Block06Portfolio: React.FC<{ stories: (Story & { visibilityStatus?: string })[]; lang: 'en' | 'he' }> = ({ stories, lang }) => {
  const isRTL = lang === 'he';
  if (stories.length === 0) return null;
  return (
    <section className="bg-white py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`flex items-end justify-between gap-8 mb-12 pb-8 border-b border-neutral-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3">{t('Work', 'עבודות', lang)}</p>
            <h2 className="font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-neutral-900">{t('Portfolio', 'תיק עבודות', lang)}</h2>
          </div>
          <Link to={ROUTES.PORTFOLIO}
            className={`hidden md:inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-900 border-b-2 border-neutral-900 pb-1 hover:text-brand hover:border-brand transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
            {t('View all projects', 'כל הפרויקטים', lang)}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stories.slice(0, 4).map((story) => (
            <Link key={story.id} to={ROUTES.STORY(story.slug || story.id)}
              className={`group flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm">
                <img src={story.imageUrl || FALLBACK_IMAGE} alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold bg-brand px-2.5 py-1.5 rounded-sm text-white">{story.type}</span>
                </div>
              </div>
              <h3 className={`text-base font-semibold text-neutral-900 leading-snug mb-2 line-clamp-2 group-hover:text-brand transition-colors ${isRTL ? 'text-right' : ''}`}>{story.title}</h3>
              <span className="text-xs text-neutral-500">{story.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// BLOCK 07 — CTA BANNER
// =============================================================================

const Block07CTABanner: React.FC<{ orderType: OrderType; serviceSlug: string; lang: 'en' | 'he' }> = ({ orderType, serviceSlug, lang }) => {
  const navigate = useNavigate();
  const data = CTA_MAP[orderType];
  const isRTL = lang === 'he';
  return (
    <section className="relative bg-brand text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
        <div className="absolute -left-20 -top-40 h-[200%] w-40" style={{ background: '#00d4aa', transform: 'skewX(-20deg)' }} />
        <div className="absolute left-24 -top-40 h-[200%] w-24" style={{ background: '#00d4aa', transform: 'skewX(-20deg)' }} />
      </div>
      <div className={`relative max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-10 ${isRTL ? 'md:flex-row-reverse text-right' : ''}`}>
        <div className="max-w-xl">
          <h2 className="font-display text-[2.25rem] leading-[1.1] font-semibold tracking-tight mb-4">{t(data.title_en, data.title_he, lang)}</h2>
          <p className="text-[16px] leading-[1.6] text-white/80">{t(data.subtitle_en, data.subtitle_he, lang)}</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.QUOTE_PRODUCT(serviceSlug))}
          className={`flex-shrink-0 inline-flex items-center gap-3 bg-white text-brand px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-neutral-100 transition-colors animate-pulse-glow ${isRTL ? 'flex-row-reverse' : ''}`}>
          {t(data.button_en, data.button_he, lang)}
          <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </section>
  );
};

// =============================================================================
// LOADING / NOT FOUND
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full animate-pulse">
    <div className="w-full h-[360px] bg-neutral-800" />
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-6">
      <div className="h-7 w-44 bg-neutral-200 rounded" />
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => <div key={i} className="w-[280px] h-[420px] bg-neutral-200 rounded-3xl flex-shrink-0" />)}
      </div>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-h1 font-medium text-neutral-900 mb-4">Service Not Found</h1>
      <p className="text-body text-neutral-600 mb-8">The service you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="px-6 py-3 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors">Back to Home</Link>
    </div>
  </div>
);

// =============================================================================
// MAIN SERVICE PAGE
// =============================================================================

export const ServicePage: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const lang = getCurrentLang();

  const [service, setService] = useState<ServiceFull | null>(null);
  const [subservices, setSubservices] = useState<SubserviceWithStatus[]>([]);
  const [stories, setStories] = useState<(Story & { visibilityStatus?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!serviceSlug) return;
    window.scrollTo(0, 0);

    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: svc } = await supabase
          .from('services').select('*').eq('slug', serviceSlug).single();

        if (!svc) { setIsLoading(false); return; }

        const brand = resolveBrand(svc.brand);
        const orderType = resolveOrderType(svc.order_type);
        const heroTheme = resolveHeroTheme(svc.hero_theme, brand, orderType);

        setService({
          id: svc.id,
          slug: svc.slug,
          title: lang === 'he' && svc.title_he ? svc.title_he : svc.title_en,
          description: lang === 'he' && svc.description_he ? svc.description_he : svc.description_en || '',
          imageUrl: svc.image_url || '',
          heroImageUrl: svc.hero_image_url || '',
          accentColor: svc.accent_color || '',   // overrides highlight color if set
          visibilityStatus: svc.visibility_status,
          brand,
          orderType,
          heroTheme,
        });

        const { data: subs } = await supabase
          .from('subservices').select('*').eq('service_id', svc.id)
          .in('visibility_status', ['visible', 'coming_soon'])
          .order('sort_order', { ascending: true });

        if (subs) {
          setSubservices(subs.map((s: any) => ({
            id: s.id, slug: s.slug, serviceId: s.service_id,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
            imageUrl: s.image_url || '', heroImageUrl: s.hero_image_url || '',
            visibilityStatus: s.visibility_status,
          })));
        }

        // TODO: add .eq('service_slug', serviceSlug) once column exists
        const { data: storiesData } = await supabase
          .from('stories').select('*')
          .eq('visibility_status', 'visible')
          .order('date', { ascending: false }).limit(4);

        if (storiesData) {
          setStories(storiesData.map((s: any) => ({
            id: s.id, slug: s.slug,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            date: new Date(s.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            type: s.type || 'EVENTS', imageUrl: s.image_url || '',
            visibilityStatus: s.visibility_status,
          })));
        }
      } catch (err) {
        console.error('[ServicePage] error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [serviceSlug, lang]);

  if (isLoading) return <LoadingSkeleton />;
  if (!service) return <NotFound />;

  return (
    <div className="w-full flex flex-col bg-white">
      <Block01Hero service={service} lang={lang} />
      <Block02Subservices subservices={subservices} lang={lang} onSubserviceClick={(s) => navigate(ROUTES.SUBSERVICE(s.slug))} />
      <Block03HowToOrder orderType={service.orderType} lang={lang} />
      <Block04WhoOrders orderType={service.orderType} lang={lang} />
      <Block05AboutFactory brand={service.brand} lang={lang} />
      <Block06Portfolio stories={stories} lang={lang} />
      <Block07CTABanner orderType={service.orderType} serviceSlug={service.slug} lang={lang} />
    </div>
  );
};
