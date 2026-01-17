/**
 * SERVICE PAGE
 * ============
 * Displays a single service with its subservices carousel.
 * Route: /services/:serviceSlug
 * 
 * Example: /services/modular-bodies-and-cabinets
 * Shows: Kitchen modules, Bathrooms, Wardrobes, Drawers...
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Service, Subservice } from '../domain/types';
import { getServiceBySlug, getSubservicesByServiceSlug } from '../services/data/dataService';
import { ROUTES } from '../router';

// =============================================================================
// SUBSERVICE CARD COMPONENT
// =============================================================================

interface SubserviceCardProps {
  subservice: Subservice;
  onClick: () => void;
}

const SubserviceCard: React.FC<SubserviceCardProps> = ({ subservice, onClick }) => {
  return (
    <div 
      className="relative w-full aspect-[3/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={subservice.imageUrl}
        alt={subservice.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-wide">
          {subservice.title}
        </h3>
        <p className="text-white/90 text-sm md:text-base leading-relaxed font-light line-clamp-3">
          {subservice.description}
        </p>
      </div>

      {/* Accent Bottom Strip */}
      <div 
        className="absolute bottom-0 left-0 w-full h-3 bg-[#005f5f]"
      />
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
      <div className="flex gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-[360px] flex-shrink-0">
            <div className="aspect-[4/3] bg-gray-200 rounded-3xl mb-4" />
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-full bg-gray-200 rounded" />
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
// MAIN SERVICE PAGE COMPONENT
// =============================================================================

export const ServicePage: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [subservices, setSubservices] = useState<Subservice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!serviceSlug) return;
      
      setIsLoading(true);
      const [serviceData, subservicesData] = await Promise.all([
        getServiceBySlug(serviceSlug),
        getSubservicesByServiceSlug(serviceSlug),
      ]);
      
      setService(serviceData || null);
      setSubservices(subservicesData);
      setIsLoading(false);
    };
    
    loadData();
    window.scrollTo(0, 0);
  }, [serviceSlug]);

  const handleSubserviceClick = (subservice: Subservice) => {
    navigate(ROUTES.SUBSERVICE(subservice.slug));
  };

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Not found state
  if (!service) {
    return <NotFound />;
  }

  const accentColor = service.accentColor || '#D48F28';

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Hero Section with Accent Background */}
      <div 
        className="w-full px-4 md:px-12 lg:px-16 pt-6 pb-8"
        style={{ backgroundColor: accentColor }}
      >
        {/* Breadcrumb */}
        <div className="text-white/90 text-[10px] md:text-xs font-bold tracking-wide uppercase mb-4 pl-2 flex items-center gap-2">
          <Link to="/" className="cursor-pointer hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span>Services</span>
          <span>/</span>
          <span className="text-white">{service.title}</span>
        </div>

        {/* Hero Image Container */}
        <div className="w-full h-[180px] md:h-[240px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl mb-4 md:mb-8">
          <img 
            src={service.heroImageUrl || service.imageUrl} 
            alt={service.title}
            className="w-full h-full object-cover object-center"
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

      {/* Subservices Section (Continues Accent Background) */}
      <div 
        className="w-full px-4 md:px-12 lg:px-16 pb-20"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex justify-between items-end mb-8 pl-2">
          <h2 className="text-[#1A1A1A] text-3xl md:text-4xl font-bold tracking-tight">
            Solutions
          </h2>
        </div>

        {/* Grid Layout (same as HomePage Our Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {subservices.map((sub) => (
            <SubserviceCard 
              key={sub.id} 
              subservice={sub} 
              onClick={() => handleSubserviceClick(sub)}
            />
          ))}
        </div>

        {/* Empty state */}
        {subservices.length === 0 && (
          <div className="text-center py-12 text-[#1A1A1A]/60">
            No solutions available for this service yet.
          </div>
        )}
      </div>
    </div>
  );
};
