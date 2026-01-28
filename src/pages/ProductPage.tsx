/**
 * PRODUCT PAGE
 * ============
 * Displays a single product with:
 * - 3D visualization / gallery
 * - Description & specifications
 * - Dynamic configurator options (loaded from database)
 * - Quote request CTA
 * 
 * Route: /products/:productSlug
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Rotate3d, Info, ChevronLeft } from 'lucide-react';
import { 
  Product, 
  ProductCategory, 
  Subservice, 
  Service,
  ProductConfiguration,
  ConfigOptionType,
  SelectedConfiguration 
} from '../domain/types';
import { getProductWithBreadcrumb, getProductConfiguration } from '../services/data/dataService';
import { ROUTES } from '../router';

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="max-w-[1600px] mx-auto px-16 py-8">
      <div className="h-4 w-96 bg-neutral-200 rounded mb-8" />
      <div className="flex gap-16">
        <div className="w-3/5">
          <div className="h-10 w-64 bg-neutral-200 rounded mb-8" />
          <div className="aspect-[4/3] bg-neutral-200 rounded-2xl" />
        </div>
        <div className="w-2/5">
          <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
          <div className="h-24 w-full bg-neutral-200 rounded mb-10" />
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-4 w-24 bg-neutral-200 rounded mb-3" />
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-neutral-200 rounded-full" />
                  <div className="h-10 w-10 bg-neutral-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// CONFIGURATOR OPTION COMPONENT
// =============================================================================

interface ConfiguratorOptionProps {
  option: ConfigOptionType;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ConfiguratorOption: React.FC<ConfiguratorOptionProps> = ({
  option,
  selectedValue,
  onSelect,
}) => {
  const selectedLabel = option.values.find(v => v.slug === selectedValue)?.label || '';

  // Color picker rendering
  if (option.inputType === 'color_picker') {
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-meta font-medium text-neutral-900 uppercase tracking-wide">
            {option.name}
          </span>
          <span className="text-meta-sm text-neutral-400 capitalize">{selectedLabel}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {option.values.map((value) => (
            <button
              key={value.id}
              onClick={() => onSelect(value.slug)}
              className={`w-10 h-10 rounded-full ring-2 ring-offset-2 transition-all ${
                selectedValue === value.slug
                  ? 'ring-brand'
                  : 'ring-transparent hover:ring-neutral-200'
              }`}
              style={{ backgroundColor: value.colorHex || '#ccc' }}
              title={value.label}
            />
          ))}
        </div>
      </div>
    );
  }

  // Button group rendering (default)
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-meta font-medium text-neutral-900 uppercase tracking-wide">
          {option.name}
        </span>
        {option.description && (
          <Info className="w-4 h-4 text-neutral-300 cursor-pointer hover:text-brand" />
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {option.values.map((value) => (
          <button
            key={value.id}
            onClick={() => onSelect(value.slug)}
            className={`
              px-5 py-3 rounded-lg border text-meta font-medium transition-all
              ${selectedValue === value.slug
                ? 'border-brand bg-brand/5 text-brand'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }
            `}
          >
            {value.label}
            {option.unit ? ` ${option.unit}` : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();

  // Core data state
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [service, setService] = useState<Service | null>(null);

  // Configuration state
  const [configuration, setConfiguration] = useState<ProductConfiguration | null>(null);
  const [selections, setSelections] = useState<SelectedConfiguration>({});

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(0);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!productSlug) return;

      setLoading(true);
      try {
        // Load product with breadcrumb
        const breadcrumbData = await getProductWithBreadcrumb(productSlug);
        if (!breadcrumbData) {
          console.error('Product not found:', productSlug);
          setLoading(false);
          return;
        }

        const { service, subservice, category, product } = breadcrumbData;
        setService(service);
        setSubservice(subservice);
        setCategory(category);
        setProduct(product);

        // Load configuration for this product's subservice
        const config = await getProductConfiguration(product.id, subservice.id);
        if (config) {
          setConfiguration(config);
          setSelections(config.defaults);
        }
      } catch (error) {
        console.error('Failed to load product data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productSlug]);

  // Handle selection change
  const handleSelectionChange = (optionSlug: string, valueSlug: string) => {
    setSelections(prev => ({
      ...prev,
      [optionSlug]: valueSlug,
    }));
  };

  // Build quote URL with selections
  const getQuoteUrl = () => {
    const params = new URLSearchParams();
    params.set('product', product?.slug || '');
    params.set('productTitle', product?.title || '');
    
    // Add configuration selections
    Object.entries(selections).forEach(([optionSlug, valueSlug]) => {
      params.set(`config_${optionSlug}`, valueSlug);
    });

    return `${ROUTES.QUOTE}?${params.toString()}`;
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!product || !service || !subservice || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 font-medium text-neutral-900 mb-4">Product Not Found</h1>
          <Link to={ROUTES.HOME} className="text-brand hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-meta text-neutral-500 mb-8">
          <Link to={ROUTES.HOME} className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link to={ROUTES.SERVICE(service.slug)} className="hover:text-brand">
            {service.title}
          </Link>
          <span>/</span>
          <Link to={`${ROUTES.SUBSERVICE}/${subservice.slug}`} className="hover:text-brand">
            {subservice.title}
          </Link>
          <span>/</span>
          <span className="text-neutral-900">{product.title}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 hover:text-brand mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Main content grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-3/5 lg:sticky lg:top-8 lg:self-start">
            <h1 className="text-display-sm font-medium text-neutral-900 mb-2">{product.title}</h1>
            {product.subtitle && (
              <p className="text-body-lg text-neutral-500 mb-8">{product.subtitle}</p>
            )}

            {/* Main image */}
            <div className="relative aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden mb-4">
              {product.has3DView && (
                <div className="absolute top-4 right-4 bg-black/60 text-white text-meta px-3 py-1 rounded-full flex items-center gap-2 z-10">
                  <Rotate3d className="w-4 h-4" />
                  360° View
                </div>
              )}
              <img
                src={allImages[selectedImage] || '/placeholder.jpg'}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`
                      flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                      ${selectedImage === idx ? 'border-brand' : 'border-transparent hover:border-neutral-200'}
                    `}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {product.videoUrl && (
              <div className="mt-6">
                <video
                  src={product.videoUrl}
                  controls
                  className="w-full rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Right: Info & Configurator */}
          <div className="w-full lg:w-2/5">
            
            {/* Description */}
            <div className="mb-10">
              <h2 className="text-h2 font-medium text-neutral-900 mb-3">Description</h2>
              <p className="text-body text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-10">
                <h3 className="text-h2 font-medium text-neutral-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                      <span className="text-body text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-10">
                <h3 className="text-h2 font-medium text-neutral-900 mb-4">Technical Specifications</h3>
                <div className="space-y-3">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-meta text-neutral-500">{spec.label}</span>
                      <span className="text-body font-medium text-neutral-900">
                        {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full h-px bg-neutral-200 mb-10" />

            {/* Dynamic Configurator */}
            {configuration && configuration.options.length > 0 ? (
              <div className="flex flex-col gap-8">
                {configuration.options.map((option) => (
                  <ConfiguratorOption
                    key={option.id}
                    option={option}
                    selectedValue={selections[option.slug] || ''}
                    onSelect={(value) => handleSelectionChange(option.slug, value)}
                  />
                ))}
              </div>
            ) : (
              // Fallback: No configurator available
              <div className="text-center py-8 bg-neutral-50 rounded-xl mb-8">
                <p className="text-meta text-neutral-500">Configuration options not available for this product.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col gap-4">
              <button 
                onClick={() => navigate(getQuoteUrl())}
                className="w-full bg-brand text-white py-3 rounded-xl font-medium hover:bg-brand/90 transition-colors"
              >
                Request Quote
              </button>
              <button 
                onClick={() => navigate(ROUTES.CONTACT)}
                className="w-full border border-brand text-brand py-3 rounded-xl font-medium hover:bg-brand/5 transition-colors"
              >
                Contact
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
