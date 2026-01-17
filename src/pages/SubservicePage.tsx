/**
 * SUBSERVICE PAGE
 * ===============
 * Displays a subservice with category tabs and product grid.
 * Route: /subservices/:subserviceSlug
 * 
 * Example: /subservices/kitchen-modules
 * Shows tabs: Upper, Lower, Base, Islands
 * Each tab shows product grid
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Service, Subservice, ProductCategory, Product } from '../domain/types';
import { getSubservicePageData } from '../services/data/dataService';
import { ROUTES } from '../router';

// =============================================================================
// PRODUCT CARD COMPONENT
// =============================================================================

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-full aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 group-hover:text-[#005f5f] transition-colors">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-sm text-gray-500">
            {product.subtitle}
          </p>
        )}
      </div>
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

  // Load data
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
        
        // Set first category as active
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

  // Filter products by active category
  const filteredProducts = products.filter(p => p.categoryId === activeTab);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Not found state
  if (!subservice || !service) {
    return <NotFound />;
  }

  const accentColor = service.accentColor || '#D48F28';

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Top Section with Accent Background */}
      <div 
        className="w-full pt-6 flex flex-col"
        style={{ backgroundColor: accentColor }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">
          
          {/* Breadcrumbs */}
          <div className="text-white text-[10px] md:text-xs font-bold tracking-wide uppercase mb-4 flex items-center gap-2 pl-2">
            <Link to="/" className="cursor-pointer hover:opacity-80">Home</Link>
            <span>/</span>
            <span className="cursor-pointer hover:opacity-80">Services</span>
            <span>/</span>
            <Link 
              to={ROUTES.SERVICE(service.slug)} 
              className="cursor-pointer hover:opacity-80"
            >
              {service.title}
            </Link>
            <span>/</span>
            <span className="text-white">{subservice.title}</span>
          </div>

          {/* Dark Hero Card */}
          <div className="w-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-black text-white h-[180px] md:h-[240px] shadow-xl mb-12">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={subservice.heroImageUrl || subservice.imageUrl}
                alt={subservice.title}
                className="w-full h-full object-cover object-center opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-normal tracking-tight mb-3">
                {subservice.title}
              </h1>
              <p className="text-gray-200 text-base md:text-xl font-light leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
                {subservice.description}
              </p>
            </div>
          </div>

          {/* Tabs Section - Inside Accent Background */}
          {categories.length > 0 && (
            <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar items-end -mb-px">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`
                    group text-left px-8 py-6 rounded-t-2xl min-w-[260px] md:min-w-[320px] transition-colors duration-200 relative
                    ${activeTab === category.id 
                      ? 'bg-[#F9FAFB] shadow-lg text-black z-10' 
                      : 'bg-transparent hover:bg-black/5 text-[#1A1A1A]/80 hover:text-[#1A1A1A] z-0'
                    }
                  `}
                >
                  <h3 className={`text-xl font-bold mb-2 ${activeTab === category.id ? 'text-black' : 'text-[#1A1A1A]'}`}>
                    {category.title}
                  </h3>
                  <p className={`text-sm leading-snug line-clamp-2 ${activeTab === category.id ? 'text-gray-600' : 'text-[#1A1A1A]/70'}`}>
                    {category.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Area - Light Gray Background */}
      <div className="flex-1 bg-[#F9FAFB] min-h-[600px] relative z-0">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16">
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products found in this category.
            </div>
          )}

          {/* No categories state */}
          {categories.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No product categories available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
