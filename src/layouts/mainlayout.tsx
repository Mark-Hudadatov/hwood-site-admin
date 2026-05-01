/**
 * MAIN LAYOUT — HWOOD × SKYLUM
 * ==============================
 * Chrome: UtilityBar → Header (order-type nav + context strip) → <Outlet/> → Footer
 * Header is order-type aware: shows accent strip when user is inside a journey.
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, ArrowRight, Search, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { LoadingScreen, PageTransition } from '../components/premium';
import { getServiceBySlug } from '../services/data/dataService';
import { Stripes } from '../components/journey/Stripes';
import {
  NAV_ORDER_TYPES,
  getOrderTypeConfig,
  BRAND_NEUTRAL,
  SKYLUM_BLUE,
  ServiceOrderType,
} from '../lib/orderTypes';
import { Service } from '../domain/types';

// ── WhatsApp Icon ─────────────────────────────────────────────────────────────
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26C2.12 6.45 6.555 2 12.005 2c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ── Scroll-to-top on route change ─────────────────────────────────────────────
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

// ── Language switcher ─────────────────────────────────────────────────────────
const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'dark' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('he') ? 'he' : 'en';
  const toggle = () => {
    const nl = currentLang === 'en' ? 'he' : 'en';
    localStorage.setItem('i18nextLng', nl);
    i18n.changeLanguage(nl).then(() => window.location.reload());
  };
  const base = 'flex items-center gap-1.5 border rounded-full px-3 py-1.5 transition-all font-medium text-[11px] cursor-pointer';
  const cls = variant === 'light'
    ? `${base} border-white/50 text-white hover:bg-white/20`
    : `${base} border-neutral-300 text-neutral-700 hover:bg-neutral-100`;
  return (
    <button onClick={toggle} className={cls} aria-label="Switch language">
      <Globe className="w-3.5 h-3.5" />
      <span>{currentLang === 'en' ? 'עברית' : 'English'}</span>
    </button>
  );
};

// ── Utility Bar ───────────────────────────────────────────────────────────────
const UtilityBar: React.FC = () => (
  <div style={{ background: '#002828', color: 'rgba(255,255,255,.75)', fontSize: 11, padding: '8px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '.05em' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: '#00d4aa', boxShadow: '0 0 10px #00d4aa' }} />
        Production active · Netanya facility · 9:00 — 18:00 IST
      </span>
      <span style={{ color: 'rgba(255,255,255,.5)' }}>Order desk: +972 9 890-0000</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <Link to="/services/facade-systems-acp" style={{ color: 'rgba(255,255,255,.85)', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 11 }}>
        Visit{' '}
        <span style={{ background: `linear-gradient(135deg, ${SKYLUM_BLUE}, #141A5C)`, color: '#fff', padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 800, letterSpacing: '.15em' }}>SKYLUM</span>
        facades →
      </Link>
      <span style={{ color: 'rgba(255,255,255,.4)' }}>|</span>
      <LanguageSwitcher variant="light" />
    </div>
  </div>
);

// ── Breadcrumb ────────────────────────────────────────────────────────────────
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  orderType?: ServiceOrderType | string | null;
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, orderType }) => {
  const t = getOrderTypeConfig(orderType);
  return (
    <nav aria-label="breadcrumb" style={{ padding: '14px 32px', background: '#fafaf8', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, letterSpacing: '.05em', color: '#737373', fontWeight: 500 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#c4c4c4' }}>/</span>}
          {it.href ? (
            <Link to={it.href} style={{ color: '#737373', textDecoration: 'none' }}>{it.label}</Link>
          ) : (
            <span style={{ color: t?.tagFg || BRAND_NEUTRAL, fontWeight: 600 }}>{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────
interface HeaderState {
  activeOrderType: ServiceOrderType | null;
  currentService: Service | null;
  step?: number;
  totalSteps?: number;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contextState, setContextState] = useState<HeaderState>({ activeOrderType: null, currentService: null });

  // Detect current order type from route
  useEffect(() => {
    const match = location.pathname.match(/\/(services|subservices|products|quote|thank-you)\/([^/]+)/);
    if (!match) { setContextState({ activeOrderType: null, currentService: null }); return; }

    const [, segment, slug] = match;
    if (segment === 'services') {
      getServiceBySlug(slug).then(s => {
        if (s) setContextState({ activeOrderType: s.orderType || null, currentService: s });
      });
    } else {
      // Try to infer from URL segments or localStorage
      const cached = sessionStorage.getItem('hw_active_order_type') as ServiceOrderType | null;
      if (cached) setContextState({ activeOrderType: cached, currentService: null });
    }
  }, [location.pathname]);

  const currentType = contextState.activeOrderType;
  const ct = currentType ? getOrderTypeConfig(currentType) : null;

  const handleOrderTypeClick = (ot: ServiceOrderType) => {
    // Navigate to the service page that matches this order type
    const slugMap: Record<ServiceOrderType, string> = {
      'browse-and-order':     'cabinet-storage-modules',
      'send-file-and-process': 'cnc-services-for-professionals',
      'describe-and-request': 'custom-kitchen-projects',
      'informational':        'materials-panel-supply',
    };
    sessionStorage.setItem('hw_active_order_type', ot);
    navigate(`/services/${slugMap[ot]}`);
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      {/* Main nav row */}
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', padding: '0 32px', height: 80 }}>
        {/* Logo + Order type nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <img src="/logo.png" alt="HWOOD" style={{ height: 38, width: 'auto', maxWidth: 150 }} />
          </Link>
          <span style={{ width: 1, height: 32, background: '#e5e5e5', flexShrink: 0 }} />

          {/* Order types — primary desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'stretch', height: 80, gap: 0 }} className="hidden md:flex">
            {NAV_ORDER_TYPES.map((item) => {
              const tt = getOrderTypeConfig(item.orderType);
              const isActive = currentType === item.orderType;
              return (
                <button
                  key={item.orderType}
                  onClick={() => handleOrderTypeClick(item.orderType)}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    padding: '0 18px', cursor: 'pointer', position: 'relative',
                    background: 'transparent', border: 0,
                    borderBottom: `3px solid ${isActive ? tt.accent : 'transparent'}`,
                    marginBottom: -1, fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: isActive ? tt.tagFg : '#a3a3a3' }}>
                    {lang === 'he' ? item.subHe : item.sub}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: isActive ? '#0a0a0a' : '#262626', marginTop: 4, letterSpacing: '-.005em' }}>
                    {lang === 'he' ? item.labelHe : item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <nav style={{ display: 'flex', gap: 4, marginRight: 8 }} className="hidden md:flex">
            {[
              { label: lang === 'he' ? 'תיק עבודות' : 'Portfolio', href: '/portfolio' },
              { label: lang === 'he' ? 'אודות' : 'About', href: '/about' },
              { label: lang === 'he' ? 'צור קשר' : 'Contact', href: '/contact' },
            ].map(l => (
              <Link key={l.href} to={l.href} style={{ padding: '8px 12px', fontSize: 12.5, fontWeight: 500, color: '#525252', textDecoration: 'none', borderRadius: 6, transition: 'color .15s' }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <button style={{ width: 36, height: 36, borderRadius: 99, background: 'transparent', border: '1px solid #e5e5e5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#525252', cursor: 'pointer' }}>
            <Search size={15} />
          </button>

          <Link
            to="/quote"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: BRAND_NEUTRAL, color: '#fff', fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em', textDecoration: 'none', transition: 'background .15s' }}
          >
            {lang === 'he' ? 'קבל הצעת מחיר' : 'Get a quote'}
          </Link>

          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e5e5', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Context strip — shown when inside an order-type journey */}
      {ct && currentType && (
        <div style={{ background: `linear-gradient(90deg, ${ct.heroFrom}, ${ct.heroTo})`, color: '#fff', padding: '8px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.7)' }}>You are in</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{ct.label} · {ct.sub}</span>
          </div>
          <button
            onClick={() => { setContextState({ activeOrderType: null, currentService: null }); navigate('/'); }}
            style={{ background: 'transparent', border: 0, color: 'rgba(255,255,255,.65)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '.05em' }}
          >
            ← Change order type
          </button>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #e5e5e5', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }} className="md:hidden">
          {NAV_ORDER_TYPES.map(item => (
            <button key={item.orderType} onClick={() => { handleOrderTypeClick(item.orderType); setMobileOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', background: 'transparent', border: 0, borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{lang === 'he' ? item.labelHe : item.label}</span>
              <ArrowRight size={14} color="#a3a3a3" />
            </button>
          ))}
          {[{ label: 'Portfolio', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map(l => (
            <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)} style={{ padding: '12px 0', fontSize: 14, color: '#525252', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>{l.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  return (
    <footer style={{ background: '#0a1414', color: '#fff', padding: '80px 32px 24px', position: 'relative', overflow: 'hidden' }}>
      <Stripes opacity={0.4} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          {/* Brand column */}
          <div>
            <img src="/logo.png" alt="HWOOD" style={{ height: 38, width: 'auto', maxWidth: 150, filter: 'brightness(0) invert(1)' }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', fontWeight: 300, lineHeight: 1.6, margin: '24px 0', maxWidth: 320 }}>
              Industrial cabinetry, CNC services, and facade systems — manufactured in Netanya for the Israeli market.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600 }}>Part of</span>
              <span style={{ background: `linear-gradient(135deg, ${SKYLUM_BLUE}, #141A5C)`, color: '#fff', padding: '4px 10px', borderRadius: 5, fontSize: 10, fontWeight: 800, letterSpacing: '.18em' }}>SKYLUM</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 99, border: '1px solid rgba(255,255,255,.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.7)', transition: 'all .2s' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { h: lang === 'he' ? 'הזמנה' : 'Order', l: [
              { label: lang === 'he' ? 'הזמנה מקטלוג' : 'Catalog Order', href: '/services/cabinet-storage-modules' },
              { label: lang === 'he' ? 'הזמנת פרויקט' : 'Project Order', href: '/services/cnc-services-for-professionals' },
              { label: lang === 'he' ? 'הזמנה מותאמת' : 'Custom Order', href: '/services/custom-kitchen-projects' },
              { label: lang === 'he' ? 'הצעת מחיר' : 'Quote desk', href: '/quote' },
            ]},
            { h: lang === 'he' ? 'קהל יעד' : 'Audience', l: [
              { label: lang === 'he' ? 'יצרני ארונות' : 'Cabinet manufacturers', href: '#' },
              { label: lang === 'he' ? 'נגרות ופנים' : 'Joinery & carpentry', href: '#' },
              { label: lang === 'he' ? 'אדריכלים' : 'Architects', href: '#' },
              { label: lang === 'he' ? 'קבלנים' : 'Contractors', href: '#' },
            ]},
            { h: 'Skylum', l: [
              { label: lang === 'he' ? 'מערכות חזית' : 'Facade systems', href: '/services/facade-systems-acp' },
              { label: 'ACP panels', href: '#' },
              { label: 'HPL supply', href: '#' },
              { label: 'Visit Skylum →', href: '#' },
            ]},
            { h: lang === 'he' ? 'חברה' : 'Company', l: [
              { label: lang === 'he' ? 'אודות' : 'About', href: '/about' },
              { label: lang === 'he' ? 'תיק עבודות' : 'Projects', href: '/portfolio' },
              { label: lang === 'he' ? 'צור קשר' : 'Contact', href: '/contact' },
            ]},
          ].map((col) => (
            <div key={col.h}>
              <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: 18 }}>{col.h}</span>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.l.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', fontWeight: 300, textDecoration: 'none', transition: 'color .15s' }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, fontSize: 12, color: 'rgba(255,255,255,.5)', flexWrap: 'wrap', gap: 12 }}>
          <span>© {new Date().getFullYear()} HWOOD · Netanya, Israel · All rights reserved</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>Privacy</a>
            <a href="/terms" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── WhatsApp FAB ──────────────────────────────────────────────────────────────
const WhatsAppFab: React.FC = () => (
  <a
    href="https://wa.me/972501234567"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 99, background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px -8px rgba(37,211,102,.6)', zIndex: 50, textDecoration: 'none', transition: 'transform .2s, box-shadow .2s' }}
  >
    <WhatsAppIcon className="w-7 h-7" />
  </a>
);

// ── Main Layout ───────────────────────────────────────────────────────────────
export const MainLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <UtilityBar />
      <Header />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

// Export Breadcrumb so pages can use it
export { Breadcrumb };
