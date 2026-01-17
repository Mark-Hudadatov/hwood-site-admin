/**
 * HOME PAGE (Optimized)
 * =====================
 * Uses database settings for all content and layout.
 * Optimized with:
 * - Lazy loading images
 * - Single query for settings
 * - Cached data
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Service, Story } from '../domain/types';
import { getServices, getStories } from '../services/data/dataService';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';

// =============================================================================
// TYPES
// =============================================================================

interface HomepageSettings {
  hero: {
    left_image_url: string;
    left_title_en: string;
    left_title_he: string;
    right_image_url: string;
    right_title_en: string;
    right_title_he: string;
    right_link: string;
    hero_height: string;
    show_pagination: boolean;
  };
  services_section: {
    title_en: string;
    title_he: string;
    padding_y: string;
    card_gap: string;
    card_aspect_ratio: string;
    show_descriptions: boolean;
  };
  stories_section: {
    title_en: string;
    title_he: string;
    button_text_en: string;
    button_text_he: string;
    button_link: string;
    padding_y: string;
    card_gap: string;
    show_generate_button: boolean;
  };
  about_section: {
    title_en: string;
    title_he: string;
    description_en: string;
    description_he: string;
    button_text_en: string;
    button_text_he: string;
    button_link: string;
    background_color: string;
    text_color: string;
  };
  layout: {
    primary_color: string;
    secondary_color: string;
    background_dark: string;
    section_spacing: string;
    border_radius: string;
  };
}

// Default settings (fallback)
const DEFAULT_SETTINGS: HomepageSettings = {
  hero: {
    left_image_url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45f7?auto=format&fit=crop&q=80&w=1600',
    left_title_en: 'Engineered for kitchens, bathrooms, and storage rooms',
    left_title_he: 'מתוכנן למטבחים, חדרי אמבטיה וחדרי אחסון',
    right_image_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1600',
    right_title_en: 'Modular Cabinet Systems',
    right_title_he: 'מערכות ארונות מודולריות',
    right_link: '/services/modular-cabinet-systems',
    hero_height: '80vh',
    show_pagination: true,
  },
  services_section: {
    title_en: 'Our Services',
    title_he: 'השירותים שלנו',
    padding_y: '24',
    card_gap: '8',
    card_aspect_ratio: '3/4',
    show_descriptions: true,
  },
  stories_section: {
    title_en: 'Recent Projects and News',
    title_he: 'פרויקטים וחדשות אחרונים',
    button_text_en: 'See all',
    button_text_he: 'ראה הכל',
    button_link: '/portfolio',
    padding_y: '24',
    card_gap: '12',
    show_generate_button: true,
  },
  about_section: {
    title_en: 'About HWOOD',
    title_he: 'אודות HWOOD',
    description_en: 'We are modern production powerhouse delivering modular cabinet systems, CNC processing, and premium furniture fronts for residential and commercial projects.',
    description_he: 'אנחנו מפעל ייצור מודרני המספק מערכות ארונות מודולריות, עיבוד CNC וחזיתות רהיטים פרימיום לפרויקטים למגורים ומסחריים.',
    button_text_en: 'Discover HWOOD',
    button_text_he: 'גלה את HWOOD',
    button_link: '/about',
    background_color: '#EAEAEA',
    text_color: '#005f5f',
  },
  layout: {
    primary_color: '#005f5f',
    secondary_color: '#004d4d',
    background_dark: '#002828',
    section_spacing: '0',
    border_radius: '2xl',
  },
};

// Get current language
const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

// =============================================================================
// LAZY IMAGE COMPONENT
// =============================================================================

const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {!loaded && !error && (
        <div className={`${className} bg-gray-300 animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
};

// =============================================================================
// SERVICE CARD COMPONENT
// =============================================================================

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  showDescription: boolean;
  aspectRatio: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, showDescription, aspectRatio }) => {
  const aspectClass = useMemo(() => {
    switch (aspectRatio) {
      case '3/5': return 'aspect-[3/5]';
      case '1/1': return 'aspect-square';
      case '4/3': return 'aspect-[4/3]';
      default: return 'aspect-[3/4]';
    }
  }, [aspectRatio]);

  return (
    <div 
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-lg group cursor-pointer`}
      onClick={onClick}
    >
      <LazyImage
        src={service.imageUrl}
        alt={service.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-wide">
          {service.title}
        </h3>
        {showDescription && (
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-light line-clamp-3">
            {service.description}
          </p>
        )}
      </div>

      <div 
        className="absolute bottom-0 left-0 w-full h-3" 
        style={{ backgroundColor: service.accentColor || '#005f5f' }}
      />
    </div>
  );
};

// =============================================================================
// STORY CARD COMPONENT
// =============================================================================

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[360px] flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[3rem] shadow-lg mb-6">
        <LazyImage
          src={story.imageUrl}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="mb-4 px-4 py-1 rounded-full border border-white/30 bg-[#004D4D] text-white text-[10px] md:text-xs font-semibold tracking-wider uppercase">
        {story.type}
      </div>

      <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight mb-3 px-2 line-clamp-3">
        {story.title}
      </h3>

      <div className="text-white/80 text-sm font-medium">
        {story.date}
      </div>
    </div>
  );
};

// =============================================================================
// HERO SECTION
// =============================================================================

interface HeroSectionProps {
  settings: HomepageSettings['hero'];
  lang: 'en' | 'he';
}

const HeroSection: React.FC<HeroSectionProps> = ({ settings, lang }) => {
  const leftTitle = lang === 'he' && settings.left_title_he ? settings.left_title_he : settings.left_title_en;
  const rightTitle = lang === 'he' && settings.right_title_he ? settings.right_title_he : settings.right_title_en;

  return (
    <div 
      className="w-full flex flex-col md:flex-row relative overflow-hidden"
      style={{ height: settings.hero_height }}
    >
      {/* Left Side */}
      <div className="w-full md:w-1/2 relative bg-zinc-900 h-1/2 md:h-full">
        <LazyImage 
          src={settings.left_image_url}
          alt="Hero Left" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pb-20 md:pb-32">
          <h2 className="text-white text-2xl md:text-4xl font-medium max-w-md leading-tight">
            {leftTitle}
          </h2>
        </div>

        {settings.show_pagination && (
          <div className="absolute bottom-8 left-8 md:left-12 flex gap-3">
            <button className="w-2.5 h-2.5 rounded-full bg-white border border-white" />
            <button className="w-2.5 h-2.5 rounded-full border border-white/60 hover:bg-white/40 transition-colors" />
            <button className="w-2.5 h-2.5 rounded-full border border-white/60 hover:bg-white/40 transition-colors" />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 relative bg-purple-900 h-1/2 md:h-full overflow-hidden">
        <LazyImage 
          src={settings.right_image_url}
          alt="Hero Right" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pb-20 md:pb-32">
          <Link 
            to={settings.right_link || '/'}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-bold flex items-center gap-4 group cursor-pointer"
          >
            {rightTitle}
            <ArrowRight className="w-8 h-8 md:w-12 md:h-12 mt-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ABOUT SECTION
// =============================================================================

interface AboutSectionProps {
  settings: HomepageSettings['about_section'];
  lang: 'en' | 'he';
}

const AboutSection: React.FC<AboutSectionProps> = ({ settings, lang }) => {
  const navigate = useNavigate();
  const title = lang === 'he' && settings.title_he ? settings.title_he : settings.title_en;
  const description = lang === 'he' && settings.description_he ? settings.description_he : settings.description_en;
  const buttonText = lang === 'he' && settings.button_text_he ? settings.button_text_he : settings.button_text_en;
  
  return (
    <section className="relative w-full min-h-[500px] flex md:pt-12">
      <div 
        className="relative z-10 flex-1 rounded-tl-[80px] md:rounded-tl-[160px] ml-8 md:ml-48 mt-0 flex flex-col justify-center px-8 md:px-24 py-16 shadow-2xl"
        style={{ backgroundColor: settings.background_color }}
      >
        <div className="max-w-3xl">
          <h2 
            className="text-3xl md:text-4xl font-normal mb-8 tracking-tight"
            style={{ color: settings.text_color }}
          >
            {title}
          </h2>
          
          <p className="text-gray-900 text-xl md:text-2xl font-light leading-relaxed mb-12 max-w-2xl">
            {description}
          </p>
          
          <button 
            onClick={() => navigate(settings.button_link)}
            className="text-white px-8 py-3.5 rounded-md font-semibold hover:opacity-90 transition-colors inline-block text-sm tracking-wide"
            style={{ backgroundColor: settings.text_color }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// MAIN HOME PAGE
// =============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [settings, setSettings] = useState<HomepageSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lang = getCurrentLang();

  // Load all data in parallel
  useEffect(() => {
    const loadData = async () => {
      try {
        // Parallel fetch for better performance
        const [servicesData, storiesData, settingsData] = await Promise.all([
          getServices(),
          getStories(),
          supabase.from('homepage_settings').select('*'),
        ]);

        setServices(servicesData);
        setStories(storiesData);

        // Parse settings
        if (settingsData.data && settingsData.data.length > 0) {
          const newSettings = { ...DEFAULT_SETTINGS };
          settingsData.data.forEach((row: { section: string; settings: any }) => {
            if (row.section in newSettings) {
              (newSettings as any)[row.section] = { 
                ...(DEFAULT_SETTINGS as any)[row.section], 
                ...row.settings 
              };
            }
          });
          setSettings(newSettings);
        }
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleServiceClick = (service: Service) => {
    navigate(ROUTES.SERVICE(service.slug));
  };

  // Get localized text
  const servicesTitle = lang === 'he' && settings.services_section.title_he 
    ? settings.services_section.title_he 
    : settings.services_section.title_en;
  
  const storiesTitle = lang === 'he' && settings.stories_section.title_he
    ? settings.stories_section.title_he
    : settings.stories_section.title_en;
  
  const storiesButtonText = lang === 'he' && settings.stories_section.button_text_he
    ? settings.stories_section.button_text_he
    : settings.stories_section.button_text_en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005f5f]" />
      </div>
    );
  }

  return (
    <>
      {/* 1. Hero Block */}
      <HeroSection settings={settings.hero} lang={lang} />

      {/* 2. Services Section */}
      <section 
        className="w-full bg-[#EAEAEA]"
        style={{ paddingTop: `${Number(settings.services_section.padding_y) * 4}px`, paddingBottom: `${Number(settings.services_section.padding_y) * 4}px` }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-12"
            style={{ color: settings.layout.primary_color }}
          >
            {servicesTitle}
          </h2>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: `${Number(settings.services_section.card_gap) * 4}px` }}
          >
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => handleServiceClick(service)}
                showDescription={settings.services_section.show_descriptions}
                aspectRatio={settings.services_section.card_aspect_ratio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stories & About Container */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: settings.layout.background_dark }}
      >
        {/* Background Texture */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundColor: settings.layout.background_dark }} />
          <div className="absolute -left-16 -top-40 h-[200%] w-64 transform -skew-x-[20deg]" style={{ backgroundColor: settings.layout.primary_color }} />
          <div className="absolute left-32 -top-40 h-[200%] w-40 transform -skew-x-[20deg] opacity-60" style={{ backgroundColor: settings.layout.secondary_color }} />
        </div>

        {/* Stories Section */}
        <section 
          className="relative z-10 w-full text-white"
          style={{ paddingTop: `${Number(settings.stories_section.padding_y) * 4}px`, paddingBottom: `${Number(settings.stories_section.padding_y) * 4}px` }}
        >
          <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {storiesTitle}
              </h1>

              <div className="flex gap-4">
                {settings.stories_section.show_generate_button && (
                  <button className="px-6 py-2 rounded-lg border border-teal-300/50 flex items-center gap-2 transition-all duration-300 hover:bg-white/10">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">See more</span>
                  </button>
                )}

                <button 
                  onClick={() => navigate(settings.stories_section.button_link)}
                  className="px-8 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-[#005f5f] transition-colors duration-300 text-sm font-medium"
                >
                  {storiesButtonText}
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="relative w-full">
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto no-scrollbar pb-10 px-4 -mx-4 scroll-smooth"
                style={{ gap: `${Number(settings.stories_section.card_gap) * 4}px` }}
              >
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
                <div className="w-12 flex-shrink-0" />
              </div>

              {/* Navigation Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-[80%] z-10 hidden md:block">
                <button 
                  onClick={scrollRight}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <ArrowRight className="w-6 h-6" style={{ color: settings.layout.primary_color }} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <AboutSection settings={settings.about_section} lang={lang} />
      </div>
    </>
  );
};
