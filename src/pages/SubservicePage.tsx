/**
 * SUBSERVICE PAGE — order_type aware
 * ====================================
 * v2.1 — April 2026
 *
 * browse-and-order      → CategoryTabs + ProductGrid (existing)
 * send-file-and-process → Operation cards + CTA to SendFile form
 * describe-and-request  → Info cards + CTA to Describe form
 * informational         → Info only, no CTA
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChevronLeft, ChevronRight, ArrowRight, Upload, MessageSquare, FileText } from 'lucide-react';
import { Service, Subservice, ProductCategory, Product } from '../domain/types';
import { getSubservicePageData } from '../services/data/dataService';
import { ROUTES } from '../router';
import { ScrollReveal, StaggerReveal } from '../components/premium';

const PRODUCT_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none"><rect width="600" height="600" fill="#1a1a1a"/><g transform="translate(260, 260)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.4"><rect x="0" y="5" width="80" height="12" rx="2"/><rect x="0" y="22" width="80" height="12" rx="2"/><rect x="0" y="39" width="80" height="12" rx="2"/></g></svg>`
)}`;

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('i18nextLng')?.startsWith('he') ? 'he' : 'en';
};

// ============================================================================
// PRODUCT CARD (browse-and-order only)
// ============================================================================

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageSrc = imgError || !product.imageUrl ? PRODUCT_FALLBACK : product.imageUrl;

  return (
    <div
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-full aspect-square bg-neutral-100 overflow-hidden relative">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-brand rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageSrc}
          alt={product.title}
          className={`w-full h-full object-cover p-4 transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-medium text-[#1A1A1A] mb-1 group-hover:text-brand transition-colors">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-sm text-neutral-500">{product.subtitle}</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORY TABS (browse-and-order only)
// ============================================================================

const CategoryTabs: React.FC<{
  categories: ProductCategory[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}> = ({ categories, activeTab, setActiveTab }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith('he') || document.documentElement.dir === 'rtl';

  // Drag scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const hasOverflow = scrollWidth > clientWidth + 10;
      // Always show both arrows if there's overflow - RTL scroll detection is unreliable
      setShowLeftArrow(hasOverflow);
      setShowRightArrow(hasOverflow);
    }
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(true);
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith('he');

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX]         = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged]  = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const has = scrollWidth > clientWidth + 10;
    setShowLeft(has);
    setShowRight(has);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories, checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    scrollRef.current.scrollLeft = scrollStart - dx;
    if (Math.abs(dx) > 5) setHasDragged(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.touches[0].pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.touches[0].pageX - startX;
    scrollRef.current.scrollLeft = scrollStart - dx;
    if (Math.abs(dx) > 5) setHasDragged(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (categories.length === 0) return null;

  // In RTL: left-side arrow scrolls left (shows next), right-side arrow scrolls right (shows previous)
  // In LTR: left-side arrow scrolls left (shows previous), right-side arrow scrolls right (shows next)
  const LeftSideIcon = isRTL ? ChevronRight : ChevronLeft;
  const RightSideIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="relative">
      {/* Left-side Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
        >
          <LeftSideIcon className="w-6 h-6 text-neutral-700" />
        </button>
      )}

      {/* Right-side Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
        >
          <RightSideIcon className="w-6 h-6 text-neutral-700" />
        </button>
      )}

      {/* Tabs Container with drag scroll */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      {showLeft && (
        <button onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all">
          {isRTL ? <ChevronRight className="w-6 h-6 text-neutral-700" /> : <ChevronLeft className="w-6 h-6 text-neutral-700" />}
        </button>
      )}
      {showRight && (
        <button onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all">
          {isRTL ? <ChevronLeft className="w-6 h-6 text-neutral-700" /> : <ChevronRight className="w-6 h-6 text-neutral-700" />}
        </button>
      )}
      <div
        ref={scrollRef}
        onMouseDown={(e) => { setIsDragging(true); setHasDragged(false); setStartX(e.pageX); setScrollStart(scrollRef.current?.scrollLeft || 0); }}
        onMouseMove={(e) => { if (!isDragging || !scrollRef.current) return; e.preventDefault(); const dx = e.pageX - startX; scrollRef.current.scrollLeft = scrollStart - dx; if (Math.abs(dx) > 5) setHasDragged(true); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="flex flex-row gap-3 md:gap-4 overflow-x-auto no-scrollbar items-end -mb-px scroll-smooth px-12 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={category.id}
            onClick={() => { if (!hasDragged) setActiveTab(category.id); }}
            className={`
              group text-left px-5 md:px-8 py-4 md:py-6 rounded-t-2xl min-w-[180px] md:min-w-[260px] flex-shrink-0 transition-all duration-200 relative
              ${activeTab === category.id 
                ? 'bg-[#F9FAFB] shadow-lg text-black z-10' 
            key={cat.id}
            onClick={() => { if (!hasDragged) setActiveTab(cat.id); }}
            className={`group text-left px-5 md:px-8 py-4 md:py-6 rounded-t-2xl min-w-[180px] md:min-w-[260px] flex-shrink-0 transition-all duration-200 relative ${
              activeTab === cat.id
                ? 'bg-[#F9FAFB] shadow-lg text-black z-10'
                : 'bg-white/10 hover:bg-white/20 text-white z-0'
            }`}
          >
            <h3 className={`text-base md:text-xl font-medium mb-1 ${activeTab === cat.id ? 'text-black' : 'text-white'}`}>
              {cat.title}
            </h3>
            <p className={`text-xs md:text-sm leading-snug line-clamp-2 ${activeTab === cat.id ? 'text-neutral-600' : 'text-white/70'}`}>
              {cat.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SEND FILE CONTENT (send-file-and-process)
// ============================================================================

const SendFileContent: React.FC<{
  service: Service;
  subservice: Subservice;
}> = ({ service, subservice }) => {
  const lang = getCurrentLang();
  const navigate = useNavigate();

  const quoteUrl = `/quote?service=${service.slug}&subservice=${subservice.slug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16">
      {/* Description */}
      <div className="mb-12">
        <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl">
          {subservice.description}
        </p>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: FileText,
            title: lang === 'he' ? 'תאר את העבודה' : 'Describe the Job',
            body: lang === 'he'
              ? 'חומר, עובי, כמות, פעולה נדרשת. תיאור מילולי מספיק — קובץ לא חובה.'
              : 'Material, thickness, quantity, operation needed. A text description is enough — no file required.',
          },
          {
            icon: Upload,
            title: lang === 'he' ? 'או העלה קובץ' : 'Or Upload a File',
            body: lang === 'he'
              ? 'DXF, Excel עם רשימת חלקים, PDF. קבלנו כל פורמט סטנדרטי.'
              : 'DXF, Excel with parts list, PDF. We accept any standard format.',
          },
          {
            icon: MessageSquare,
            title: lang === 'he' ? 'נחזור אליך' : 'We\'ll Contact You',
            body: lang === 'he'
              ? 'נאשר פרטים, נשלח הצעת מחיר ונתאם מועד אספקה.'
              : 'We confirm details, send a quote and agree on delivery timing.',
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(quoteUrl)}
          className="inline-flex items-center justify-center gap-3 bg-white text-brand px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
        >
          <Upload className="w-5 h-5" />
          {lang === 'he' ? 'שלח בקשת עבודה' : 'Send Job Request'}
        </button>
        <p className="text-white/50 text-sm flex items-center">
          {lang === 'he' ? 'קובץ הוא אופציה — תיאור מספיק' : 'File is optional — description is enough'}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// DESCRIBE & REQUEST CONTENT
// ============================================================================

const DescribeRequestContent: React.FC<{
  service: Service;
  subservice: Subservice;
}> = ({ service, subservice }) => {
  const lang = getCurrentLang();
  const navigate = useNavigate();

  const quoteUrl = `/quote?service=${service.slug}`;

  // Informational "product" cards if subservice has products — render as info, not clickable
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16">
      {/* Description */}
      <div className="mb-12">
        <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl">
          {subservice.description}
        </p>
      </div>

      {/* What we need */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            step: '01',
            title: lang === 'he' ? 'תאר את הפרויקט' : 'Describe the Project',
            body: lang === 'he'
              ? 'סוג האובייקט, חומר מועדף, היקף משוער. שלב ראשוני — אין צורך בשרטוטים.'
              : 'Object type, preferred material, approximate scope. Early stage — no drawings needed.',
          },
          {
            step: '02',
            title: lang === 'he' ? 'שתף רפרנסים' : 'Share References',
            body: lang === 'he'
              ? 'אם יש לך תמונות, שרטוטים או קבצים — צרף. זה מאיץ את התהליך.'
              : 'If you have photos, drawings or files — attach them. It speeds things up.',
          },
          {
            step: '03',
            title: lang === 'he' ? 'נחזור אליך' : 'We\'ll Get Back to You',
            body: lang === 'he'
              ? 'נסקור את הבריף וניצור קשר תוך 1-2 ימי עסקים לדיון מפורט.'
              : 'We review the brief and contact you within 1-2 business days for a detailed discussion.',
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white/20 mb-4">{step}</div>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <button
          onClick={() => navigate(quoteUrl)}
          className="inline-flex items-center justify-center gap-3 bg-white text-brand px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          {lang === 'he' ? 'תאר את הפרויקט' : 'Describe Your Project'}
        </button>
        <button
          onClick={() => navigate(ROUTES.CONTACT)}
          className="inline-flex items-center justify-center gap-3 border border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
        >
          {lang === 'he' ? 'צור קשר ישיר' : 'Contact Directly'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// LOADING & NOT FOUND
// ============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white">
    <div className="w-full bg-amber-500 h-[350px] animate-pulse" />
    <div className="px-4 md:px-16 py-12 bg-neutral-50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-neutral-200" />
            <div className="p-5">
              <div className="h-5 w-3/4 bg-neutral-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-neutral-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-medium text-neutral-900 mb-4">Subservice Not Found</h1>
      <p className="text-neutral-600 mb-8">The subservice you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
        Back to Home
      </Link>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SubservicePage: React.FC = () => {
  const { subserviceSlug } = useParams<{ subserviceSlug: string }>();
  const navigate = useNavigate();

  const [service, setService]       = useState<Service | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [activeTab, setActiveTab]   = useState<string>('');
  const [isLoading, setIsLoading]   = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!subserviceSlug) return;
      setIsLoading(true);
      const data = await getSubservicePageData(subserviceSlug);
      if (data) {
        setService(data.service);
        setSubservice(data.subservice);
        setCategories(data.categories);
        setProducts(data.products);
        if (data.categories.length > 0) setActiveTab(data.categories[0].id);
      }
      setIsLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [subserviceSlug]);

  const handleProductClick = (product: Product) => {
    navigate(ROUTES.PRODUCT(product.slug));
  };

  const filteredProducts = products.filter((p) => p.categoryId === activeTab);

  if (isLoading) return <LoadingSkeleton />;
  if (!subservice || !service) return <NotFound />;

  const accentColor = service.accentColor || '#D48F28';
  const orderType   = service.orderType || 'browse-and-order';

  // ── Hero section (shared for all order types) ──────────────
  const heroSection = (
    <div className="w-full pt-6 flex flex-col" style={{ backgroundColor: accentColor }}>
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">

        {/* Breadcrumb */}
        <div className="text-white text-[10px] md:text-xs font-medium tracking-wide uppercase mb-4 flex items-center gap-2 pl-2 flex-wrap">
          <Link to="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <Link to={ROUTES.SERVICE(service.slug)} className="hover:opacity-80">{service.title}</Link>
          <span>/</span>
          <span>{subservice.title}</span>
        </div>

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Top Section with Accent Background */}
      <div className="w-full pt-6 flex flex-col" style={{ backgroundColor: accentColor }}>
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">
          
          {/* Breadcrumbs */}
          <div className="text-white text-[10px] md:text-xs font-medium tracking-wide uppercase mb-4 flex items-center gap-2 pl-2 flex-wrap">
            <Link to="/" className="cursor-pointer hover:opacity-80">Home</Link>
            <span>/</span>
            <span>Services</span>
            <span>/</span>
            <Link to={ROUTES.SERVICE(service.slug)} className="cursor-pointer hover:opacity-80">{service.title}</Link>
            <span>/</span>
            <span>{subservice.title}</span>
          </div>

          {/* Dark Hero Card */}
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="w-full relative rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-black text-white h-[160px] md:h-[220px] shadow-xl mb-8">
              <div className="absolute inset-0">
                <img 
                  src={subservice.heroImageUrl || subservice.imageUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop'}
                  alt={subservice.title}
                  className="w-full h-full object-cover object-center opacity-50"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-4xl">
                <h1 className="text-2xl md:text-5xl font-normal tracking-tight mb-2">{subservice.title}</h1>
                <p className="text-neutral-300 text-sm md:text-lg font-light leading-relaxed max-w-2xl line-clamp-2">{subservice.description}</p>
              </div>
        {/* Hero card */}
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="w-full relative rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-black text-white h-[160px] md:h-[220px] shadow-xl mb-8">
            <div className="absolute inset-0">
              <img
                src={subservice.heroImageUrl || subservice.imageUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop'}
                alt={subservice.title}
                className="w-full h-full object-cover object-center opacity-50"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-4xl">
              <h1 className="text-2xl md:text-5xl font-normal tracking-tight mb-2">{subservice.title}</h1>
              <p className="text-neutral-300 text-sm md:text-lg font-light leading-relaxed max-w-2xl line-clamp-2">
                {subservice.description}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Category tabs — only for browse-and-order */}
        {orderType === 'browse-and-order' && categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );

  // ── browse-and-order ────────────────────────────────────────
  if (orderType === 'browse-and-order') {
    return (
      <div className="w-full flex flex-col bg-white">
        {heroSection}
        <div className="flex-1 bg-[#F9FAFB] min-h-[600px]">
          <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-8 md:py-12">
            <StaggerReveal
              animation="fade-up"
              staggerDelay={80}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </StaggerReveal>

            {filteredProducts.length === 0 && categories.length > 0 && (
              <div className="text-center py-20 text-neutral-500">
                <p className="text-lg mb-2">No products in this category yet.</p>
              </div>
            )}
            {categories.length === 0 && (
              <div className="text-center py-20 text-neutral-500">
                <p className="text-lg">No product categories available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── send-file-and-process ───────────────────────────────────
  if (orderType === 'send-file-and-process') {
    return (
      <div className="w-full flex flex-col bg-white">
        {heroSection}
        <div className="flex-1" style={{ backgroundColor: accentColor }}>
          <SendFileContent service={service} subservice={subservice} />
        </div>
      </div>
    );
  }

  // ── describe-and-request ────────────────────────────────────
  if (orderType === 'describe-and-request') {
    return (
      <div className="w-full flex flex-col bg-white">
        {heroSection}
        <div className="flex-1" style={{ backgroundColor: accentColor }}>
          <DescribeRequestContent service={service} subservice={subservice} />
        </div>
      </div>
    );
  }

  // ── informational ───────────────────────────────────────────
  return (
    <div className="w-full flex flex-col bg-white">
      {heroSection}
      <div className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 md:px-12 lg:px-16 py-12">
          <p className="text-lg text-neutral-600 leading-relaxed">{subservice.description}</p>
        </div>
      </div>
    </div>
  );
};
