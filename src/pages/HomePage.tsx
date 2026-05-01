/**
 * HOME PAGE — HWOOD × SKYLUM
 * ===========================
 * Design ref: HWOOD_Homepage_Redesign.html (Pass A + Pass B)
 *
 * Sections:
 *  1. Hero           — dark panel + route-picker right rail
 *  2. Trust strip    — 4 factory stats
 *  3. Partners       — marquee equipment brands
 *  4. Audience       — who we work with (moved UP per UX pass)
 *  5. Services       — Supabase slider + filter chips by order_type
 *  6. How It Works   — 4-step explainer
 *  7. Recent         — stories slider with tab filter
 *  8. Work Starts    — editorial philosophy block
 *  9. CTA Banner     — primary conversion with Stripes
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, Grid3X3, FileText, PenLine, Play,
  ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { Service, Story } from '../domain/types';
import { getServices, getStories } from '../services/data/dataService';
import { ROUTES } from '../router';
import { useTranslation } from 'react-i18next';
import { Stripes } from '../components/journey/stripes';
import { WhoWeWorkWith, HowItWorks, CTABanner } from '../components/journey/sections';
import {
  BRAND_NEUTRAL, SKYLUM_BLUE, SKYLUM_DEEP,
  ORDER_TYPE_CONFIG, ServiceOrderType, getHeroColors
} from '../lib/OrderTypes';

// ── Shared atoms ──────────────────────────────────────────────────────────────
const SVC_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
   <rect width="800" height="1000" fill="#1a1a1a"/>
   <g transform="translate(360,460)" stroke="#fff" stroke-width="3" fill="none" opacity="0.3">
     <rect x="0" y="0" width="80" height="50" rx="3"/>
     <rect x="8" y="12" width="20" height="30" rx="2"/>
     <rect x="33" y="12" width="20" height="30" rx="2"/>
   </g></svg>`
)}`;

// ── SECTION 1 — Hero ──────────────────────────────────────────────────────────
const HomeHero: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const ORDER_ROUTES: Array<{
    ot: ServiceOrderType;
    icon: typeof Grid3X3;
    label: string; labelHe: string;
    value: string; valueHe: string;
    slug: string;
  }> = [
    { ot: 'browse-and-order',      icon: Grid3X3,  label: 'Browse & order',            labelHe: 'עיון והזמנה',          value: '30+ ready cabinet modules',          valueHe: '30+ מודולים מוכנים',          slug: 'cabinet-storage-modules' },
    { ot: 'send-file-and-process', icon: FileText, label: 'Send a CNC file',            labelHe: 'שלח קובץ CNC',         value: 'DXF · sketches · panel list',        valueHe: 'DXF · סקיצות · רשימת פנלים',  slug: 'cnc-services-for-professionals' },
    { ot: 'describe-and-request',  icon: PenLine,  label: 'Describe a custom kitchen',  labelHe: 'תאר מטבח מותאם',       value: 'We design, engineer, build',         valueHe: 'אנחנו מעצבים, מהנדסים, בונים', slug: 'custom-kitchen-projects' },
  ];

  const handleRoute = (slug: string, ot: ServiceOrderType) => {
    sessionStorage.setItem('hw_active_order_type', ot);
    navigate(ROUTES.SERVICE(slug));
  };

  return (
    <section style={{ position: 'relative', height: 680, background: '#0a0a0a', display: 'flex', overflow: 'hidden' }}>

      {/* ── Left — dark image / video panel ─────────────────────────── */}
      <div style={{ position: 'relative', width: '62%', overflow: 'hidden', flexShrink: 0 }}>
        {/* Subtle grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .05 }}
          preserveAspectRatio="none" viewBox="0 0 1000 680">
          <defs>
            <pattern id="g2h" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0 L0 0 0 48" fill="none" stroke="#fff" strokeWidth=".8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g2h)"/>
        </svg>

        {/* Gradient scrim */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.2) 50%, rgba(0,0,0,.45) 100%)' }} />

        {/* Live status + reel badge */}
        <div style={{ position: 'absolute', top: 32, left: 48, display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Live dot */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.85)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: '#00d4aa', boxShadow: '0 0 14px #00d4aa', flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700 }}>
              Netanya · Live Production
            </span>
          </span>
          <span style={{ width: 24, height: 1, background: 'rgba(255,255,255,.3)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.45)' }}>
            Est. 2014 · 12 yrs in CNC
          </span>
        </div>

        {/* Workshop reel play button */}
        <div style={{ position: 'absolute', top: 88, left: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{
            width: 40, height: 40, borderRadius: 99,
            background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)',
            color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)', cursor: 'pointer'
          }}>
            <Play size={14} fill="currentColor" />
          </button>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.7)' }}>
            Workshop reel · 0:48
          </span>
        </div>

        {/* Headline + sub */}
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 80, color: '#fff' }}>
          <h1 style={{
            fontSize: 80, lineHeight: 1, letterSpacing: '-.025em', fontWeight: 600,
            fontFamily: "'Inter Display', Inter, sans-serif", margin: 0
          }}>
            CNC Production<br />Systems
          </h1>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 18, lineHeight: 1.55, fontWeight: 300, margin: '22px 0 0', maxWidth: 520 }}>
            Modular systems and CNC processing for kitchen and interior production.
          </p>
        </div>

        {/* Stats strip at bottom */}
        <div style={{
          position: 'absolute', left: 48, right: 48, bottom: 0,
          paddingTop: 20, paddingBottom: 24,
          borderTop: '1px solid rgba(255,255,255,.1)',
          display: 'flex', alignItems: 'flex-start', gap: 40
        }}>
          {[
            ['2,400 m²', 'Netanya facility'],
            ['Biesse · HOMAG', 'Production stack'],
            ['6 lines', 'Specialised production'],
            ['72 h', 'Avg. lead time'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', fontFamily: "'Inter Display', Inter, sans-serif" }}>{k}</div>
              <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — route picker ─────────────────────────────────────── */}
      <div style={{ position: 'relative', flex: 1, background: '#fff', padding: '40px 36px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Decorative circles */}
        <svg style={{ position: 'absolute', top: 24, right: -80, width: 240, height: 240, opacity: .05, pointerEvents: 'none' }} viewBox="0 0 280 280">
          <circle cx="140" cy="140" r="138" fill="none" stroke="#0a0a0a" strokeDasharray="4 6"/>
          <circle cx="140" cy="140" r="86"  fill="none" stroke="#0a0a0a" strokeDasharray="2 4"/>
          <line x1="0" y1="140" x2="280" y2="140" stroke="#0a0a0a" strokeDasharray="2 4"/>
          <line x1="140" y1="0"  x2="140" y2="280" stroke="#0a0a0a" strokeDasharray="2 4"/>
        </svg>

        <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL, position: 'relative' }}>
          {lang === 'he' ? 'התחל הזמנה' : 'Start your order'}
        </span>
        <h2 style={{
          fontSize: 26, fontWeight: 600, letterSpacing: '-.015em', lineHeight: 1.2,
          margin: '12px 0 24px', color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif",
          position: 'relative'
        }}>
          {lang === 'he' ? 'על איזה פרויקט אתה עובד?' : 'What kind of project are you working on?'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
          {ORDER_ROUTES.map((o) => {
            const t = ORDER_TYPE_CONFIG[o.ot];
            const Icon = o.icon;
            return (
              <button
                key={o.ot}
                onClick={() => handleRoute(o.slug, o.ot)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 18px',
                  border: '1px solid #e5e5e5', borderRadius: 12,
                  background: '#fff', textAlign: 'left', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all .2s'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = t.accent;
                  el.style.boxShadow = `0 4px 20px rgba(0,0,0,.07)`;
                  el.style.transform = 'translateX(3px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#e5e5e5';
                  el.style.boxShadow = '';
                  el.style.transform = '';
                }}
              >
                <span style={{ width: 40, height: 40, borderRadius: 8, background: t.tagBg, color: t.tagFg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: '#0a0a0a' }}>
                      {lang === 'he' ? o.labelHe : o.label}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', background: '#f5f5f3', color: BRAND_NEUTRAL, padding: '3px 8px', borderRadius: 99 }}>
                      {t.key}
                    </span>
                  </div>
                  <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 300 }}>
                    {lang === 'he' ? o.valueHe : o.value}
                  </span>
                </div>
                <span style={{ color: '#a3a3a3', flexShrink: 0 }}><ArrowRight size={15} /></span>
              </button>
            );
          })}
        </div>

        {/* Trust micro-element */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
          {[
            lang === 'he' ? 'תשובה תוך יום עסקים אחד · EN / HE' : 'Reply within 1 business day · EN / HE',
            lang === 'he' ? 'הצעת מחיר חינם, ללא התחייבות' : 'Free quote, no commitment',
          ].map((label, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#262626' }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: `${BRAND_NEUTRAL}10`, color: BRAND_NEUTRAL, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={12} />
              </span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── SECTION 2 — Trust strip ───────────────────────────────────────────────────
const TrustStrip: React.FC = () => (
  <section style={{ background: '#fff', padding: '32px', borderBottom: '1px solid #f0f0f0' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 48 }}>
      {[
        ['12 yrs',   'in CNC production',  'Netanya · since 2014'],
        ['2,400 m²', 'facility footprint', 'Single-site delivery'],
        ['180+',     'kitchens / yr',      'Mixed series & custom'],
        ['72 h',     'avg. lead time',     'From DXF to ready panel'],
      ].map(([k, v, sub], i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-.02em', color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif" }}>{k}</span>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>{v}</span>
          <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 300 }}>{sub}</span>
        </div>
      ))}
    </div>
  </section>
);

// ── SECTION 3 — Partners marquee ──────────────────────────────────────────────
const PARTNERS = ['BIESSE', 'HOMAG', 'REHAU', 'BLUM', 'EGGER', 'HETTICH', 'KLEIBERIT', 'ALPHACAM'];

const PartnersMarquee: React.FC = () => (
  <section style={{ background: '#fafaf8', borderBottom: '1px solid #efefed', overflow: 'hidden', padding: '0' }}>
    <div style={{ display: 'flex', alignItems: 'center', height: 64 }}>
      {/* Label */}
      <div style={{ flexShrink: 0, padding: '0 32px 0 40px', borderRight: '1px solid #e5e5e5', height: '100%', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#a3a3a3', whiteSpace: 'nowrap' }}>
          Partner equipment
        </span>
      </div>
      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Gradient masks */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #fafaf8, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #fafaf8, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <style>{`
          @keyframes hw-mq { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          .hw-marquee { display: flex; gap: 64px; animation: hw-mq 40s linear infinite; white-space: nowrap; }
        `}</style>
        <div className="hw-marquee">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <span key={i} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#b0b0b0', fontFamily: "'Inter Display', Inter, sans-serif" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── SECTION 5 — Services slider ───────────────────────────────────────────────
type FilterKey = 'all' | ServiceOrderType;

interface FilterChip { key: FilterKey; label: string; color?: string }

const FILTER_CHIPS: FilterChip[] = [
  { key: 'all',                  label: 'All services' },
  { key: 'browse-and-order',     label: 'Catalog · in stock', color: BRAND_NEUTRAL },
  { key: 'send-file-and-process',label: 'CNC processing',     color: '#1d4ed8' },
  { key: 'describe-and-request', label: 'Custom',             color: '#b45309' },
  { key: 'informational',        label: 'Coming soon',        color: '#737373' },
];

const ServicesSlider: React.FC<{ services: Service[] }> = ({ services }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<FilterKey>('all');
  const [slideIdx, setSlideIdx] = useState(0);

  const filtered = active === 'all'
    ? services
    : services.filter(s => s.orderType === active);

  const title = (s: Service) => s.title;

  const description = (s: Service) => {
    const d = s.description;
    return d ? d.slice(0, 90) + (d.length > 90 ? '…' : '') : '';
  };

  const svcColors = (s: Service): { from: string; to: string; badge: string; badgeBg: string } => {
    if (s.brand === 'skylum') return { from: '#0091DB', to: '#141A5C', badge: 'Skylum',        badgeBg: '#0061A8' };
    const t = ORDER_TYPE_CONFIG[s.orderType as ServiceOrderType];
    return { from: t?.heroFrom ?? '#1a1a1a', to: t?.heroTo ?? '#0a0a0a', badge: t?.label ?? '', badgeBg: t?.tagFg ?? BRAND_NEUTRAL };
  };

  const svcCta = (s: Service) => {
    if (s.orderType === 'browse-and-order')      return lang === 'he' ? 'צפה בקטלוג' : 'Browse catalog';
    if (s.orderType === 'send-file-and-process') return lang === 'he' ? 'שלח קובץ' : 'Send a file';
    if (s.orderType === 'describe-and-request')  return lang === 'he' ? 'התחל בריף' : 'Start a brief';
    return lang === 'he' ? 'פרטים נוספים' : 'Learn more';
  };

  const scroll = (dir: 'l' | 'r') => {
    if (!scrollRef.current) return;
    const amount = 384;
    scrollRef.current.scrollBy({ left: dir === 'r' ? amount : -amount, behavior: 'smooth' });
    setSlideIdx(i => Math.max(0, Math.min(filtered.length - 1, dir === 'r' ? i + 1 : i - 1)));
  };

  const progress = filtered.length > 0 ? ((slideIdx + 1) / filtered.length) * 100 : 0;

  if (!services.length) return null;

  return (
    <section id="services" style={{ background: '#fff', padding: '96px 0 64px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, marginBottom: 32 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>
              02 · Services
            </span>
            <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', margin: '12px 0 0', lineHeight: 1.05, fontFamily: "'Inter Display', Inter, sans-serif" }}>
              {lang === 'he' ? 'שישה קווי ייצור, שולחן הזמנות אחד' : 'Six production lines, one ordering desk'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3', marginRight: 8 }}>
              {String(slideIdx + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
            </span>
            <button onClick={() => scroll('l')} style={{ width: 46, height: 46, borderRadius: 999, border: '1px solid #d4d4d4', background: '#fff', color: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('r')} style={{ width: 46, height: 46, borderRadius: 999, border: '1px solid #0a0a0a', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {FILTER_CHIPS.map(f => {
            const isCur = active === f.key;
            return (
              <button
                key={f.key}
                onClick={() => { setActive(f.key); setSlideIdx(0); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: '.03em',
                  border: `1px solid ${isCur ? '#0a0a0a' : '#e0e0e0'}`,
                  background: isCur ? '#0a0a0a' : '#fff',
                  color: isCur ? '#fff' : '#262626',
                  cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit'
                }}
              >
                {f.color && <span style={{ width: 6, height: 6, borderRadius: 99, background: isCur ? '#fff' : f.color, flexShrink: 0 }} />}
                {f.label}
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: isCur ? 'rgba(255,255,255,.5)' : '#a3a3a3' }}>
                  {f.key === 'all' ? services.length : services.filter(s => s.orderType === f.key).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards track */}
      <div
        ref={scrollRef}
        style={{ display: 'flex', gap: 20, padding: '0 48px 32px', overflowX: 'auto', scrollbarWidth: 'none' }}
        className="no-scrollbar"
      >
        {filtered.map((svc) => {
          const cols = svcColors(svc);
          const isComingSoon = svc.visibilityStatus === 'coming_soon';
          return (
            <div
              key={svc.id}
              onClick={() => !isComingSoon && navigate(ROUTES.SERVICE(svc.slug))}
              style={{
                flex: '0 0 360px', height: 500, borderRadius: 20, position: 'relative',
                overflow: 'hidden', cursor: isComingSoon ? 'default' : 'pointer',
                background: `linear-gradient(135deg, ${cols.from}, ${cols.to})`,
                transition: 'transform .25s'
              }}
              onMouseEnter={e => { if (!isComingSoon) (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              {/* Background image */}
              {svc.imageUrl && (
                <img
                  src={svc.imageUrl}
                  alt={title(svc)}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: isComingSoon ? 'grayscale(1) brightness(.5)' : undefined }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              {/* Scrim */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.92), rgba(0,0,0,.04) 55%, transparent)' }} />

              {/* Coming soon overlay */}
              {isComingSoon && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 4 }}>
                  <div style={{ width: 52, height: 52, border: '2px solid rgba(255,255,255,.6)', borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 22 }}>◷</div>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700 }}>Coming Soon</span>
                </div>
              )}

              {/* Content */}
              <div style={{ position: 'relative', height: '100%', padding: 28, display: 'flex', flexDirection: 'column', color: '#fff', zIndex: 2 }}>
                {/* Badge */}
                <span style={{ alignSelf: 'flex-start', background: cols.badgeBg, color: '#fff', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 700, padding: '5px 10px', borderRadius: 4 }}>
                  {cols.badge}
                </span>

                {/* Bottom content */}
                <div style={{ marginTop: 'auto' }}>
                  <h4 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.01em', margin: '0 0 10px', lineHeight: 1.15, fontFamily: "'Inter Display', Inter, sans-serif" }}>
                    {title(svc)}
                  </h4>
                  <p style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 300, color: 'rgba(255,255,255,.72)', margin: '0 0 20px' }}>
                    {description(svc)}
                  </p>
                  {!isComingSoon && (
                    <button
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderRadius: 999,
                        background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)',
                        color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '.04em',
                        cursor: 'pointer', backdropFilter: 'blur(8px)', fontFamily: 'inherit'
                      }}
                    >
                      {svcCta(svc)}
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar hint */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#a3a3a3', letterSpacing: '.1em' }}>← →</span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3' }}>to navigate · drag with mouse</span>
        <div style={{ flex: 1, height: 2, background: '#e0e0e0', borderRadius: 99, overflow: 'hidden', maxWidth: 280, marginLeft: 'auto' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: BRAND_NEUTRAL, borderRadius: 99, transition: 'width .3s' }} />
        </div>
      </div>
    </section>
  );
};

// ── SECTION 7 — Stories slider ────────────────────────────────────────────────
type StoryTab = 'all' | 'project' | 'news';
const STORY_TABS: Array<{ key: StoryTab; label: string }> = [
  { key: 'all',     label: 'All' },
  { key: 'project', label: 'Projects' },
  { key: 'news',    label: 'News' },
];

const StoriesSlider: React.FC<{ stories: Story[] }> = ({ stories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<StoryTab>('all');

  const visible = tab === 'all' ? stories : stories.filter(s =>
    tab === 'project' ? s.type === 'CUSTOMER STORY' : s.type === 'EVENTS'
  );

  const scroll = (dir: 'l' | 'r') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'r' ? 310 : -310, behavior: 'smooth' });
  };

  if (!stories.length) return null;

  return (
    <section style={{ background: '#fff', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>
              04 · Recent
            </span>
            <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>
              Projects, news &amp; production updates
            </h2>
          </div>
          {/* Tab filters + nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {STORY_TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: '.03em',
                    border: `1px solid ${tab === t.key ? '#0a0a0a' : '#e0e0e0'}`,
                    background: tab === t.key ? '#0a0a0a' : '#fff',
                    color: tab === t.key ? '#fff' : '#262626',
                    cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit'
                  }}
                >{t.label}</button>
              ))}
            </div>
            <span style={{ width: 1, height: 24, background: '#e0e0e0' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => scroll('l')} style={{ width: 44, height: 44, borderRadius: 999, border: '1px solid #d4d4d4', background: '#fff', color: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
              <button onClick={() => scroll('r')} style={{ width: 44, height: 44, borderRadius: 999, border: '1px solid #0a0a0a', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar" style={{ display: 'flex', gap: 20, padding: '0 48px 24px', overflowX: 'auto' }}>
        {(visible.length ? visible : stories).map((s) => {
          const accent = s.type === 'CUSTOMER STORY' ? SKYLUM_BLUE : BRAND_NEUTRAL;
          return (
            <Link key={s.id} to={`/stories/${s.slug}`} style={{ flex: '0 0 290px', textDecoration: 'none' }}>
              <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 18, overflow: 'hidden', marginBottom: 14, background: '#262626' }}>
                {s.imageUrl && (
                  <img src={s.imageUrl} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5), transparent)' }} />
                <span style={{ position: 'absolute', top: 14, left: 14, background: accent, color: '#fff', fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', padding: '5px 9px', fontWeight: 800, borderRadius: 4 }}>
                  {s.type}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, margin: '0 0 6px', color: '#0a0a0a' }}>{s.title}</h3>
              {s.date && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#737373' }}>{s.date}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

// ── SECTION 8 — Work Starts Block ─────────────────────────────────────────────
const WorkStartsBlock: React.FC = () => (
  <section style={{ background: '#fff', padding: '120px 48px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 32 }}>
        <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>
          Philosophy
        </span>
        <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
      </div>
      <h2 style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: '-.022em', fontWeight: 600, maxWidth: 980, margin: '0 0 56px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
        Work starts from the{' '}
        <em style={{ color: BRAND_NEUTRAL, fontStyle: 'italic', fontWeight: 500 }}>inside.</em>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80 }}>
        <div>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: '#262626', fontWeight: 300, margin: '0 0 22px' }}>
            Production is rarely static. Layouts change, dimensions vary, and each project introduces new constraints that must be handled without disrupting the workflow.
          </p>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: '#525252', fontWeight: 300, margin: 0 }}>
            We focus on the internal logic of CNC-based production — enabling stable throughput, fewer errors, and predictable results.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Link
            to="/about"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', borderBottom: '1.5px solid #0a0a0a', textDecoration: 'none', color: '#0a0a0a' }}
          >
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700 }}>
              Explore Our Engineering
            </span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [stories, setStories]   = useState<Story[]>([]);

  useEffect(() => {
    getServices().then(all =>
      setServices(all.filter(s => s.visibilityStatus !== 'hidden'))
    );
    getStories().then(all =>
      setStories(all.filter(s => s.visibilityStatus !== 'hidden').slice(0, 8))
    );
  }, []);

  return (
    <div style={{ background: '#fff' }}>
      <HomeHero />
      <TrustStrip />
      <PartnersMarquee />
      {/* Audience section — moved UP before services per UX pass */}
      <WhoWeWorkWith orderType="browse-and-order" />
      <ServicesSlider services={services} />
      <HowItWorks orderType="browse-and-order" />
      <StoriesSlider stories={stories} />
      <WorkStartsBlock />
      <CTABanner
        orderType="browse-and-order"
        title="Send us your DXF or describe the job — we reply within one business day."
        sub="EN / HE bilingual support. Free quote, no commitment."
        onPrimary={() => navigate(ROUTES.QUOTE)}
      />
    </div>
  );
};
