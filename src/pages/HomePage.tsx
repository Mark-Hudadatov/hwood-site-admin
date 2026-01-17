/**
 * HOME PAGE - PREMIUM EDITION
 * ===========================
 * UPGRADES:
 * ✅ Video background support (with image fallback)
 * ✅ Staggered text animations (Biesse-style)
 * ✅ Partners marquee section
 * ✅ Navigation arrows for carousels
 * ✅ Stories are now clickable links
 * ✅ AI "See more" button REMOVED
 * ✅ Premium loading screen
 * ✅ Floating action buttons
 * ✅ Scroll indicator
 * ✅ Hover effects upgraded
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Phone, Play, Pause } from 'lucide-react';
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
    left_video_url?: string;
    left_title_en: string;
    left_title_he: string;
    left_subtitle_en?: string;
    left_subtitle_he?: string;
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

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  sort_order: number;
}

// Default settings (fallback)
const DEFAULT_SETTINGS: HomepageSettings = {
  hero: {
    left_image_url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45f7?auto=format&fit=crop&q=80&w=1600',
    left_video_url: '',
    left_title_en: 'Precision Crafted',
    left_title_he: 'מיוצר בדיוק',
    left_subtitle_en: 'Industrial carpentry solutions engineered for excellence',
    left_subtitle_he: 'פתרונות נגרות תעשייתית מתוכננים למצוינות',
    right_image_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1600',
    right_title_en: 'Modular Cabinet Systems',
    right_title_he: 'מערכות ארונות מודולריות',
    right_link: '/services/modular-cabinet-systems',
    hero_height: '100vh',
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
    show_generate_button: false, // DISABLED by default
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

// Default partners (placeholders)
const DEFAULT_PARTNERS: Partner[] = [
  { id: '1', name: 'Biesse', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Biesse_logo.svg/200px-Biesse_logo.svg.png', sort_order: 1 },
  { id: '2', name: 'Siemens', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/200px-Siemens-logo.svg.png', sort_order: 2 },
  { id: '3', name: 'Bosch', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/200px-Bosch-logo.svg.png', sort_order: 3 },
  { id: '4', name: 'Festool', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Festool_logo.svg/200px-Festool_logo.svg.png', sort_order: 4 },
  { id: '5', name: 'Blum', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Blum_Logo.svg/200px-Blum_Logo.svg.png', sort_order: 5 },
];

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
  eager?: boolean;
}> = ({ src, alt, className, eager = false }) => {
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
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
};

// =============================================================================
// PARTNERS MARQUEE SECTION - NEW
// =============================================================================

const PartnersSection: React.FC<{ partners: Partner[] }> = ({ partners }) => {
  const triplePartners = [...partners, ...partners, ...partners];

  return (
    <section className="w-full bg-white py-8 md:py-12 overflow-hidden border-b border-gray-100">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div className="flex animate-marquee hover:pause">
          {triplePartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
            >
              <img
                src={partner.logo_url}
                alt={partner.name}
                className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// SERVICE CARD COMPONENT - UPGRADED
// =============================================================================

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  showDescription: boolean;
  aspectRatio: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, showDescription, aspectRatio }) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-lg cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LazyImage
        src={service.imageUrl}
        alt={service.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
      />
      
      {/* Gradient - changes on hover */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isHovered 
          ? 'bg-gradient-to-t from-[#005f5f] via-[#005f5f]/70 to-[#005f5f]/30' 
          : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
      }`} />

      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className={`text-white text-2xl md:text-3xl font-bold mb-3 tracking-wide transition-transform duration-500 ${isHovered ? '-translate-y-2' : ''}`}>
          {service.title}
        </h3>
        {showDescription && (
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-light line-clamp-3">
            {service.description}
          </p>
        )}
        
        {/* Explore link - appears on hover */}
        <div className={`flex items-center gap-2 mt-4 text-white/90 text-sm font-medium transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom accent line - animates on hover */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-white/80 transition-all duration-500"
        style={{ width: isHovered ? '100%' : '0%' }}
      />
    </div>
  );
};

// =============================================================================
// STORY CARD COMPONENT - NOW WITH LINK
// =============================================================================

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <Link 
      to={ROUTES.STORY(story.slug || story.id)}
      className="flex-shrink-0 w-[300px] md:w-[360px] flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[3rem] shadow-lg mb-6">
        <LazyImage
          src={story.imageUrl}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="mb-4 px-4 py-1 rounded-full border border-white/30 bg-[#004D4D] text-white text-[10px] md:text-xs font-semibold tracking-wider uppercase">
        {story.type}
      </div>

      <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight mb-3 px-2 line-clamp-3 group-hover:text-[#00d4aa] transition-colors duration-300">
        {story.title}
      </h3>

      <div className="text-white/80 text-sm font-medium">
        {story.date}
      </div>
    </Link>
  );
};

// =============================================================================
// HERO SECTION - PREMIUM BIESSE-STYLE
// =============================================================================

interface HeroSectionProps {
  settings: HomepageSettings['hero'];
  lang: 'en' | 'he';
}

const HeroSection: React.FC<HeroSectionProps> = ({ settings, lang }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const leftTitle = lang === 'he' && settings.left_title_he ? settings.left_title_he : settings.left_title_en;
  const leftSubtitle = lang === 'he' && settings.left_subtitle_he ? settings.left_subtitle_he : (settings.left_subtitle_en || '');
  const rightTitle = lang === 'he' && settings.right_title_he ? settings.right_title_he : settings.right_title_en;

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Video play/pause toggle
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-black"
      style={{ height: settings.hero_height, minHeight: '600px' }}
    >
      <div className="absolute inset-0 flex flex-col md:flex-row">
        
        {/* LEFT PANEL */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
          {/* Video Background (if available) */}
          {settings.left_video_url ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  videoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source src={settings.left_video_url} type="video/mp4" />
              </video>
              {!videoLoaded && (
                <img
                  src={settings.left_image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </>
          ) : (
            <img
              src={settings.left_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
            />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Animated Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 pb-24 md:pb-32">
            <h1 
              className={`text-white font-bold leading-[0.95] tracking-tight mb-4 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', transitionDelay: '200ms' }}
            >
              {leftTitle}
            </h1>

            {leftSubtitle && (
              <p 
                className={`text-white/80 text-lg md:text-xl font-light max-w-lg leading-relaxed transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                {leftSubtitle}
              </p>
            )}

            {/* Animated gradient line */}
            <div 
              className={`h-[2px] bg-gradient-to-r from-[#005f5f] via-[#00d4aa] to-transparent mt-8 transition-all duration-1000 ease-out ${
                isVisible ? 'w-32 opacity-100' : 'w-0 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            />
          </div>

          {/* Pagination dots */}
          {settings.show_pagination && (
            <div 
              className={`absolute bottom-8 left-8 md:left-12 flex items-center gap-3 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`transition-all duration-300 rounded-full ${
                    activeSlide === i ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Video control */}
          {settings.left_video_url && videoLoaded && (
            <button
              onClick={toggleVideo}
              className={`absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group cursor-pointer">
          <Link to={settings.right_link || '/'} className="absolute inset-0">
            <img
              src={settings.right_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/70 transition-all duration-500" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 pb-24 md:pb-32">
              <div className="flex items-end gap-4">
                <h2 
                  className={`text-white font-bold leading-[0.95] tracking-tight transition-all duration-1000 ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', transitionDelay: '300ms' }}
                >
                  {rightTitle}
                </h2>

                <div 
                  className={`flex-shrink-0 mb-2 transition-all duration-1000 ease-out ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <ArrowRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-[#005f5f] transition-all duration-500 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              <span 
                className={`text-white/60 text-sm mt-4 tracking-wide uppercase transition-all duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                } group-hover:text-white/90`}
                style={{ transitionDelay: '700ms' }}
              >
                Explore Collection →
              </span>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#005f5f] rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>
        </div>
      </div>

      {/* Floating call button */}
      <div 
        className={`hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-30 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
        style={{ transitionDelay: '1000ms' }}
      >
        <a
          href="tel:+972000000000"
          className="w-14 h-14 rounded-full bg-[#005f5f] flex items-center justify-center text-white shadow-lg hover:bg-[#004d4d] hover:scale-110 transition-all duration-300"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-white/60 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1200ms' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-down" />
        </div>
      </div>
    </section>
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
            className="group relative text-white px-8 py-3.5 rounded-md font-semibold transition-all inline-block text-sm tracking-wide overflow-hidden"
            style={{ backgroundColor: settings.text_color }}
          >
            <span className="relative z-10">{buttonText}</span>
            <div className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  const [settings, setSettings] = useState<HomepageSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  
  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const storiesScrollRef = useRef<HTMLDivElement>(null);
  
  const lang = getCurrentLang();

  // Load all data in parallel
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, storiesData, settingsData, partnersData] = await Promise.all([
          getServices(),
          getStories(),
          supabase.from('homepage_settings').select('*'),
          supabase.from('partners').select('*').order('sort_order'),
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

        // Load partners
        if (partnersData.data && partnersData.data.length > 0) {
          setPartners(partnersData.data);
        }
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Scroll functions
  const scrollServices = (direction: 'left' | 'right') => {
    if (servicesScrollRef.current) {
      const amount = direction === 'right' ? 400 : -400;
      servicesScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollStories = (direction: 'left' | 'right') => {
    if (storiesScrollRef.current) {
      const amount = direction === 'right' ? 400 : -400;
      storiesScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
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

  // PREMIUM LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#005f5f] border-t-transparent rounded-full animate-spin" />
          <span className="text-white/60 text-sm tracking-widest uppercase">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Hero Block - PREMIUM */}
      <HeroSection settings={settings.hero} lang={lang} />

      {/* 2. Partners Section - NEW */}
      <PartnersSection partners={partners} />

      {/* 3. Services Section - WITH ARROWS */}
      <section 
        className="w-full bg-[#EAEAEA]"
        style={{ paddingTop: `${Number(settings.services_section.padding_y) * 4}px`, paddingBottom: `${Number(settings.services_section.padding_y) * 4}px` }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col">
          {/* Header with arrows */}
          <div className="flex items-end justify-between mb-12">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              style={{ color: settings.layout.primary_color }}
            >
              {servicesTitle}
            </h2>

            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scrollServices('left')}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#005f5f] hover:text-[#005f5f] hover:bg-white transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scrollServices('right')}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#005f5f] hover:text-[#005f5f] hover:bg-white transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile swipe hint */}
          <p className="md:hidden text-center text-sm text-gray-400 mb-6">← Swipe to explore →</p>

          {/* Services - horizontal scroll on mobile, grid on desktop */}
          <div 
            ref={servicesScrollRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible no-scrollbar pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory md:snap-none"
          >
            {services.map((service) => (
              <div key={service.id} className="flex-shrink-0 w-[280px] md:w-auto snap-start">
                <ServiceCard 
                  service={service} 
                  onClick={() => handleServiceClick(service)}
                  showDescription={settings.services_section.show_descriptions}
                  aspectRatio={settings.services_section.card_aspect_ratio}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stories & About Container */}
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

        {/* Stories Section - WITH ARROWS */}
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

              <div className="flex items-center gap-4">
                {/* Navigation arrows */}
                <div className="hidden md:flex gap-2">
                  <button 
                    onClick={() => scrollStories('left')}
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => scrollStories('right')}
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* AI button REMOVED - only See all button remains */}
                <button 
                  onClick={() => navigate(settings.stories_section.button_link)}
                  className="group relative px-8 py-2 rounded-lg border border-white text-white overflow-hidden transition-all duration-300"
                >
                  <span className="relative z-10 text-sm font-medium group-hover:text-[#005f5f] transition-colors duration-300">{storiesButtonText}</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="relative w-full">
              <div 
                ref={storiesScrollRef}
                className="flex overflow-x-auto no-scrollbar pb-10 px-4 -mx-4 scroll-smooth snap-x snap-mandatory"
                style={{ gap: `${Number(settings.stories_section.card_gap) * 4}px` }}
              >
                {stories.map((story) => (
                  <div key={story.id} className="snap-start">
                    <StoryCard story={story} />
                  </div>
                ))}
                <div className="w-12 flex-shrink-0" />
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
