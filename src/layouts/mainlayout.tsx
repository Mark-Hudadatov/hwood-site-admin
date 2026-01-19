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
import { MapPin, Search, User, ChevronDown, Globe, Facebook, Instagram, Linkedin, Youtube, Menu, X } from 'lucide-react';
import { Service, Subservice } from '../domain/types';
import { getNavigationData } from '../services/data/dataService';

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
  
  const baseClasses = "flex items-center gap-1.5 border rounded-full px-3 py-1.5 transition-all font-bold text-[11px]";
  const variantClasses = variant === 'light' 
    ? "border-white/50 text-white hover:bg-white/20" 
    : "border-gray-400 text-gray-800 hover:bg-white hover:border-transparent";
  
  return (
    <button onClick={toggleLanguage} className={`${baseClasses} ${variantClasses}`} aria-label="Switch language">
      <Globe className="w-3.5 h-3.5" />
      <span>{currentLang === 'en' ? 'עברית' : 'English'}</span>
    </button>
  );
};

// Header Component
const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [navData, setNavData] = useState<{ services: (Service & { subservices: Subservice[] })[] }>({ services: [] });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getNavigationData().then(setNavData);
  }, []);

  const handleServiceClick = (slug: string) => {
    navigate(`/services/${slug}`);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleSubserviceClick = (slug: string) => {
    navigate(`/subservices/${slug}`);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="flex flex-col w-full bg-[#EAEAEA] relative z-20 shadow-sm font-sans">
      {/* Top Utility Bar - Desktop only */}
      <div className="hidden md:flex justify-end items-center px-8 md:px-12 py-2 gap-6 text-[11px] font-bold text-gray-800 tracking-wide">
        <Link to="/about" className="hover:text-teal-700 transition-colors">{t('nav.company')}</Link>
        <Link to="/portfolio" className="hover:text-teal-700 transition-colors">News</Link>
        <Link to="/contact" className="hover:text-teal-700 transition-colors">{t('contact')}</Link>
      </div>

      {/* Main Navbar */}
      <nav className="w-full h-16 md:h-20 px-4 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="HWOOD Logo" className="h-10 md:h-12 w-auto object-contain" style={{ maxWidth: '160px', minWidth: '100px' }} />
        </div>

        {/* Center Links - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {navData.services.map((service) => (
            <div key={service.id} className="relative" onMouseEnter={() => setActiveDropdown(service.id)} onMouseLeave={() => setActiveDropdown(null)}>
              <button onClick={() => handleServiceClick(service.slug)} className="flex items-center gap-1 px-4 py-2 text-base font-semibold text-black hover:text-teal-700 transition-colors rounded-lg hover:bg-white/50">
                {service.title}
                {service.subservices && service.subservices.length > 0 && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === service.id ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {/* Dropdown */}
              {activeDropdown === service.id && service.subservices && service.subservices.length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[280px] z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{service.title}</span>
                  </div>
                  {service.subservices.map((sub) => (
                    <button key={sub.id} onClick={() => handleSubserviceClick(sub.slug)} className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">{sub.title}</span>
                      {sub.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{sub.description}</p>}
                    </button>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-100 mt-1">
                    <button onClick={() => handleServiceClick(service.slug)} className="text-sm font-semibold text-[#005f5f] hover:underline">
                      {t('viewAll')} {service.title} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Link to="/contact" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-100 transition-colors shadow-sm">
              <MapPin className="w-5 h-5" />
            </Link>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-100 transition-colors shadow-sm">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/login" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-100 transition-colors shadow-sm">
              <User className="w-5 h-5" />
            </Link>
          </div>
          
          <LanguageSwitcher variant="dark" />

          <button className="lg:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg absolute top-full left-0 right-0 z-50">
          <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
            {navData.services.map((service) => (
              <div key={service.id}>
                <button onClick={() => handleServiceClick(service.slug)} className="w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg">
                  {service.title}
                </button>
                {service.subservices && service.subservices.length > 0 && (
                  <div className="pl-4">
                    {service.subservices.map((sub) => (
                      <button key={sub.id} onClick={() => handleSubserviceClick(sub.slug)} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                        {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
              <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/portfolio" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>News</Link>
              <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full px-8 md:px-12 lg:px-16 pt-16 pb-8 text-white relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="HWOOD Logo" className="h-10 w-auto brightness-0 invert object-contain" style={{ maxWidth: '140px' }} />
        </div>

        <div className="flex gap-4">
          {[Facebook, Instagram, Linkedin, Youtube].map((Icon, idx) => (
            <a key={idx} href="#" className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24">
        <div>
          <h3 className="text-lg font-bold mb-4">Stay up to date</h3>
          <div className="w-full h-px bg-gray-600 mb-6" />
          <p className="mb-8 text-sm text-gray-300 leading-relaxed max-w-md">Subscribe to our newsletter and stay up to date with news from the world of HWOOD.</p>
          <button className="bg-white text-[#002828] px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors">Subscribe</button>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Need help?</h3>
          <div className="w-full h-px bg-[#005f5f] mb-6" />
          <p className="mb-8 text-sm text-gray-300 leading-relaxed max-w-md">We provide after-sales service supporting the reliability and quality of our services.</p>
          <button className="bg-[#005f5f] text-white px-8 py-3 rounded font-bold hover:bg-[#004d4d] transition-colors">Request support</button>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between gap-4 text-[11px] text-gray-400 tracking-wide">
        <p>Copyright HWOOD | Israel, Netanya | {t('footer.rights')}</p>
        <div className="flex flex-wrap gap-6">
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-white transition-colors">Privacy and cookie policy</a>
          <a href="#" className="hover:text-white transition-colors">List of cookies</a>
        </div>
      </div>
    </footer>
  );
};

// Footer Wrapper
const FooterWrapper: React.FC = () => (
  <div className="relative w-full bg-[#002828] overflow-hidden pt-16">
    <div className="absolute inset-0 w-[140%] -left-[10%] h-full z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#001f1f]" />
      <div className="absolute -left-40 -top-40 h-[200%] w-80 bg-[#004D4D] -skew-x-[20deg]" />
      <div className="absolute left-0 -top-40 h-[200%] w-64 bg-[#005f5f] -skew-x-[20deg] opacity-70" />
      <div className="absolute left-56 -top-40 h-[200%] w-40 bg-[#003f3f] -skew-x-[20deg] opacity-50" />
      <div className="absolute left-96 -top-40 h-[200%] w-32 bg-[#004D4D] -skew-x-[20deg] opacity-30" />
    </div>
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
      
      <div className="w-full min-h-screen font-sans flex flex-col">
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
