/**
 * SERVICE PAGE - FIXED
 * ====================
 * ✅ Horizontal scroll navigation with left/right arrows
 * ✅ Subservices in a scrollable horizontal row
 * ✅ Coming soon overlay support
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Service, Subservice } from '../domain/types';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop';

// =============================================================================
// SUBSERVICE CARD
// =============================================================================

interface SubserviceCardProps {
  subservice: Subservice & { visibilityStatus?: string };
  onClick: () => void;
}

const SubserviceCard: React.FC<SubserviceCardProps> = ({ subservice, onClick }) => {
  const isComingSoon = subservice.visibilityStatus === 'coming_soon';
  const [imgSrc, setImgSrc] = useState(subservice.imageUrl || FALLBACK_IMAGE);

  return (
    <div 
      className={`relative w-[280px] md:w-[300px] flex-shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-lg ${
        isComingSoon ? '' : 'group cursor-pointer'
      }`}
      onClick={isComingSoon ? undefined : onClick}
    >
      {/* Background Image */}
      <img
        src={imgSrc}
        alt={subservice.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
          isComingSoon ? 'grayscale brightness-50' : 'group-hover:scale-105'
        }`}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />
      
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
          <Clock className="w-10 h-10 text-white mb-3" />
          <span className="text-white text-body-lg font-medium uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isComingSoon 
          ? 'bg-black/20' 
          : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-brand/80 group-hover:via-brand/40'
      }`} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className={`text-white text-h2 mb-2 transition-transform duration-300 ${
          isComingSoon ? '' : 'group-hover:-translate-y-1'
        }`}>
          {subservice.title}
        </h3>
        <p className="text-white/80 text-meta leading-relaxed line-clamp-2">
          {subservice.description}
        </p>
        
        {!isComingSoon && (
          <div className="flex items-center gap-2 mt-3 text-white/70 text-meta opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>View Products</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Bottom accent line on hover */}
      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/80 transition-all duration-300 w-0 group-hover:w-full" />
      )}
    </div>
  );
};

// =============================================================================
// HORIZONTAL SCROLL WITH ARROWS
// =============================================================================

interface HorizontalScrollProps {
  children: React.ReactNode;
  title: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

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
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'right' ? 340 : -340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Header with Navigation Arrows */}
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-neutral-900 text-h1 font-medium tracking-tight">
          {title}
        </h2>
        
        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              showLeftArrow 
                ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer' 
                : 'border-neutral-300 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              showRightArrow 
                ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer' 
                : 'border-neutral-300 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
        {/* End spacer */}
        <div className="w-4 flex-shrink-0" />
      </div>
    </div>
  );
};

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="w-full bg-neutral-200 h-[300px]" />
    <div className="px-16 py-12">
      <div className="h-10 w-64 bg-neutral-200 rounded mb-8" />
      <div className="flex gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-[300px] flex-shrink-0">
            <div className="aspect-[3/4] bg-neutral-200 rounded-xl" />
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
      <h1 className="text-h1 font-medium text-neutral-900 mb-4">Service Not Found</h1>
      <p className="text-body text-neutral-600 mb-8">The service you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
      >
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
  
  const [service, setService] = useState<Service | null>(null);
  const [subservices, setSubservices] = useState<(Subservice & { visibilityStatus?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!serviceSlug) return;
      
      setIsLoading(true);
      
      // Fetch service
      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .eq('slug', serviceSlug)
        .single();
      
      if (serviceData) {
        setService({
          id: serviceData.id,
          slug: serviceData.slug,
          title: lang === 'he' && serviceData.title_he ? serviceData.title_he : serviceData.title_en,
          description: lang === 'he' && serviceData.description_he ? serviceData.description_he : serviceData.description_en || '',
          imageUrl: serviceData.image_url || '',
          heroImageUrl: serviceData.hero_image_url,
          accentColor: serviceData.accent_color,
        });
        
        // Fetch subservices with visibilityStatus
        const { data: subsData } = await supabase
          .from('subservices')
          .select('*')
          .eq('service_id', serviceData.id)
          .in('visibility_status', ['visible', 'coming_soon'])
          .order('sort_order', { ascending: true });
        
        if (subsData) {
          const mapped = subsData.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            serviceId: s.service_id,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
            imageUrl: s.image_url || '',
            heroImageUrl: s.hero_image_url,
            visibilityStatus: s.visibility_status,
          }));
          setSubservices(mapped);
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
    window.scrollTo(0, 0);
  }, [serviceSlug, lang]);

  const handleSubserviceClick = (subservice: Subservice) => {
    navigate(ROUTES.SUBSERVICE(subservice.slug));
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!service) return <NotFound />;

  const accentColor = service.accentColor || '#D48F28';

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Hero Section */}
      <div 
        className="w-full px-4 md:px-12 lg:px-16 pt-6 pb-8"
        style={{ backgroundColor: accentColor }}
      >
        {/* Breadcrumb */}
        <div className="text-white/80 text-meta-sm tracking-wide uppercase mb-4 pl-2 flex items-center gap-2">
          <Link to="/" className="cursor-pointer hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span>Systems</span>
          <span>/</span>
          <span className="text-white">{service.title}</span>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-lg mb-4 md:mb-8">
          <img 
            src={service.heroImageUrl || service.imageUrl || FALLBACK_IMAGE} 
            alt={service.title}
            className="w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-display-sm md:text-display text-neutral-900 mb-6">
            {service.title}
          </h1>
          <p className="text-neutral-800 text-body-lg leading-relaxed max-w-3xl mb-8">
            {service.description}
          </p>
        </div>

        {/* Typical Selection Scenario */}
        <div className="max-w-[1280px] mx-auto mb-12">
          <div className="bg-white/10 rounded-xl p-6 md:p-8">
            <h3 className="text-h2 text-neutral-900 mb-4">Typical Selection Scenario</h3>
            <p className="text-body text-neutral-800 max-w-3xl">
              This system is typically selected when production requirements include configurable modules, 
              consistent output specifications, and integration with existing workshop workflows. 
              Review the product lines below to identify configurations matching your operational context.
            </p>
          </div>
        </div>
      </div>

      {/* Subservices Section - HORIZONTAL SCROLL */}
      <div 
        className="w-full px-4 md:px-12 lg:px-16 pb-12"
        style={{ backgroundColor: accentColor }}
      >
        {subservices.length > 0 ? (
          <HorizontalScroll title="Product Lines">
            {subservices.map((sub) => (
              <SubserviceCard 
                key={sub.id} 
                subservice={sub} 
                onClick={() => handleSubserviceClick(sub)}
              />
            ))}
          </HorizontalScroll>
        ) : (
          <div className="text-center py-12 text-neutral-900/60">
            Product lines for this system are currently being configured.
          </div>
        )}
      </div>

      {/* What Happens After Review */}
      <div className="w-full bg-white py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <h3 className="text-h2 text-neutral-900 mb-4">What Happens After Review</h3>
            <p className="text-body text-neutral-600 mb-6">
              After reviewing product configurations, submit an inquiry with your production context 
              and volume requirements. Our team will assess compatibility with current capacity and 
              provide implementation parameters within 1-2 business days.
            </p>
            <div className="flex flex-col items-start gap-3">
              <Link 
                to="/contact"
                className="px-8 py-3 bg-brand text-white font-medium rounded hover:bg-brand/90 transition-colors"
              >
                Submit Production Inquiry
              </Link>
              <span className="text-meta text-neutral-500">Describe your requirements to receive a processing assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
