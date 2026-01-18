/**
 * PRODUCT PAGE - DYNAMIC CONFIGURATOR
 * ====================================
 * Displays a single product with:
 * - 3D visualization / gallery
 * - Description & specifications
 * - Dynamic configurator (loaded from database)
 * - Quote request CTA
 * 
 * Route: /products/:productSlug
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Rotate3d, ChevronLeft, Download } from 'lucide-react';
import { 
  Product, 
  ProductCategory, 
  Subservice, 
  Service,
  ConfigOptionType,
  ProductConfiguration,
  SelectedConfiguration,
} from '../domain/types';
import { 
  getProductWithBreadcrumb,
  getProductConfiguration,
} from '../services/data/dataService';
import { ROUTES } from '../router';

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="max-w-[1920px] mx-auto px-16 py-8">
      <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
      <div className="flex gap-24">
        <div className="w-3/5">
          <div className="h-10 w-64 bg-gray-200 rounded mb-8" />
          <div className="aspect-[4/3] bg-gray-200 rounded-3xl" />
        </div>
        <div className="w-2/5">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-24 w-full bg-gray-200 rounded mb-10" />
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
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
// NOT FOUND STATE
// =============================================================================

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
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
// CONFIGURATOR COMPONENTS
// =============================================================================

interface ConfiguratorOptionProps {
  option: ConfigOptionType;
  selectedValue: string;
  onSelect: (optionSlug: string, valueSlug: string) => void;
}

const ConfiguratorOption: React.FC<ConfiguratorOptionProps> = ({ 
  option, 
  selectedValue, 
  onSelect 
}) => {
  const getSelectedLabel = () => {
    const selected = option.values.find(v => v.slug === selectedValue);
    return selected?.label || '';
  };

  // Render based on input type
  if (option.inputType === 'color_picker') {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
            {option.name}
          </span>
          <span className="text-xs text-gray-400 capitalize">{getSelectedLabel()}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {option.values.map((value) => (
            <button
              key={value.id}
              onClick={() => onSelect(option.slug, value.slug)}
              title={value.label}
              className={`
                w-10 h-10 rounded-full ring-2 ring-offset-2 transition-all
                ${selectedValue === value.slug 
                  ? 'ring-[#005f5f]' 
                  : 'ring-transparent hover:ring-gray-200'
                }
                ${value.colorHex === '#FFFFFF' ? 'border border-gray-200' : ''}
              `}
              style={{ backgroundColor: value.colorHex || '#ccc' }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Button group (default)
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
          {option.name}
          {option.unit && <span className="text-gray-400 ml-1">({option.unit})</span>}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => (
          <button
            key={value.id}
            onClick={() => onSelect(option.slug, value.slug)}
            className={`
              px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
              ${selectedValue === value.slug 
                ? 'border-[#005f5f] bg-[#005f5f]/5 text-[#005f5f]' 
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {value.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// SPECIFICATIONS TABLE
// =============================================================================

interface SpecificationsTableProps {
  specifications: { label: string; value: string; unit?: string }[];
}

const SpecificationsTable: React.FC<SpecificationsTableProps> = ({ specifications }) => {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Specifications</h3>
      <div className="bg-gray-50 rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {specifications.map((spec, i) => (
              <tr key={i} className={i !== specifications.length - 1 ? 'border-b border-gray-200' : ''}>
                <td className="px-4 py-3 text-gray-500 text-sm">{spec.label}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PRODUCT PAGE COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  // Product data state
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Configuration state
  const [configuration, setConfiguration] = useState<ProductConfiguration | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<SelectedConfiguration>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Load product data
  useEffect(() => {
    const loadData = async () => {
      if (!productSlug) return;
      
      setIsLoading(true);
      
      try {
        // Load product and breadcrumb
        const data = await getProductWithBreadcrumb(productSlug);
        
        if (data) {
          setProduct(data.product);
          setCategory(data.category);
          setSubservice(data.subservice);
          setService(data.service);
          
          // Load configuration for this product
          if (data.subservice?.id && data.product?.id) {
            const config = await getProductConfiguration(data.product.id, data.subservice.id);
            setConfiguration(config);
            
            // Set default selections
            if (config) {
              const defaults: SelectedConfiguration = {};
              config.options.forEach(opt => {
                // Use default from config or first value
                const defaultValue = opt.values.find(v => v.isDefault);
                defaults[opt.slug] = defaultValue?.slug || opt.values[0]?.slug || '';
              });
              setSelectedConfig(defaults);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      }
      
      setIsLoading(false);
    };
    
    loadData();
    window.scrollTo(0, 0);
  }, [productSlug]);

  // Handle configuration selection
  const handleConfigSelect = (optionSlug: string, valueSlug: string) => {
    setSelectedConfig(prev => ({
      ...prev,
      [optionSlug]: valueSlug,
    }));
  };

  // Build quote URL with configuration
  const quoteUrl = useMemo(() => {
    if (!product) return ROUTES.QUOTE;
    
    const params = new URLSearchParams();
    params.set('product', product.slug);
    params.set('productTitle', product.title);
    
    // Add configuration selections
    Object.entries(selectedConfig).forEach(([key, value]) => {
      if (value) {
        params.set(`config_${key}`, value);
      }
    });
    
    return `${ROUTES.QUOTE}?${params.toString()}`;
  }, [product, selectedConfig]);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Not found state
  if (!product || !category || !subservice || !service) {
    return <NotFound />;
  }

  const galleryImages = product.galleryImages?.length 
    ? product.galleryImages 
    : [product.imageUrl];

  const hasConfigurator = configuration && configuration.options.length > 0;

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-8">
        
        {/* Breadcrumbs */}
        <div className="text-gray-500 text-[10px] md:text-xs font-bold tracking-wide uppercase mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="cursor-pointer hover:text-teal-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="cursor-pointer hover:text-teal-700 transition-colors">Services</span>
          <span>/</span>
          <Link 
            to={ROUTES.SERVICE(service.slug)} 
            className="cursor-pointer hover:text-teal-700 transition-colors"
          >
            {service.title}
          </Link>
          <span>/</span>
          <Link 
            to={ROUTES.SUBSERVICE(subservice.slug)} 
            className="cursor-pointer hover:text-teal-700 transition-colors"
          >
            {subservice.title}
          </Link>
          <span>/</span>
          <span className="text-[#005f5f]">{product.title}</span>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(ROUTES.SUBSERVICE(subservice.slug))}
          className="flex items-center gap-2 text-gray-600 hover:text-[#005f5f] mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to {subservice.title}</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: Title & Visuals */}
          <div className="w-full lg:w-3/5 flex flex-col">
            {/* Product Header */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] mb-2 tracking-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-xl text-gray-500">{product.subtitle}</p>
              )}
            </div>

            {/* Product Visual - Video or Image */}
            {product.videoUrl ? (
              <div className="w-full aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden relative">
                <video 
                  src={product.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support video playback.
                </video>
                
                {product.has3DView && (
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700">
                    <Rotate3d className="w-4 h-4 text-[#005f5f]" />
                    <span>360° View</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-full aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden relative group">
                  <img 
                    src={galleryImages[activeImageIndex]} 
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply p-8 transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {product.has3DView && (
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700">
                      <Rotate3d className="w-4 h-4 text-[#005f5f]" />
                      <span>360° View</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar py-2">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-24 h-24 rounded-xl border-2 flex-shrink-0 cursor-pointer overflow-hidden transition-all ${
                          i === activeImageIndex 
                            ? 'border-[#005f5f]' 
                            : 'border-transparent bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <img 
                          src={img}
                          alt={`${product.title} view ${i + 1}`}
                          className="w-full h-full object-cover mix-blend-multiply p-2"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <Check className="w-5 h-5 text-[#005f5f] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Description, Specs & Configurator */}
          <div className="w-full lg:w-2/5 flex flex-col pt-4">
            
            {/* Description */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                {product.description}
              </p>
            </div>

            {/* Specifications Table */}
            <SpecificationsTable specifications={product.specifications || []} />

            {/* Divider */}
            {hasConfigurator && <div className="w-full h-px bg-gray-200 mb-8" />}

            {/* Dynamic Configurator */}
            {hasConfigurator && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Configuration</h3>
                {configuration.options.map((option) => (
                  <ConfiguratorOption
                    key={option.id}
                    option={option}
                    selectedValue={selectedConfig[option.slug] || ''}
                    onSelect={handleConfigSelect}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto pt-8 flex flex-col gap-4">
              <button 
                onClick={() => navigate(quoteUrl)}
                className="w-full bg-[#005f5f] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#004d4d] transition-colors shadow-lg shadow-teal-900/10"
              >
                Request Quote
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-transparent border border-[#005f5f] text-[#005f5f] py-4 rounded-xl font-bold text-lg hover:bg-[#005f5f]/5 transition-colors">
                <Download className="w-5 h-5" />
                Download Technical Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
