/**
 * SUBSERVICE PAGE - WITH COMING SOON SUPPORT
 * ==========================================
 * ✅ Products with Coming Soon overlay
 * ✅ Category tabs with horizontal scroll
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Service, Subservice, ProductCategory, Product } from '../domain/types';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop';

// =============================================================================
// COMING SOON OVERLAY
// =============================================================================

const ComingSoonOverlay: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-2xl">
      <Clock className={`${iconSize} text-white mb-2`} />
      <span className={`text-white ${textSize} font-bold uppercase tracking-wider`}>Coming Soon</span>
    </div>
  );
};

// =============================================================================
// PRODUCT CARD WITH COMING SOON
// =============================================================================

interface ProductCardProps {
  product: Product & { visibilityStatus?: string };
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isComingSoon = product.visibilityStatus === 'coming_soon';
  const imgSrc = product.imageUrl || FALLBACK_IMAGE;

  return (
    <div 
      className={`relative bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
        isComingSoon ? '' : 'group cursor-pointer hover:shadow-xl'
      }`}
      onClick={isComingSoon ? undefined : onClick}
    >
      {/* Image */}
      <div className="w-full aspect-square bg-gray-50 overflow-hidden relative">
        <img
          src={imgSrc}
          alt={product.title}
          className={`w-full h-full object-cover mix-blend-multiply p-4 transition-transform duration-500 ${
            isComingSoon ? 'grayscale brightness-75' : 'group-hover:scale-110'
          }`}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {isComingSoon && <ComingSoonOverlay size="sm" />}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className={`text-lg font-bold mb-1 transition-colors ${
          isComingSoon ? 'text-gray-400' : 'text-[#1A1A1A] group-hover:text-[#005f5f]'
        }`}>
          {product.title}
        </h3>
        {product.subtitle && (
          <p className={`text-sm ${isComingSoon ? 'text-gray-400' : 'text-gray-500'}`}>
            {product.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// CATEGORY TABS WITH HORIZONTAL SCROLL
// =============================================================================

interface CategoryTabsProps {
  categories: (ProductCategory & { visibilityStatus?: string })[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeTab, onTabChange, accentColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
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
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'right' ? 200 : -200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Tabs */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeTab;
          const isComingSoon = cat.visibilityStatus === 'coming_soon';
          
          return (
            <button
              key={cat.id}
              onClick={() => !isComingSoon && onTabChange(cat.id)}
              disabled={isComingSoon}
              className={`relative flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                isComingSoon 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isActive
                    ? 'text-white shadow-lg'
                    : 'bg-white/80 text-[#1A1A1A] hover:bg-white shadow-sm'
              }`}
              style={isActive && !isComingSoon ? { backgroundColor: accentColor } : {}}
            >
              {cat.title}
              {isComingSoon && (
                <span className="ml-2 text-xs">(Soon)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="w-full bg-gray-200 h-[350px]" />
    <div className="px-16 py-12 bg-gray-50">
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gray-200" />
            <div className="p-5">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
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
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Subservice Not Found</h1>
      <p className="text-gray-600 mb-8">The subservice you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors">
        Back to Home
      </Link>
    </div>
  </div>
);

// =============================================================================
// MAIN SUBSERVICE PAGE
// =============================================================================

export const SubservicePage: React.FC = () => {
  const { subserviceSlug } = useParams<{ subserviceSlug: string }>();
  const navigate = useNavigate();
  const lang = getCurrentLang();
  
  const [service, setService] = useState<Service | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [categories, setCategories] = useState<(ProductCategory & { visibilityStatus?: string })[]>([]);
  const [products, setProducts] = useState<(Product & { visibilityStatus?: string })[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!subserviceSlug) return;
      
      setIsLoading(true);
      
      // Fetch subservice
      const { data: subData } = await supabase
        .from('subservices')
        .select('*')
        .eq('slug', subserviceSlug)
        .single();
      
      if (!subData) {
        setIsLoading(false);
        return;
      }
      
      setSubservice({
        id: subData.id,
        slug: subData.slug,
        serviceId: subData.service_id,
        title: lang === 'he' && subData.title_he ? subData.title_he : subData.title_en,
        description: lang === 'he' && subData.description_he ? subData.description_he : subData.description_en || '',
        imageUrl: subData.image_url || '',
        heroImageUrl: subData.hero_image_url,
      });
      
      // Fetch service
      const { data: svcData } = await supabase
        .from('services')
        .select('*')
        .eq('id', subData.service_id)
        .single();
      
      if (svcData) {
        setService({
          id: svcData.id,
          slug: svcData.slug,
          title: lang === 'he' && svcData.title_he ? svcData.title_he : svcData.title_en,
          description: lang === 'he' && svcData.description_he ? svcData.description_he : svcData.description_en || '',
          imageUrl: svcData.image_url || '',
          heroImageUrl: svcData.hero_image_url,
          accentColor: svcData.accent_color,
        });
      }
      
      // Fetch categories with visibilityStatus
      const { data: catsData } = await supabase
        .from('product_categories')
        .select('*')
        .eq('subservice_id', subData.id)
        .in('visibility_status', ['visible', 'coming_soon'])
        .order('sort_order', { ascending: true });
      
      if (catsData && catsData.length > 0) {
        const mappedCats = catsData.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          subserviceId: c.subservice_id,
          title: lang === 'he' && c.title_he ? c.title_he : c.title_en,
          description: lang === 'he' && c.description_he ? c.description_he : c.description_en || '',
          sortOrder: c.sort_order,
          visibilityStatus: c.visibility_status,
        }));
        setCategories(mappedCats);
        
        // Set first visible category as active
        const visibleCats = mappedCats.filter(c => c.visibilityStatus !== 'coming_soon');
        if (visibleCats.length > 0) {
          setActiveTab(visibleCats[0].id);
        } else {
          setActiveTab(mappedCats[0].id);
        }
        
        // Fetch products with visibilityStatus
        const categoryIds = catsData.map((c: any) => c.id);
        const { data: prodsData } = await supabase
          .from('products')
          .select('*')
          .in('category_id', categoryIds)
          .in('visibility_status', ['visible', 'coming_soon', 'not_in_stock'])
          .order('sort_order', { ascending: true });
        
        if (prodsData) {
          const mappedProds = prodsData.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            categoryId: p.category_id,
            title: lang === 'he' && p.title_he ? p.title_he : p.title_en,
            subtitle: lang === 'he' && p.subtitle_he ? p.subtitle_he : p.subtitle_en,
            description: lang === 'he' && p.description_he ? p.description_he : p.description_en || '',
            imageUrl: p.image_url || '',
            galleryImages: p.gallery_images || [],
            videoUrl: p.video_url,
            features: lang === 'he' && p.features_he ? p.features_he : p.features_en || [],
            specifications: p.specifications || [],
            has3DView: p.has_3d_view,
            visibilityStatus: p.visibility_status,
          }));
          setProducts(mappedProds);
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
    window.scrollTo(0, 0);
  }, [subserviceSlug, lang]);

  const handleProductClick = (product: Product) => {
    navigate(ROUTES.PRODUCT(product.slug));
  };

  const filteredProducts = products.filter(p => p.categoryId === activeTab);

  if (isLoading) return <LoadingSkeleton />;
  if (!subservice || !service) return <NotFound />;

  const accentColor = service.accentColor || '#D48F28';

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Top Section with Accent Background */}
      <div className="w-full pt-6 flex flex-col" style={{ backgroundColor: accentColor }}>
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">
          
          {/* Breadcrumbs */}
          <div className="text-white text-[10px] md:text-xs font-bold tracking-wide uppercase mb-4 flex items-center gap-2 pl-2">
            <Link to="/" className="cursor-pointer hover:opacity-80">Home</Link>
            <span>/</span>
            <span>Services</span>
            <span>/</span>
            <Link to={ROUTES.SERVICE(service.slug)} className="cursor-pointer hover:opacity-80">{service.title}</Link>
            <span>/</span>
            <span className="text-white">{subservice.title}</span>
          </div>

          {/* Dark Hero Card */}
          <div className="w-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-black text-white h-[180px] md:h-[240px] shadow-xl mb-12">
            <div className="absolute inset-0">
              <img 
                src={subservice.heroImageUrl || subservice.imageUrl || FALLBACK_IMAGE}
                alt={subservice.title}
                className="w-full h-full object-cover object-center opacity-60 mix-blend-overlay"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-normal tracking-tight mb-3">{subservice.title}</h1>
              <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl line-clamp-2">
                {subservice.description}
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs Section */}
        <div className="bg-[#EAEAEA] w-full">
          <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-6">
            <CategoryTabs 
              categories={categories} 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              accentColor={accentColor}
            />
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="w-full bg-[#EAEAEA] py-12 md:py-16 min-h-[400px]">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>No products available in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
