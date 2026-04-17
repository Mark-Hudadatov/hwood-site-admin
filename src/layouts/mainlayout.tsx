/**
 * MAIN LAYOUT - FIXED
 * ===================
 * FIXES:
 * ✅ WhatsApp button (bottom right, green)
 * ✅ One language button only
 * ✅ User icon → /login
 * ✅ ScrollToTop on route change
 * ✅ Language switch reloads page
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe, Facebook, Instagram, Linkedin, Youtube, Menu, X } from 'lucide-react';
import { supabase } from '../services/supabase';

// Premium Components
import { LoadingScreen, PageTransition } from '../components/premium';

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
    ? "border-white/50 text-white hover:bg-white/20" 
    : "border-neutral-400 text-neutral-800 hover:bg-white hover:border-transparent";
  
  return (
    <button onClick={toggleLanguage} className={`${baseClasses} ${variantClasses}`} aria-label="Switch language">
      <Globe className="w-3.5 h-3.5" />
      <span>{currentLang === 'en' ? 'עברית' : 'English'}</span>
    </button>
  );
};

// Order types — anchor to #services
const ORDER_TYPES = [
  { label: 'Catalog Order',  labelHe: 'הזמנה מקטלוג' },
  { label: 'Project Order',  labelHe: 'הזמנת פרויקט'  },
  { label: 'Custom Order',   labelHe: 'הזמנה מותאמת'  },
];

// Header Component
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const handleOrderTypeClick = () => {
    if (location.pathname === '/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#services');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="flex flex-col w-full bg-[#EAEAEA] relative z-20 shadow-sm font-sans">

      {/* ── ROW 1: Brand bar ── */}
      <div className="w-full px-4 md:px-12 py-3 flex items-center justify-between border-b border-neutral-200/80">

        {/* HWOOD logo */}
        <div className="cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <img
            src="/logo.png"
            alt="HWOOD"
            className="h-10 md:h-12 w-auto object-contain"
            style={{ maxWidth: '160px', minWidth: '90px' }}
          />
        </div>

        {/* Right: Skylum + Language + Mobile toggle */}
        <div className="flex items-center gap-4 md:gap-5">

          {/* Skylum partner brand — desktop only */}
          <a
            href="https://skylum.co.il"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex flex-col items-end group"
            title="Skylum — Building Cladding & Facades"
          >
            <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-widest leading-none mb-1">
              Part of Skylum Group
            </span>
            <img
              src="https://skylum.co.il/wp-content/uploads/2023/08/IMG_0812.png"
              alt="Skylum"
              className="h-6 w-auto object-contain opacity-50 group-hover:opacity-90 transition-opacity duration-300"
              style={{ maxWidth: '80px' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </a>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-neutral-300" />

          <LanguageSwitcher variant="dark" />

          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── ROW 2: Navigation bar — desktop only ── */}
      <nav className="hidden lg:flex w-full px-12 items-center justify-between bg-[#EAEAEA]">

        {/* Left: Order types */}
        <div className="flex items-center">
          {ORDER_TYPES.map((type, idx) => (
            <button
              key={idx}
              onClick={handleOrderTypeClick}
              className="px-5 py-4 text-meta-sm font-medium text-brand hover:text-white hover:bg-brand transition-all duration-200 tracking-wide uppercase border-r border-neutral-200 first:border-l"
            >
              {lang === 'he' ? type.labelHe : type.label}
            </button>
          ))}
        </div>

        {/* Right: Secondary nav */}
        <div className="flex items-center text-meta-sm font-medium text-neutral-700 tracking-wide uppercase">
          <Link to="/portfolio" className="px-4 py-4 hover:text-brand transition-colors">Portfolio</Link>
          <Link to="/about"     className="px-4 py-4 hover:text-brand transition-colors">About</Link>
          <Link to="/contact"   className="px-4 py-4 hover:text-brand transition-colors">Contact</Link>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 shadow-lg absolute top-full left-0 right-0 z-50">
          <div className="px-4 py-4 space-y-1">
            <p className="px-4 pt-2 pb-1 text-[10px] font-medium text-neutral-400 uppercase tracking-widest">How to order</p>
            {ORDER_TYPES.map((type, idx) => (
              <button
                key={idx}
                onClick={handleOrderTypeClick}
                className="w-full text-left px-4 py-3 text-base font-medium text-brand hover:bg-teal-50 rounded-lg"
              >
                {lang === 'he' ? type.labelHe : type.label}
              </button>
            ))}
            <div className="border-t border-neutral-100 pt-3 mt-3 space-y-1">
              <Link to="/portfolio" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
              <Link to="/about"     className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/contact"   className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
            {/* Skylum — mobile */}
            <div className="border-t border-neutral-100 pt-3 mt-1">
              <a
                href="https://skylum.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sky-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src="https://skylum.co.il/wp-content/uploads/2023/08/IMG_0812.png"
                  alt="Skylum"
                  className="h-5 w-auto object-contain opacity-70"
                />
                <span className="text-meta-sm text-neutral-500 font-medium">Building Cladding & Facades ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHe = i18n.language?.startsWith('he');
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  
  useEffect(() => {
    supabase.from('social_links').select('*').eq('is_visible', true).order('sort_order')
      .then(({ data }) => {
        if (data) setSocialLinks(data.filter((l: any) => l.url).map((l: any) => ({ platform: l.platform, url: l.url })));
      });
  }, []);

  const platformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
      default: return null;
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="w-full px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 pt-12 md:pt-16 pb-8 text-white relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="HWOOD Logo" className="h-10 w-auto brightness-0 invert object-contain" style={{ maxWidth: '140px' }} />
        </div>

        <div className="flex gap-4">
          {socialLinks.length > 0 ? (
            socialLinks.map((link) => {
              const Icon = platformIcon(link.platform);
              if (!Icon) return null;
              return (
                <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              );
            })
          ) : (
            [Facebook, Instagram, Linkedin, Youtube].map((Icon, idx) => (
              <a key={idx} href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-20 xl:gap-24 mb-10 md:mb-16">
        <div>
          <h3 className="text-body-lg font-medium mb-4">{isHe ? 'עדכונים' : 'Updates'}</h3>
          <div className="w-full h-px bg-neutral-600 mb-6" />
          <p className="mb-8 text-meta text-neutral-400 leading-relaxed max-w-md">{isHe ? 'עדכונים טכניים, תובנות ייצור ושינויים במערכת.' : 'Technical updates, production insights, and system changes.'}</p>
          <button onClick={() => navigate('/contact')} className="bg-white text-neutral-900 px-8 py-3 rounded font-medium hover:bg-neutral-200 transition-colors">{isHe ? 'הרשמה' : 'Subscribe'}</button>
        </div>

        <div>
          <h3 className="text-body-lg font-medium mb-4">{isHe ? 'תמיכה טכנית' : 'Technical Support'}</h3>
          <div className="w-full h-px bg-brand mb-6" />
          <p className="mb-8 text-meta text-neutral-400 leading-relaxed max-w-md">{isHe ? 'תמיכה לאחר אספקה עבור מערכות ייצור, רכיבים ותהליכי CNC.' : 'Post-delivery support for production systems, components, and CNC workflows.'}</p>
          <button onClick={() => navigate('/contact')} className="bg-brand text-white px-8 py-3 rounded font-medium hover:bg-teal-600 transition-colors">{isHe ? 'בקשת תמיכה' : 'Request Support'}</button>
        </div>
      </div>

      {/* Back to Top Button - larger, above copyright */}
      <div className="flex justify-center mb-8">
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white/70 hover:bg-white hover:text-neutral-900 transition-all group"
          aria-label="Back to top"
        >
          <ChevronDown className="w-5 h-5 rotate-180 group-hover:animate-bounce" />
          <span className="text-sm font-medium">{isHe ? 'חזרה למעלה' : 'Back to top'}</span>
        </button>
      </div>

      <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-meta-sm text-neutral-500">
        <p>© HWOOD | Netanya, Israel | {t('footer.rights')}</p>
        <div className="flex flex-wrap gap-6">
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

// Footer Wrapper - simplified to blend with dark sections
const FooterWrapper: React.FC = () => (
  <div className="relative w-full bg-[#002828] overflow-hidden">
    <Footer />
  </div>
);

// WhatsApp Button
const WhatsAppButton: React.FC = () => {
  // You can make this dynamic by loading from company_info table
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
      {/* Loading Screen - shows on first visit only */}
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
      </div>
    </>
  );
};
