/**
 * SUBSERVICE PAGE - FIXED
 * =======================
 * FIXES:
 * ✅ Category tabs with LEFT/RIGHT navigation arrows
 * ✅ Product images with fallback placeholders
 * ✅ Horizontal scroll for categories
 * ✅ Better loading states
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Service, Subservice, ProductCategory, Product } from '../domain/types';
import { getSubservicePageData } from '../services/data/dataService';
import { ROUTES } from '../router';
import { ScrollReveal, StaggerReveal } from '../components/premium';

// Fallback image for products
const PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop';

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
      <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#005f5f] rounded-full animate-spin" />
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
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 group-hover:text-[#005f5f] transition-colors">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-sm text-gray-500">{product.subtitle}</p>
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
      const amount = direction === 'right' ? 300 : -300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Tabs Container */}
      <div 
        ref={scrollRef}
        className="flex flex-row gap-3 md:gap-4 overflow-x-auto no-scrollbar items-end -mb-px scroll-smooth px-12"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`
              group text-left px-5 md:px-8 py-4 md:py-6 rounded-t-2xl min-w-[180px] md:min-w-[260px] flex-shrink-0 transition-all duration-200 relative
              ${activeTab === category.id 
                ? 'bg-[#F9FAFB] shadow-lg text-black z-10' 
                : 'bg-white/10 hover:bg-white/20 text-white z-0'
              }
            `}
          >
            <h3 className={`text-base md:text-xl font-bold mb-1 ${activeTab === category.id ? 'text-black' : 'text-white'}`}>
              {category.title}
            </h3>
            <p className={`text-xs md:text-sm leading-snug line-clamp-2 ${activeTab === category.id ? 'text-gray-600' : 'text-white/70'}`}>
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
    <div className="px-4 md:px-16 py-12 bg-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
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

  const accentColor = service.accentColor || '#D48F28';

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Top Section with Accent Background */}
      <div className="w-full pt-6 flex flex-col" style={{ backgroundColor: accentColor }}>
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">
          
          {/* Breadcrumbs */}
          <div className="text-white text-[10px] md:text-xs font-bold tracking-wide uppercase mb-4 flex items-center gap-2 pl-2 flex-wrap">
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
            <div className="w-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-black text-white h-[160px] md:h-[220px] shadow-xl mb-8">
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
                <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed max-w-2xl line-clamp-2">{subservice.description}</p>
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
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg mb-2">No products found in this category.</p>
              <p className="text-sm">Products will appear here once added via Admin Panel.</p>
            </div>
          )}

          {/* No categories state */}
          {categories.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No product categories available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
