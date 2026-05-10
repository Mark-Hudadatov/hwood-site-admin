/**
 * MAIN LAYOUT
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Menu, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import { getCompanyInfo } from '../services/data/dataService';
import type { CompanyInfo } from '../domain/types';

// Premium Components
import { LoadingScreen, PageTransition } from '../components/premium';
import { CookieBanner } from '../components/CookieBanner';

// WhatsApp Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ScrollToTop Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Language Switcher
const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'dark' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'he' : 'en';
    localStorage.setItem('i18nextLng', newLang);
    i18n.changeLanguage(newLang).then(() => window.location.reload());
  };

  const baseClasses = "flex items-center gap-1.5 border rounded-full px-3 py-1.5 transition-all font-medium text-[11px]";
  const variantClasses = variant === 'light'
    ? "border-white/30 text-white/80 hover:bg-white/20 hover:border-white/60"
    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400";

  return (
    <button onClick={toggleLanguage} className={`${baseClasses} ${variantClasses}`} aria-label="Switch language">
      <Globe className="w-3.5 h-3.5" />
      <span>{currentLang === 'en' ? 'עברית' : 'English'}</span>
    </button>
  );
};

// TopBar Component
const TopBar: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<Pick<CompanyInfo, 'phone' | 'email'> | null>(null);

  useEffect(() => {
    getCompanyInfo().then(info => {
      if (info) setCompanyInfo({ phone: info.phone, email: info.email });
    });
  }, []);

  return (
    <div style={{ background: '#002828', position: 'relative', overflow: 'hidden' }}>
      <div className="teal-stripes" style={{ opacity: 0.15 }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#00d4aa', fontWeight: 500, letterSpacing: '0.04em' }}>Open for orders</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {companyInfo?.phone && (
            <a href={`tel:${companyInfo.phone}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', letterSpacing: '0.02em' }}>
              {companyInfo.phone}
            </a>
          )}
          {companyInfo?.email && (
            <a href={`mailto:${companyInfo.email}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', letterSpacing: '0.02em' }}
              className="hidden sm:inline">
              {companyInfo.email}
            </a>
          )}
          <LanguageSwitcher variant="light" />
        </div>
      </div>
    </div>
  );
};

// Nav links definition
const NAV_LINKS = [
  { label: 'Portfolio', labelHe: 'פורטפוליו', sub: 'Our work',     subHe: 'העבודות שלנו', href: '/portfolio' },
  { label: 'About',     labelHe: 'אודות',     sub: 'Our story',    subHe: 'הסיפור שלנו', href: '/about'     },
  { label: 'Contact',   labelHe: 'צור קשר',   sub: 'Get in touch', subHe: 'ליצור קשר',   href: '/contact'   },
] as const;

// Header Component
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #efefef', boxShadow: '0 1px 0 #efefef' }}>
      <TopBar />
      <nav style={{ display: 'flex', alignItems: 'stretch', minHeight: 72 }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ padding: '10px 24px', borderRight: '1px solid #efefef', display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <img src="/logo.png" alt="HWOOD" style={{ height: 44, width: 'auto', maxWidth: 150, objectFit: 'contain' }} />
        </div>

        {/* Nav links — desktop */}
        <div className="hidden lg:flex" style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', display: 'flex' }}>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '0 28px', textDecoration: 'none', position: 'relative',
                  borderBottom: isActive ? '2px solid #005f5f' : '2px solid transparent',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#005f5f' : '#1a1a1a', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                  {lang === 'he' ? link.labelHe : link.label}
                </span>
                <span style={{ fontSize: 10, color: '#b0b0b0', marginTop: 3, letterSpacing: '0.03em' }}>
                  {lang === 'he' ? link.subHe : link.sub}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right: CTA + Skylum notch + mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'stretch', marginLeft: 'auto' }}>
          {/* Get a quote CTA */}
          <div className="hidden md:flex" style={{ alignItems: 'center', padding: '0 24px', borderLeft: '1px solid #efefef' }}>
            <Link
              to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', background: '#005f5f', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#004d4d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#005f5f'; }}
            >
              {lang === 'he' ? 'בקש הצעת מחיר' : 'Get a quote'}
            </Link>
          </div>

          {/* Skylum notched panel */}
          <div
            className="hidden lg:flex"
            style={{
              background: '#f0f0f0',
              clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%)',
              padding: '0 24px 0 36px',
              alignItems: 'center',
              gap: 8,
              minWidth: 156,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1, marginBottom: 5 }}>Part of</span>
              <a href="https://skylum.co.il" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                <img
                  src="https://skylum.co.il/wp-content/uploads/2023/08/IMG_0812.png"
                  alt="Skylum"
                  style={{ height: 28, width: 'auto', maxWidth: 90, objectFit: 'contain', opacity: 0.6, transition: 'opacity 0.2s' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  onMouseEnter={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                  onMouseLeave={(e) => { (e.target as HTMLImageElement).style.opacity = '0.6'; }}
                />
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            style={{ padding: '0 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', borderLeft: '1px solid #efefef' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #efefef', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ padding: '8px 0 16px' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '13px 24px', fontSize: 14, fontWeight: 500, color: location.pathname === link.href ? '#005f5f' : '#1a1a1a', textDecoration: 'none', borderLeft: location.pathname === link.href ? '3px solid #005f5f' : '3px solid transparent' }}
              >
                {lang === 'he' ? link.labelHe : link.label}
              </Link>
            ))}
            <div style={{ margin: '12px 24px 0', paddingTop: 12, borderTop: '1px solid #efefef' }}>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', background: '#005f5f', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                {lang === 'he' ? 'בקש הצעת מחיר' : 'Get a quote'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);

  useEffect(() => {
    getCompanyInfo().then(info => { if (info) setCompanyInfo(info); });
    supabase.from('social_links').select('*').eq('is_visible', true).order('sort_order')
      .then(({ data }) => {
        if (data) setSocialLinks(data.filter((l: any) => l.url).map((l: any) => ({ platform: l.platform, url: l.url })));
      });
  }, []);

  const platformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':  return Facebook;
      case 'instagram': return Instagram;
      case 'linkedin':  return Linkedin;
      case 'youtube':   return Youtube;
      case 'whatsapp':  return MessageCircle;
      default:          return null;
    }
  };

  const navColumns = [
    {
      title: isHe ? 'הזמנה' : 'Order',
      links: [
        { label: isHe ? 'הזמנה מקטלוג'  : 'Catalog Order',   href: '/#services' },
        { label: isHe ? 'הזמנת פרויקט'  : 'Project Order',   href: '/#services' },
        { label: isHe ? 'הזמנה מותאמת'  : 'Custom Order',    href: '/#services' },
        { label: isHe ? 'בקש הצעת מחיר' : 'Request a Quote', href: '/contact'   },
      ],
    },
    {
      title: 'Skylum',
      links: [
        { label: isHe ? 'אודות Skylum'  : 'About Skylum', href: 'https://skylum.co.il', external: true },
        { label: isHe ? 'חיפוי חזיתות' : 'Facades',       href: 'https://skylum.co.il', external: true },
        { label: isHe ? 'לוחות חיפוי'  : 'Cladding',      href: 'https://skylum.co.il', external: true },
      ],
    },
    {
      title: isHe ? 'חברה' : 'Company',
      links: [
        { label: isHe ? 'אודות'     : 'About',     href: '/about'     },
        { label: isHe ? 'פורטפוליו' : 'Portfolio', href: '/portfolio' },
        { label: isHe ? 'צור קשר'   : 'Contact',   href: '/contact'   },
      ],
    },
  ];

  return (
    <footer style={{ background: '#0a0a0a', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div className="teal-stripes" style={{ opacity: 0.12 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Get in touch banner */}
        <div style={{ padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 64px) clamp(24px, 4vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00d4aa', marginBottom: 12, marginTop: 0 }}>
              {isHe ? 'בואו נעבוד יחד' : "Let's work together"}
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, margin: 0 }}>
              {isHe ? 'מוכנים להתחיל?' : 'Ready to get in touch?'}
            </h2>
          </div>
          <Link
            to="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', background: '#005f5f', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#004d4d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#005f5f'; }}
          >
            {isHe ? 'בקש הצעת מחיר' : 'Get a quote'} →
          </Link>
        </div>

        {/* Main grid */}
        <div style={{ padding: 'clamp(32px, 4vw, 48px) clamp(24px, 5vw, 64px) clamp(24px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'clamp(24px, 4vw, 48px)' }}>
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, gridColumn: 'span 1' }}>
            <img src="/logo.png" alt="HWOOD" style={{ height: 34, width: 'auto', maxWidth: 130, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            {companyInfo?.description && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, maxWidth: 280, margin: 0 }}>
                {companyInfo.description}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {companyInfo?.address && (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.5, margin: 0 }}>{companyInfo.address}</p>
              )}
              {companyInfo?.phone && (
                <a href={`tel:${companyInfo.phone}`} style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', textDecoration: 'none' }}>
                  {companyInfo.phone}
                </a>
              )}
              {companyInfo?.email && (
                <a href={`mailto:${companyInfo.email}`} style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', textDecoration: 'none' }}>
                  {companyInfo.email}
                </a>
              )}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', margin: 0 }}>
                {isHe ? 'א׳–ה׳ 08:00–18:00' : 'Sun–Thu 08:00–18:00'}
              </p>
            </div>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              {socialLinks.map((link) => {
                const Icon = platformIcon(link.platform);
                if (!Icon) return null;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.52)', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
                  >
                    <Icon style={{ width: 15, height: 15 }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', margin: 0 }}>
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {(link as any).external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skylum lockup + back-to-top */}
        <div style={{ padding: '20px clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Part of</span>
            <a href="https://skylum.co.il" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://skylum.co.il/wp-content/uploads/2023/08/IMG_0812.png"
                alt="Skylum"
                style={{ height: 20, width: 'auto', objectFit: 'contain', opacity: 0.4, filter: 'brightness(0) invert(1)', transition: 'opacity 0.2s' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                onMouseEnter={(e) => { (e.target as HTMLImageElement).style.opacity = '0.75'; }}
                onMouseLeave={(e) => { (e.target as HTMLImageElement).style.opacity = '0.4'; }}
              />
            </a>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontSize: 16, fontWeight: 700, transition: 'background 0.2s, color 0.2s', lineHeight: 1, flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#00d4aa'; e.currentTarget.style.color = '#002828'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0a0a0a'; }}
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>

        {/* Copyright row */}
        <div style={{ padding: '14px clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', margin: 0 }}>
            © {new Date().getFullYear()} HWOOD · Netanya, Israel
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: isHe ? 'פרטיות'    : 'Privacy Policy', href: '/privacy' },
              { label: isHe ? 'תנאי שימוש' : 'Terms of Use',  href: '/terms'   },
              { label: isHe ? 'עוגיות'    : 'Cookies',        href: '/cookies' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.22)'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Wrapper
const FooterWrapper: React.FC = () => <Footer />;

// WhatsApp Button
const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '972549222804';
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#20BA5C] hover:scale-110 transition-all duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};

// Main Layout Export
export const MainLayout: React.FC = () => {
  return (
    <>
      <LoadingScreen minDuration={1200} />
      <div className="w-full min-h-screen font-sans flex flex-col" style={{ overflowX: 'clip' }}>
        <ScrollToTop />
        <Header />
        <main className="flex-1 flex flex-col">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <FooterWrapper />
        <WhatsAppButton />
        <CookieBanner />
      </div>
    </>
  );
};
