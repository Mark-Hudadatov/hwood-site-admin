/**
 * PRODUCT PAGE
 * ============
 * Displays a single product with:
 * - 3D visualization / gallery
 * - Description & specifications
 * - Configurator options
 * - Quote request CTA
 * 
 * Route: /products/:productSlug
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Rotate3d, Info, ChevronLeft } from 'lucide-react';
import { Product, ProductCategory, Subservice, Service } from '../domain/types';
import { getProductWithBreadcrumb } from '../services/data/dataService';
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
// MAIN PRODUCT PAGE COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Configurator state (mock)
  const [selectedColor, setSelectedColor] = useState<'teal' | 'grey' | 'white'>('teal');
  const [selectedMaterial, setSelectedMaterial] = useState('Standard');
  const [selectedSize, setSelectedSize] = useState('Standard (3000mm)');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!productSlug) return;
      
      setIsLoading(true);
      const data = await getProductWithBreadcrumb(productSlug);
      
      if (data) {
        setProduct(data.product);
        setCategory(data.category);
        setSubservice(data.subservice);
        setService(data.service);
      }
      
      setIsLoading(false);
    };
    
    loadData();
    window.scrollTo(0, 0);
  }, [productSlug]);

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

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-8">
        
        {/* Breadcrumbs */}
        <div className="text-gray-500 text-[10px] md:text-xs font-bold tracking-wide uppercase mb-8 flex items-center gap-2">
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

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: Title & Visuals */}
          <div className="w-full lg:w-3/5 flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] mb-2 tracking-tight">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-xl text-gray-500 mb-8">{product.subtitle}</p>
            )}

            {/* Product Visual - Video or Image */}
            {product.videoUrl ? (
              /* Video Only (autoplay, no image) */
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
                
                {/* 3D/Spin Indicator */}
                {product.has3DView && (
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700">
                    <Rotate3d className="w-4 h-4 text-[#005f5f]" />
                    <span>360° View</span>
                  </div>
                )}
              </div>
            ) : (
              /* Image Only (when no video) */
              <>
                <div className="w-full aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden relative group">
                  <img 
                    src={galleryImages[activeImageIndex]} 
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply p-8 transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* 3D/Spin Indicator */}
                  {product.has3DView && (
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700">
                      <Rotate3d className="w-4 h-4 text-[#005f5f]" />
                      <span>360° View</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails (only for image products) */}
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
                <ul className="space-y-3">
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

          {/* RIGHT COLUMN: Description & Configurator */}
          <div className="w-full lg:w-2/5 flex flex-col pt-4">
            
            {/* Description */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Specifications</h3>
                <div className="space-y-3">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">{spec.label}</span>
                      <span className="font-medium text-gray-900">
                        {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full h-px bg-gray-200 mb-10" />

            {/* Configurator */}
            <div className="flex flex-col gap-8">
              
              {/* Color */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">Machine Color</span>
                  <span className="text-xs text-gray-400 capitalize">{selectedColor}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedColor('teal')}
                    className={`w-10 h-10 rounded-full bg-[#005f5f] ring-2 ring-offset-2 transition-all ${
                      selectedColor === 'teal' ? 'ring-[#005f5f]' : 'ring-transparent hover:ring-gray-200'
                    }`} 
                  />
                  <button 
                    onClick={() => setSelectedColor('grey')}
                    className={`w-10 h-10 rounded-full bg-gray-500 ring-2 ring-offset-2 transition-all ${
                      selectedColor === 'grey' ? 'ring-gray-500' : 'ring-transparent hover:ring-gray-200'
                    }`} 
                  />
                  <button 
                    onClick={() => setSelectedColor('white')}
                    className={`w-10 h-10 rounded-full bg-white border border-gray-200 ring-2 ring-offset-2 transition-all ${
                      selectedColor === 'white' ? 'ring-gray-300' : 'ring-transparent hover:ring-gray-200'
                    }`} 
                  />
                </div>
              </div>

              {/* Material */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">Worktable Material</span>
                  <Info className="w-4 h-4 text-gray-300 cursor-pointer hover:text-[#005f5f]" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Standard', 'Phenolic', 'Aluminum'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(m)}
                      className={`
                        px-6 py-3 rounded-lg border text-sm font-medium transition-all
                        ${selectedMaterial === m 
                          ? 'border-[#005f5f] bg-[#005f5f]/5 text-[#005f5f]' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">Working Field Size</span>
                </div>
                <div className="flex flex-col gap-2">
                  {['Standard (3000mm)', 'Extended (4500mm)', 'Max (6000mm)'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`
                        w-full flex justify-between items-center px-5 py-4 rounded-xl border text-left transition-all
                        ${selectedSize === s 
                          ? 'border-[#005f5f] bg-white ring-1 ring-[#005f5f]' 
                          : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300'
                        }
                      `}
                    >
                      <span className={`font-medium ${selectedSize === s ? 'text-[#005f5f]' : 'text-gray-700'}`}>
                        {s}
                      </span>
                      {selectedSize === s && <Check className="w-5 h-5 text-[#005f5f]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col gap-4">
              <button 
                onClick={() => navigate(ROUTES.QUOTE)}
                className="w-full bg-[#005f5f] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#004d4d] transition-colors shadow-lg shadow-teal-900/10"
              >
                Request Quote
              </button>
              <button className="w-full bg-transparent border border-[#005f5f] text-[#005f5f] py-4 rounded-xl font-bold text-lg hover:bg-[#005f5f]/5 transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
