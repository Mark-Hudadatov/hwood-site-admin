/**
 * SUBSERVICE PAGE - FIXED
 * =======================
 * FIXES:
 * ✅ Category tabs with LEFT/RIGHT navigation arrows
 * ✅ Product images with fallback placeholders
 * ✅ Horizontal scroll for categories
 * ✅ Better loading states
 * v2.0: Multi-order-type routing
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Upload, MessageSquare, FileText } from 'lucide-react';
import { Service, Subservice, ProductCategory, Product } from '../domain/types';
import { getSubservicePageData } from '../services/data/dataService';
import { ROUTES } from '../router';
import { ScrollReveal, StaggerReveal } from '../components/premium';

// Fallback image for products - dark background with small wood plank icon
const PRODUCT_FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none"><rect width="600" height="600" fill="#1a1a1a"/><g transform="translate(260, 260)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.4"><rect x="0" y="5" width="80" height="12" rx="2"/><rect x="0" y="22" width="80" height="12" rx="2"/><rect x="0" y="39" width="80" height="12" rx="2"/><rect x="0" y="56" width="80" height="12" rx="2"/><line x1="20" y1="5" x2="20" y2="68" stroke-width="1" opacity="0.3"/><line x1="40" y1="5" x2="40" y2="68" stroke-width="1" opacity="0.3"/><line x1="60" y1="5" x2="60" y2="68" stroke-width="1" opacity="0.3"/></g></svg>`)}`;

// =============================================================================
// PRODUCT CARD COMPONENT
// =============================================================================

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageSrc = imgError || !product.imageUrl ? PRODUCT_FALLBACK : product.imageUrl;

  return (
    <div
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Image */}
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
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
        />
      </div>

      {/* Content */}
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

// =============================================================================
// CATEGORY TABS WITH NAVIGATION ARROWS
// =============================================================================

interface CategoryTabsProps {
  categories: ProductCategory[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeTab, setActiveTab }) => {
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
  }, []);

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
  }, [categories, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'right' ? 300 : -300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
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
        className="flex flex-row gap-3 md:gap-4 overflow-x-auto no-scrollbar items-end -mb-px scroll-smooth px-12 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => { if (!hasDragged) setActiveTab(category.id); }}
            className={`
              group text-left px-5 md:px-8 py-4 md:py-6 rounded-t-2xl min-w-[180px] md:min-w-[260px] flex-shrink-0 transition-all duration-200 relative
              ${activeTab === category.id
                ? 'bg-[#F9FAFB] shadow-lg text-black z-10'
                : 'bg-white/10 hover:bg-white/20 text-white z-0'
              }
            `}
          >
            <h3 className={`text-base md:text-xl font-medium mb-1 ${activeTab === category.id ? 'text-black' : 'text-white'}`}>
              {category.title}
            </h3>
            <p className={`text-xs md:text-sm leading-snug line-clamp-2 ${activeTab === category.id ? 'text-neutral-600' : 'text-white/70'}`}>
              {category.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white">
    <div className="w-full bg-amber-500 h-[350px] animate-pulse" />
    <div className="px-4 md:px-16 py-12 bg-neutral-50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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

// =============================================================================
// NOT FOUND STATE
// =============================================================================

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

// =============================================================================
// HERO SECTION (shared by all order types)
// =============================================================================

interface HeroProps {
  service: Service;
  subservice: Subservice;
}

const HeroSection: React.FC<HeroProps> = ({ service, subservice }) => {
  const accentColor = service.accentColor || '#D48F28';
  return (
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
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

// =============================================================================
// SEND FILE & PROCESS CONTENT
// =============================================================================

interface SendFileContentProps {
  service: Service;
}

const SendFileContent: React.FC<SendFileContentProps> = ({ service }) => {
  const quoteUrl = `/quote?service=${service.slug}`;
  const cards = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Describe the Job',
      desc: 'Tell us about the operation — material type, dimensions, quantity. Text or file, no drawing required.',
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Or Upload a File',
      desc: 'We accept DXF, Excel, PDF. Our team will review and prepare a quote based on your file.',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "We'll Contact You",
      desc: 'We confirm details and send an accurate quote within 1–2 business days.',
    },
  ];

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-[500px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">{card.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={quoteUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors">
            <Upload className="w-5 h-5" />
            Send File / Describe Job
          </Link>
          <Link to={ROUTES.CONTACT}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-brand text-brand rounded-xl font-medium hover:bg-brand/5 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DESCRIBE & REQUEST CONTENT
// =============================================================================

interface DescribeRequestContentProps {
  service: Service;
}

const DescribeRequestContent: React.FC<DescribeRequestContentProps> = ({ service }) => {
  const quoteUrl = `/quote?service=${service.slug}`;
  const steps = [
    {
      num: '01',
      title: 'Describe the Project',
      desc: 'Tell us the object type, preferred material, and approximate scope or volume.',
    },
    {
      num: '02',
      title: 'Share References',
      desc: 'Optionally attach photos, hand sketches, or technical drawings to help us understand your vision.',
    },
    {
      num: '03',
      title: "We'll Get Back to You",
      desc: 'Our team reviews your request and responds within 1–2 business days with a proposal.',
    },
  ];

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-[500px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-8">How to Order</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-brand/20 mb-3">{step.num}</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={quoteUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Describe My Project
          </Link>
          <Link to={ROUTES.CONTACT}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-brand text-brand rounded-xl font-medium hover:bg-brand/5 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// INFORMATIONAL CONTENT
// =============================================================================

interface InformationalContentProps {
  subservice: Subservice;
}

const InformationalContent: React.FC<InformationalContentProps> = ({ subservice }) => (
  <div className="flex-1 bg-[#F9FAFB] min-h-[500px]">
    <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16">
      <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl">{subservice.description}</p>
    </div>
  </div>
);

// =============================================================================
// MAIN SUBSERVICE PAGE COMPONENT
// =============================================================================

export const SubservicePage: React.FC = () => {
  const { subserviceSlug } = useParams<{ subserviceSlug: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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

        if (data.categories.length > 0) {
          setActiveTab(data.categories[0].id);
        }
      }

      setIsLoading(false);
    };

    loadData();
    window.scrollTo(0, 0);
  }, [subserviceSlug]);

  const handleProductClick = (product: Product) => {
    navigate(ROUTES.PRODUCT(product.slug));
  };

  const filteredProducts = products.filter(p => p.categoryId === activeTab);

  if (isLoading) return <LoadingSkeleton />;
  if (!subservice || !service) return <NotFound />;

  const orderType = service.orderType || 'browse-and-order';
  const accentColor = service.accentColor || '#D48F28';

  // send-file-and-process
  if (orderType === 'send-file-and-process') {
    return (
      <div className="w-full flex flex-col bg-white">
        <HeroSection service={service} subservice={subservice} />
        <SendFileContent service={service} />
      </div>
    );
  }

  // describe-and-request
  if (orderType === 'describe-and-request') {
    return (
      <div className="w-full flex flex-col bg-white">
        <HeroSection service={service} subservice={subservice} />
        <DescribeRequestContent service={service} />
      </div>
    );
  }

  // informational
  if (orderType === 'informational') {
    return (
      <div className="w-full flex flex-col bg-white">
        <HeroSection service={service} subservice={subservice} />
        <InformationalContent subservice={subservice} />
      </div>
    );
  }

  // browse-and-order (default) — existing layout unchanged
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
            </div>
          </ScrollReveal>

          {/* Category Tabs with Navigation Arrows */}
          <CategoryTabs
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#F9FAFB] min-h-[600px]">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-8 md:py-12">

          {/* Products Grid */}
          <StaggerReveal
            animation="fade-up"
            staggerDelay={80}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
            ))}
          </StaggerReveal>

          {/* Empty state */}
          {filteredProducts.length === 0 && categories.length > 0 && (
            <div className="text-center py-20 text-neutral-500">
              <p className="text-lg mb-2">No products found in this category.</p>
              <p className="text-sm">Products will appear here once added via Admin Panel.</p>
            </div>
          )}

          {/* No categories state */}
          {categories.length === 0 && (
            <div className="text-center py-20 text-neutral-500">
              <p className="text-lg">No product categories available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
