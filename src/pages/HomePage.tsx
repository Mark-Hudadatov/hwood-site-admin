/**
 * HOME PAGE — HWOOD × SKYLUM
 * ===========================
 * Design ref: redesign/journey/page-home.jsx
 *
 * Sections:
 *  1. Hero (dark video panel + white order-type route picker)
 *  2. Trust strip (4 stats)
 *  3. Three ways to work (order-type cards)
 *  4. Who We Work With
 *  5. How It Works
 *  6. Stories / Recent projects slider
 *  7. Why Choose Us
 *  8. Work Starts Block
 *  9. CTA Banner
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, Grid3X3, FileText, PenLine, Play, Pause, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { Service, Story } from '../domain/types';
import { getServices, getStories } from '../services/data/dataService';
import { ROUTES } from '../router';
import { useTranslation } from 'react-i18next';
import { Stripes } from '../components/journey/Stripes';
import { WhoWeWorkWith, HowItWorks, CTABanner, WhyChooseUs } from '../components/journey/sections';
import { BRAND_NEUTRAL, SKYLUM_BLUE, ORDER_TYPE_CONFIG, ServiceOrderType } from '../lib/orderTypes';

// ── Fallbacks ─────────────────────────────────────────────────────────────────
const SVC_FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none"><rect width="800" height="1000" fill="#1a1a1a"/><g transform="translate(360,460)" stroke="#fff" stroke-width="3" fill="none" opacity="0.3"><rect x="0" y="0" width="80" height="50" rx="3"/><rect x="8" y="12" width="20" height="30" rx="2"/><rect x="33" y="12" width="20" height="30" rx="2"/></g></svg>`)}`;

// ── SECTION 1 — Hero ──────────────────────────────────────────────────────────
const HomeHero: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const ORDER_ROUTES: Array<{ ot: ServiceOrderType; icon: typeof Grid3X3; label: string; labelHe: string; value: string; valueHe: string; slug: string }> = [
    { ot: 'browse-and-order',     icon: Grid3X3,   label: 'Browse & order',            labelHe: 'עיון והזמנה',         value: '30+ ready cabinet modules',         valueHe: '30+ מודולים מוכנים',         slug: 'cabinet-storage-modules' },
    { ot: 'send-file-and-process', icon: FileText,  label: 'Send a CNC file',           labelHe: 'שלח קובץ CNC',        value: 'DXF · sketches · panel list',        valueHe: 'DXF · סקיצות · רשימת פנלים', slug: 'cnc-services-for-professionals' },
    { ot: 'describe-and-request', icon: PenLine,   label: 'Describe a custom kitchen', labelHe: 'תאר מטבח מותאם',      value: 'We design, engineer, build',         valueHe: 'אנחנו מעצבים, מהנדסים, בונים', slug: 'custom-kitchen-projects' },
  ];

  const handleRoute = (slug: string, ot: ServiceOrderType) => {
    sessionStorage.setItem('hw_active_order_type', ot);
    navigate(ROUTES.SERVICE(slug));
  };

  return (
    <section style={{ position: 'relative', height: 680, background: '#0a0a0a', display: 'flex', overflow: 'hidden' }}>
      {/* Left — dark image panel */}
      <div style={{ position: 'relative', width: '62%', overflow: 'hidden', flexShrink: 0 }}>
        {/* Grid overlay */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .05 }} preserveAspectRatio="none" viewBox="0 0 1000 680">
          <defs><pattern id="g2h" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0 L0 0 0 48" fill="none" stroke="#fff" strokeWidth=".8"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#g2h)"/>
        </svg>
        {/* Scrim */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 50%, rgba(0,0,0,.4) 100%)' }} />
        {/* Play reel badge */}
        <div style={{ position: 'absolute', top: 32, left: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ width: 40, height: 40, borderRadius: 99, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', cursor: 'pointer' }}>
            <Play size={14} fill="currentColor" />
          </button>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.7)' }}>Workshop reel · 0:48</span>
        </div>
        {/* Headline */}
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 48, color: '#fff' }}>
          <h1 style={{ fontSize: 80, lineHeight: 1, letterSpacing: '-.025em', fontWeight: 600, fontFamily: "'Inter Display', Inter, sans-serif", margin: 0 }}>
            CNC Production<br />Systems
          </h1>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 18, lineHeight: 1.55, fontWeight: 300, margin: '24px 0 0', maxWidth: 540 }}>
            Modular systems and CNC processing for kitchen and interior production.
          </p>
        </div>
      </div>

      {/* Right — route picker */}
      <div style={{ position: 'relative', flex: 1, background: '#fff', padding: '40px 36px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>
          {lang === 'he' ? 'התחל הזמנה' : 'Start your order'}
        </span>
        <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.015em', lineHeight: 1.2, margin: '12px 0 24px', color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif" }}>
          {lang === 'he' ? 'על איזה פרויקט אתה עובד?' : 'What kind of project are you working on?'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ORDER_ROUTES.map((o) => {
            const t = ORDER_TYPE_CONFIG[o.ot];
            const Icon = o.icon;
            return (
              <button
                key={o.ot}
                onClick={() => handleRoute(o.slug, o.ot)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', border: `1px solid ${t.accent}30`, borderLeft: `3px solid ${t.accent}`, borderRadius: 12, background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <span style={{ width: 38, height: 38, borderRadius: 8, background: t.tagBg, color: t.tagFg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0a0a0a', marginBottom: 2 }}>
                    {lang === 'he' ? o.labelHe : o.label}
                  </div>
                  <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 300 }}>
                    {lang === 'he' ? o.valueHe : o.value}
                  </span>
                </div>
                <span style={{ color: t.accentDark, flexShrink: 0 }}><ArrowRight size={15} /></span>
              </button>
            );
          })}
        </div>

        {/* Trust micro-element */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: lang === 'he' ? 'תשובה תוך יום עסקים אחד · EN / HE' : 'Reply within 1 business day · EN / HE' },
            { label: lang === 'he' ? 'הצעת מחיר חינם, ללא התחייבות' : 'Free quote, no commitment' },
          ].map((item, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#262626' }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: `${BRAND_NEUTRAL}10`, color: BRAND_NEUTRAL, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={12} />
              </span>
              {item.label}
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
        ['12 yrs', 'in CNC production', 'Netanya · since 2014'],
        ['2,400 m²', 'facility footprint', 'Single-site delivery'],
        ['180+', 'kitchens / yr', 'Mixed series & custom'],
        ['72 h', 'avg. lead time', 'From DXF to ready panel'],
      ].map(([k, v, sub], i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-.02em', color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif" }}>{k}</span>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>{v}</span>
          <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 300 }}>{sub}</span>
        </div>
      ))}
    </div>
  </section>
);

// ── SECTION 3 — Three ways ────────────────────────────────────────────────────
const ThreeWays: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const CARDS = [
    { ot: 'browse-and-order' as ServiceOrderType, slug: 'cabinet-storage-modules', label: 'Browse & order', body: '30+ ready cabinet modules. In stock, configurable, fast lead time.', cta: 'Browse catalog' },
    { ot: 'send-file-and-process' as ServiceOrderType, slug: 'cnc-services-for-professionals', label: 'Send a file', body: 'Send your DXF, panel list, or sketch. We cut, edge, and ship back.', cta: 'Send a file' },
    { ot: 'describe-and-request' as ServiceOrderType, slug: 'custom-kitchen-projects', label: 'Describe a project', body: 'From idea to installed kitchen. Engineering-led custom production.', cta: 'Start a brief' },
  ];

  return (
    <section style={{ background: '#fff', padding: '96px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 32 }}>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>02 · Three ways to work with us</span>
          <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
        </div>
        <h2 style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 48, fontFamily: "'Inter Display', Inter, sans-serif" }}>
          Pick your route. We do the rest.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {CARDS.map((card) => {
            const t = ORDER_TYPE_CONFIG[card.ot];
            return (
              <article key={card.ot} style={{ position: 'relative', height: 480, borderRadius: 20, overflow: 'hidden', background: `linear-gradient(135deg, ${t.heroFrom}, ${t.heroTo})`, padding: 32, display: 'flex', flexDirection: 'column', color: '#fff', cursor: 'pointer', transition: 'transform .3s' }}
                onClick={() => { sessionStorage.setItem('hw_active_order_type', card.ot); navigate(ROUTES.SERVICE(card.slug)); }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
              >
                <Stripes opacity={0.12} />
                <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.accent }}>{t.sub}</span>
                  <h3 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-.018em', margin: '16px 0 12px', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>{card.label}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', fontWeight: 300, lineHeight: 1.55, margin: 0 }}>{card.body}</p>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: t.accent, color: '#0a0a0a', border: 0, fontFamily: 'inherit' }}>
                    {card.cta} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── SECTION 6 — Stories slider ────────────────────────────────────────────────
const StoriesSlider: React.FC<{ stories: Story[] }> = ({ stories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'l' | 'r') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'r' ? 310 : -310, behavior: 'smooth' });
  };

  if (!stories.length) return null;

  return (
    <section style={{ background: '#fff', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>04 · Recent</span>
            <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>
              Projects &amp; production updates
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => scroll('l')} style={{ width: 44, height: 44, borderRadius: 999, border: '1px solid #d4d4d4', background: '#fff', color: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
            <button onClick={() => scroll('r')} style={{ width: 44, height: 44, borderRadius: 999, border: '1px solid #0a0a0a', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="no-scrollbar" style={{ display: 'flex', gap: 20, padding: '0 32px 24px', overflowX: 'auto' }}>
        {stories.map((s) => (
          <Link key={s.id} to={`/stories/${s.slug}`} style={{ flex: '0 0 290px', textDecoration: 'none' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 16, overflow: 'hidden', marginBottom: 14, background: '#262626' }}>
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5), transparent)' }} />
              <span style={{ position: 'absolute', top: 14, left: 14, background: BRAND_NEUTRAL, color: '#fff', fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', padding: '5px 9px', fontWeight: 800, borderRadius: 3 }}>{s.type}</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, margin: '0 0 6px', color: '#0a0a0a' }}>{s.title}</h3>
            {s.date && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#737373' }}>{s.date}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
};

// ── SECTION 8 — Work Starts Block ─────────────────────────────────────────────
const WorkStartsBlock: React.FC = () => (
  <section style={{ background: '#fff', padding: '120px 64px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 32 }}>
        <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>Philosophy</span>
        <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
      </div>
      <h2 style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: '-.022em', fontWeight: 600, maxWidth: 980, margin: '0 0 56px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
        Work starts from the{' '}
        <em style={{ color: '#6b8a4a', fontStyle: 'italic', fontWeight: 500 }}>inside.</em>
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
          <Link to="/about" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', borderBottom: '1.5px solid #0a0a0a', textDecoration: 'none', color: '#0a0a0a' }}>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700 }}>Explore Our Engineering</span>
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
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    getStories().then(s => setStories(s.filter(st => st.visibilityStatus !== 'hidden').slice(0, 6)));
  }, []);

  return (
    <div style={{ background: '#fff' }}>
      <HomeHero />
      <TrustStrip />
      <ThreeWays />
      <WhoWeWorkWith orderType="browse-and-order" />
      <HowItWorks orderType="browse-and-order" />
      <StoriesSlider stories={stories} />
      <WhyChooseUs orderType="browse-and-order" />
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
