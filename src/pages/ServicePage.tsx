import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { COLORS } from '../tokens';
import { Service, Subservice } from '../domain/types';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';
import { HorizontalScroll } from '../components/HorizontalScroll';
import { SubserviceCard } from '../components/SubserviceCard';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none"><rect width="800" height="1000" fill="#1a1a1a"/><g transform="translate(360, 460)" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.4"><rect x="0" y="0" width="80" height="50" rx="3"/><rect x="8" y="12" width="20" height="30" rx="2"/><rect x="33" y="12" width="20" height="30" rx="2"/><rect x="58" y="12" width="15" height="20" rx="2"/><circle cx="18" cy="27" r="2" fill="#ffffff" fill-opacity="0.4"/><circle cx="43" cy="27" r="2" fill="#ffffff" fill-opacity="0.4"/><circle cx="65" cy="22" r="1.5" fill="#ffffff" fill-opacity="0.4"/></g></svg>`)}`;

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

  const accentColor = service.accentColor || COLORS.accentGold;

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
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-display-sm md:text-display text-neutral-900 mb-6">
            {service.title}
          </h1>
          <p className="text-neutral-800 text-body-lg leading-relaxed max-w-3xl">
            {service.description}
          </p>
        </div>
      </div>

      {/* Subservices Section */}
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
          <div className="text-center py-12 text-neutral-900/60">
            No solutions available for this service yet.
          </div>
        )}
      </div>
    </div>
  );
};
