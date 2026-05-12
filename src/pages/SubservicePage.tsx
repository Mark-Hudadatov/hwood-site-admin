import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { COLORS } from '../tokens';
import { Service, Subservice, ProductCategory, Product } from '../domain/types';
import { getSubservicePageData } from '../services/data/dataService';
import { ROUTES } from '../router';
import { ScrollReveal, StaggerReveal } from '../components/premium';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';

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

  const accentColor = service.accentColor || COLORS.accentGold;

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

          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-neutral-50 min-h-[600px]">
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
