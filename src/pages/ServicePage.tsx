/**
 * SERVICE PAGE — v2.0
 * ====================
 * 7-block structure. Brand and order_type drive layout and content.
 * Static block content from serviceContextMap.ts — no dev needed for new services.
 *
 *  01 · Hero              brand CSS gradient + badges + title + description
 *  02 · Subservices       horizontal scroll, card-industrial pattern
 *  03 · How to Order      3 steps from HOW_TO_ORDER_MAP + FileFormatsBox (send-file only)
 *  04 · Who Orders This   audience pill tags from WHO_ORDERS_MAP
 *  05 · About the Factory dark surface-dark section, factory stats
 *  06 · Portfolio         latest stories (TODO: filter by service_slug once column exists)
 *  07 · CTA Banner        full-width bg-brand, CTA from CTA_MAP
 *
 * Supabase fields used: title, description, heroImageUrl, brand, orderType, subservices
 * No accentColor usage — reserved for future component-level accent.
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
  BRAND_HERO_CLASS,
  resolveOrderType,
  resolveBrand,
  OrderType,
  Brand,
} from '../services/data/serviceContextMap';

// =============================================================================
// HELPERS
// =============================================================================

// TODO: extract to src/utils/lang.ts and import from there
const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

const t = (en: string, he: string, lang: 'en' | 'he') => (lang === 'he' ? he : en);

// Icon lookup — keeps JSX clean, avoids dynamic imports
const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileUp, Layers, UserCheck, Grid2X2, SlidersHorizontal, Send, PenLine, Paperclip, Phone,
};

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">` +
  `<rect width="800" height="600" fill="#1a1a1a"/>` +
  `<g transform="translate(360,280)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.25">` +
  `<rect x="0" y="0" width="80" height="50" rx="3"/>` +
  `<rect x="8" y="12" width="20" height="28" rx="2"/>` +
  `<rect x="33" y="12" width="20" height="28" rx="2"/>` +
  `</g></svg>`
)}`;

// =============================================================================
// TYPES
// =============================================================================

interface ServiceFull extends Service {
  brand: Brand;
  orderType: OrderType;
  visibilityStatus?: string;
}

interface SubserviceWithStatus extends Subservice {
  visibilityStatus?: string;
}

// =============================================================================
// BRAND BADGE
// =============================================================================

const BrandBadge: React.FC<{ brand: Brand }> = ({ brand }) => {
  if (brand === 'skylum') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-600 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
        SKYLUM
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/12 backdrop-blur-sm text-white border border-white/25 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
      <span className="w-1.5 h-1.5 rounded-full bg-white" />
      HWOOD
    </span>
  );
};

// =============================================================================
// ORDER TYPE BADGE
// =============================================================================

const ORDER_TYPE_META: Record<OrderType, { label_en: string; label_he: string; icon: React.ComponentType<{ className?: string }> }> = {
  'browse-and-order':      { label_en: 'Browse & order',      label_he: 'עיון והזמנה',     icon: Grid2X2 },
  'send-file-and-process': { label_en: 'Send file & process', label_he: 'שלח קובץ לעיבוד', icon: FileUp },
  'describe-and-request':  { label_en: 'Describe & request',  label_he: 'תאר ובקש',         icon: PenLine },
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

const Block01Hero: React.FC<{
  service: ServiceFull;
  lang: 'en' | 'he';
}> = ({ service, lang }) => {
  const [visible, setVisible] = useState(false);
  const isRTL = lang === 'he';
  const heroClass = BRAND_HERO_CLASS[service.brand];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center gap-2 text-xs text-neutral-500">
          <Link to={ROUTES.HOME} className="hover:text-brand transition-colors">
            {t('Home', 'בית', lang)}
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-neutral-900">{service.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className={`relative w-full overflow-hidden ${heroClass}`} style={{ minHeight: '280px' }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 sv-hero-grid-overlay" />

        {/* Hero photo — shown if heroImageUrl exists */}
        {service.heroImageUrl && (
          <img
            src={service.heroImageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}

        {/* Decorative SVG hint (right side) — HWOOD only */}
        {service.brand === 'hwood' && (
          <svg
            className="absolute right-0 -bottom-10 w-[520px] h-[320px] opacity-[0.18] text-white pointer-events-none"
            viewBox="0 0 520 320" fill="none" stroke="currentColor" strokeWidth="1"
          >
            <rect x="40" y="30" width="440" height="260" rx="6" />
            <path d="M70 60 H280 V140 H160 V210 H420 V110 H360" />
            <circle cx="280" cy="140" r="5" />
            <circle cx="160" cy="210" r="5" />
            <circle cx="420" cy="110" r="5" />
          </svg>
        )}

        {/* Teal glow accent */}
        <div
          className="absolute top-8 right-20 w-2 h-2 rounded-full pointer-events-none"
          style={{ background: '#00d4aa', boxShadow: '0 0 24px rgba(0,212,170,.9)' }}
        />

        {/* Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="max-w-[620px]">
            {/* Badges */}
            <div className={`flex items-center gap-2 mb-5 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <BrandBadge brand={service.brand} />
              <OrderTypeBadge orderType={service.orderType} lang={lang} />
            </div>

            {/* Title */}
            <h1
              className={`font-display text-[2.25rem] md:text-[2.75rem] leading-[1.08] tracking-tight font-semibold text-white mb-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {service.title}
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
        ${isComingSoon ? 'opacity-60 border-4 border-transparent' : 'card-industrial cursor-pointer'}`}
      onClick={isComingSoon ? undefined : onClick}
    >
      <img
        src={imgSrc}
        alt={subservice.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isComingSoon ? 'grayscale brightness-50' : 'group-hover:scale-105'}`}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />

      {/* Gradient */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isComingSoon
          ? 'bg-black/40'
          : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-brand/80 group-hover:via-brand/30'
      }`} />

      {/* Coming soon overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Clock className="w-10 h-10 text-white mb-3" />
          <span className="text-white text-sm font-bold uppercase tracking-widest">
            {t('Coming Soon', 'בקרוב', lang)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="relative h-full p-8 flex flex-col text-white z-10">
        <div className="mb-4">
          <span className="sv-eyebrow bg-brand px-2.5 py-1.5 rounded-sm text-white">
            {subservice.title.split(' ')[0]}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="text-xl font-bold mb-3 tracking-tight leading-tight">
            {subservice.title}
          </h3>
          {subservice.description && (
            <p className="text-sm leading-relaxed font-light text-white/70 mb-6 line-clamp-2">
              {subservice.description}
            </p>
          )}
          {!isComingSoon && (
            <div className="pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="sv-eyebrow-wide text-white">
                {t('Explore', 'לחקור', lang)}
              </span>
              <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'he' ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/60 w-0 group-hover:w-full transition-all duration-300" />
      )}
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
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [subservices]);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });

  if (subservices.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-20 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className={`flex items-end justify-between gap-8 pb-8 border-b border-neutral-200 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
          <div className={lang === 'he' ? 'text-right' : ''}>
            <p className="sv-eyebrow text-neutral-500 mb-3">{t('What we run on the line', 'מה שאנחנו מריצים', lang)}</p>
            <h2 className="font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-neutral-900">
              {t('Subservices', 'תת-שירותים', lang)}
            </h2>
          </div>
          <div className={`flex gap-3 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => scroll('left')}
              disabled={!showLeft}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                showLeft ? 'border-neutral-300 text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900' : 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              }`}
              aria-label={t('Previous', 'הקודם', lang)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRight}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
                showRight ? 'border-neutral-300 text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900' : 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              }`}
              aria-label={t('Next', 'הבא', lang)}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-6 md:-mx-12 lg:-mx-20 xl:-mx-32 px-6 md:px-12 lg:px-20 xl:px-32"
        style={{ scrollbarWidth: 'none' }}
      >
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
        {/* Header */}
        <div className={`mb-14 max-w-2xl ${isRTL ? 'text-right' : ''}`}>
          <p className="sv-eyebrow text-neutral-500 mb-3">{t(data.eyebrow_en, data.eyebrow_he, lang)}</p>
          <h2 className="font-display text-[2.25rem] leading-[1.15] font-semibold tracking-tight text-neutral-900 mb-4">
            {t(data.title_en, data.title_he, lang)}
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            {t(data.subtitle_en, data.subtitle_he, lang)}
          </p>
        </div>

        {/* Steps */}
        <div className={`grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-6 items-stretch mb-10 ${isRTL ? 'md:dir-rtl' : ''}`}>
          {data.steps.map((step, idx) => {
            const Icon = STEP_ICONS[step.icon] || Info;
            return (
              <React.Fragment key={step.number}>
                <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm flex flex-col">
                  <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="sv-eyebrow text-neutral-400">{t('Step', 'שלב', lang)} {step.number}</span>
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className={`font-display text-[1.25rem] leading-[1.3] font-semibold tracking-tight text-neutral-900 mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {t(step.title_en, step.title_he, lang)}
                  </h3>
                  <p className={`text-sm text-neutral-600 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                    {t(step.body_en, step.body_he, lang)}
                  </p>
                </div>

                {/* Arrow connector — hidden on mobile */}
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
                <p className="sv-eyebrow text-neutral-500 mb-2">{t('Accepted formats', 'פורמטים מקובלים', lang)}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.fileFormatsBox.formats.map((f) => (
                    <span key={f.label} className="inline-flex items-center rounded-sm border border-neutral-300 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700">
                      {f.label}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-neutral-600">{t(data.fileFormatsBox.note_en, data.fileFormatsBox.note_he, lang)}</p>
              </div>
            </div>
            <div className={`md:border-s md:border-neutral-200 md:ps-6 flex-shrink-0 ${isRTL ? 'text-right' : ''}`}>
              <p className="sv-eyebrow text-neutral-500 mb-1.5">{t('Pricing model', 'מודל תמחור', lang)}</p>
              <p className="text-sm text-neutral-900 font-medium leading-snug">
                {t(data.fileFormatsBox.pricing_en, data.fileFormatsBox.pricing_he, lang)}
              </p>
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
            <p className="sv-eyebrow text-neutral-500 mb-3">{t(data.eyebrow_en, data.eyebrow_he, lang)}</p>
            <h2 className="font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-neutral-900 mb-4">
              {t(data.title_en, data.title_he, lang)}
            </h2>
            <p className="text-base text-neutral-600 leading-relaxed">
              {t(data.subtitle_en, data.subtitle_he, lang)}
            </p>
          </div>

          <div className={`flex flex-wrap gap-3 pt-2 ${isRTL ? 'justify-end' : ''}`}>
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-neutral-700 px-5 py-2.5 text-sm font-medium"
              >
                {tag}
              </span>
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

const FACTORY_STATS = [
  { value: '20+', label_en: 'Years of production', label_he: 'שנות ייצור' },
  { value: '300+', label_en: 'Projects delivered', label_he: 'פרויקטים שסופקו' },
];

const Block05AboutFactory: React.FC<{ brand: Brand; lang: 'en' | 'he' }> = ({ brand, lang }) => {
  const isRTL = lang === 'he';
  const isSkylum = brand === 'skylum';

  const headline_en = isSkylum ? 'Facade systems from' : 'Production out of';
  const headline_he = isSkylum ? 'מערכות חזיתות מ' : 'ייצור מ';
  const city = 'Netanya';
  const city_he = 'נתניה';

  const body_en = isSkylum
    ? 'Skylum is the facade and HPL/ACP division of HWOOD Group. We supply and process aluminum systems, ACP panels, and HPL material for contractors and facade companies across Israel.'
    : 'HWOOD operates a multi-line CNC facility serving architects, contractors, and carpenters across Israel. Repeatable output, validated files, and materials sourced from Egger, Kronospan, and Rehau.';
  const body_he = isSkylum
    ? 'סקיילום היא חטיבת החזיתות ו-HPL/ACP של קבוצת HWOOD. אנחנו מספקים ומעבדים מערכות אלומיניום, לוחות ACP וחומר HPL לקבלנים וחברות חזיתות ברחבי ישראל.'
    : 'HWOOD מפעילה מתקן CNC רב-קווי המשרת אדריכלים, קבלנים ונגרים ברחבי ישראל. תפוקה חוזרת, קבצים מאומתים וחומרים ממקורות Egger, Kronospan ו-Rehau.';

  return (
    <section className="relative overflow-hidden text-white py-24 bg-surface-dark">
      <div className="sv-stripe-band" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isRTL ? 'lg:grid-cols-[1fr_1fr]' : ''}`}>

          {/* Left: text */}
          <div className={isRTL ? 'text-right' : ''}>
            <p className="sv-eyebrow text-white/60 mb-4">{t('The facility', 'המתקן', lang)}</p>
            <h2 className="font-display text-[2.5rem] leading-[1.1] font-semibold tracking-tight mb-6">
              {t(headline_en, headline_he, lang)}{' '}
              <span style={{ color: '#00d4aa' }}>
                {t(city, city_he, lang)}
              </span>
            </h2>
            <p className="text-[17px] leading-[1.65] font-light text-white/75 max-w-[520px] mb-10">
              {t(body_en, body_he, lang)}
            </p>

            {/* Stats */}
            <div className={`grid grid-cols-2 gap-8 pt-10 border-t border-white/10 ${isRTL ? 'text-right' : ''}`}>
              {FACTORY_STATS.map((stat) => (
                <div key={stat.value}>
                  <div className="text-[3rem] font-semibold leading-none tracking-tight" style={{ color: '#00d4aa' }}>
                    {stat.value}
                  </div>
                  <div className="sv-eyebrow text-white/60 mt-3">
                    {t(stat.label_en, stat.label_he, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: facility image placeholder */}
          <div className="relative aspect-[5/4] rounded-3xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-neutral-900" />
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 500 400" preserveAspectRatio="none">
              <defs>
                <pattern id="gf" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4aa" strokeWidth=".6" />
                </pattern>
              </defs>
              <rect width="500" height="400" fill="url(#gf)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
              <Building2 className="w-12 h-12 mb-3 opacity-60" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-medium">
                {t('Facility photography', 'צילומי המתקן', lang)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/25 mt-1">
                {t('Workshop · CNC line · Netanya', 'סדנה · קו CNC · נתניה', lang)}
              </span>
            </div>
            <div className={`absolute bottom-5 ${isRTL ? 'end-5' : 'start-5'} sv-eyebrow text-white/50`}>
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

// TODO: Filter stories by service requires `service_slug` column on stories table.
//       For now shows latest 4 visible stories. Once column exists:
//       add .eq('service_slug', serviceSlug) to the query in ServicePage.loadData().

const StoryCard: React.FC<{ story: Story & { visibilityStatus?: string }; lang: 'en' | 'he' }> = ({ story, lang }) => {
  const isRTL = lang === 'he';
  return (
    <Link to={ROUTES.STORY(story.slug || story.id)} className={`group flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm">
        <img
          src={story.imageUrl || FALLBACK_IMAGE}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
          <span className="sv-eyebrow bg-brand px-2.5 py-1.5 rounded-sm text-white">
            {story.type}
          </span>
        </div>
      </div>
      <h3 className={`text-base font-semibold text-neutral-900 leading-snug mb-2 line-clamp-2 group-hover:text-brand transition-colors ${isRTL ? 'text-right' : ''}`}>
        {story.title}
      </h3>
      <span className="text-xs text-neutral-500">{story.date}</span>
    </Link>
  );
};

const Block06Portfolio: React.FC<{
  stories: (Story & { visibilityStatus?: string })[];
  lang: 'en' | 'he';
}> = ({ stories, lang }) => {
  const isRTL = lang === 'he';
  if (stories.length === 0) return null;

  return (
    <section className="bg-white py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`flex items-end justify-between gap-8 mb-12 pb-8 border-b border-neutral-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="sv-eyebrow text-neutral-500 mb-3">{t('Work', 'עבודות', lang)}</p>
            <h2 className="font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-neutral-900">
              {t('Portfolio', 'תיק עבודות', lang)}
            </h2>
          </div>
          <Link
            to={ROUTES.PORTFOLIO}
            className={`hidden md:inline-flex items-center gap-3 sv-eyebrow-wide text-neutral-900 border-b-2 border-neutral-900 pb-1 hover:text-brand hover:border-brand transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {t('View all projects', 'כל הפרויקטים', lang)}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stories.slice(0, 4).map((story) => (
            <StoryCard key={story.id} story={story} lang={lang} />
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
      {/* Stripe accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
        <div className="absolute -left-20 -top-40 h-[200%] w-40" style={{ background: '#00d4aa', transform: 'skewX(-20deg)' }} />
        <div className="absolute left-24 -top-40 h-[200%] w-24" style={{ background: '#00d4aa', transform: 'skewX(-20deg)' }} />
      </div>

      <div className={`relative max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-10 ${isRTL ? 'md:flex-row-reverse text-right' : ''}`}>
        <div className="max-w-xl">
          <h2 className="font-display text-[2.25rem] leading-[1.1] font-semibold tracking-tight mb-4">
            {t(data.title_en, data.title_he, lang)}
          </h2>
          <p className="text-[16px] leading-[1.6] text-white/80">
            {t(data.subtitle_en, data.subtitle_he, lang)}
          </p>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => navigate(ROUTES.QUOTE_PRODUCT(serviceSlug))}
            className={`inline-flex items-center gap-3 bg-white text-brand px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-neutral-100 transition-colors animate-pulse-glow ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {t(data.button_en, data.button_he, lang)}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="w-full h-1 bg-neutral-200" />
    <div className="w-full h-[280px] bg-neutral-800" />
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-6">
      <div className="h-8 w-48 bg-neutral-200 rounded" />
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0 w-[280px] h-[420px] bg-neutral-200 rounded-3xl" />
        ))}
      </div>
    </div>
  </div>
);

// =============================================================================
// NOT FOUND
// =============================================================================

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-h1 font-medium text-neutral-900 mb-4">Service Not Found</h1>
      <p className="text-body text-neutral-600 mb-8">The service you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="px-6 py-3 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors">
        Back to Home
      </Link>
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
        // --- Service ---
        const { data: svc } = await supabase
          .from('services')
          .select('*')
          .eq('slug', serviceSlug)
          .single();

        if (!svc) { setIsLoading(false); return; }

        const resolvedBrand = resolveBrand(svc.brand);
        const resolvedOrderType = resolveOrderType(svc.order_type);

        setService({
          id: svc.id,
          slug: svc.slug,
          title: lang === 'he' && svc.title_he ? svc.title_he : svc.title_en,
          description: lang === 'he' && svc.description_he ? svc.description_he : svc.description_en || '',
          imageUrl: svc.image_url || '',
          heroImageUrl: svc.hero_image_url || '',
          accentColor: svc.accent_color,     // kept in state, not used for hero bg
          visibilityStatus: svc.visibility_status,
          brand: resolvedBrand,
          orderType: resolvedOrderType,
        });

        // --- Subservices ---
        const { data: subs } = await supabase
          .from('subservices')
          .select('*')
          .eq('service_id', svc.id)
          .in('visibility_status', ['visible', 'coming_soon'])
          .order('sort_order', { ascending: true });

        if (subs) {
          setSubservices(subs.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            serviceId: s.service_id,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
            imageUrl: s.image_url || '',
            heroImageUrl: s.hero_image_url || '',
            visibilityStatus: s.visibility_status,
          })));
        }

        // --- Stories (portfolio)
        // TODO: Replace with .eq('service_slug', serviceSlug) once the column is added to stories table.
        const { data: storiesData } = await supabase
          .from('stories')
          .select('*')
          .in('visibility_status', ['visible'])
          .order('date', { ascending: false })
          .limit(4);

        if (storiesData) {
          setStories(storiesData.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            date: new Date(s.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            type: s.type || 'EVENTS',
            imageUrl: s.image_url || '',
            excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en,
            visibilityStatus: s.visibility_status,
          })));
        }
      } catch (err) {
        console.error('[ServicePage] loadData error:', err);
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
      <Block02Subservices
        subservices={subservices}
        lang={lang}
        onSubserviceClick={(s) => navigate(ROUTES.SUBSERVICE(s.slug))}
      />
      <Block03HowToOrder orderType={service.orderType} lang={lang} />
      <Block04WhoOrders orderType={service.orderType} lang={lang} />
      <Block05AboutFactory brand={service.brand} lang={lang} />
      <Block06Portfolio stories={stories} lang={lang} />
      <Block07CTABanner orderType={service.orderType} serviceSlug={service.slug} lang={lang} />
    </div>
  );
};
