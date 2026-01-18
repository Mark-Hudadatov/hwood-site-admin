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
      className={`relative w-[280px] md:w-[320px] flex-shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ${
        isComingSoon ? '' : 'group cursor-pointer'
      }`}
      onClick={isComingSoon ? undefined : onClick}
    >
      {/* Background Image */}
      <img
        src={imgSrc}
        alt={subservice.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
          isComingSoon ? 'grayscale brightness-50' : 'group-hover:scale-110'
        }`}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />
      
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
          <Clock className="w-12 h-12 text-white mb-3" />
          <span className="text-white text-xl font-bold uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isComingSoon 
          ? 'bg-black/20' 
          : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-[#005f5f]/90 group-hover:via-[#005f5f]/50'
      }`} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className={`text-white text-xl md:text-2xl font-bold mb-2 tracking-wide transition-transform duration-500 ${
          isComingSoon ? '' : 'group-hover:-translate-y-1'
        }`}>
          {subservice.title}
        </h3>
        <p className="text-white/90 text-sm leading-relaxed font-light line-clamp-2">
          {subservice.description}
        </p>
        
        {!isComingSoon && (
          <div className="flex items-center gap-2 mt-3 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span>View Products</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Bottom accent line on hover */}
      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/80 transition-all duration-500 w-0 group-hover:w-full" />
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
        <h2 className="text-[#1A1A1A] text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h2>
        
        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              showLeftArrow 
                ? 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white cursor-pointer' 
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              showRightArrow 
                ? 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white cursor-pointer' 
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
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
    <div className="w-full bg-gray-200 h-[300px]" />
    <div className="px-16 py-12">
      <div className="h-10 w-64 bg-gray-200 rounded mb-8" />
      <div className="flex gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-[320px] flex-shrink-0">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
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
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
      <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors"
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
        <div className="text-white/90 text-[10px] md:text-xs font-bold tracking-wide uppercase mb-4 pl-2 flex items-center gap-2">
          <Link to="/" className="cursor-pointer hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span>Services</span>
          <span>/</span>
          <span className="text-white">{service.title}</span>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[180px] md:h-[240px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl mb-4 md:mb-8">
          <img 
            src={service.heroImageUrl || service.imageUrl || FALLBACK_IMAGE} 
            alt={service.title}
            className="w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-normal text-[#1A1A1A] mb-6 tracking-tight">
            {service.title}
          </h1>
          <p className="text-[#1A1A1A] text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
            {service.description}
          </p>
        </div>
      </div>

      {/* Subservices Section - HORIZONTAL SCROLL */}
      <div 
        className="w-full px-4 md:px-12 lg:px-16 pb-20"
        style={{ backgroundColor: accentColor }}
      >
        {subservices.length > 0 ? (
          <HorizontalScroll title="Solutions">
            {subservices.map((sub) => (
              <SubserviceCard 
                key={sub.id} 
                subservice={sub} 
                onClick={() => handleSubserviceClick(sub)}
              />
            ))}
          </HorizontalScroll>
        ) : (
          <div className="text-center py-12 text-[#1A1A1A]/60">
            No solutions available for this service yet.
          </div>
        )}
      </div>
    </div>
  );
};
