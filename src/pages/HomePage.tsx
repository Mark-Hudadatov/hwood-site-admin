/**
 * HOME PAGE - WITH COMING SOON SUPPORT
 * =====================================
 * ✅ Services with Coming Soon overlay
 * ✅ Stories with Coming Soon overlay
 * ✅ Direct image tags (no complex wrappers)
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, Clock } from 'lucide-react';
import { Service, Story } from '../domain/types';
import { getServices, getStories } from '../services/data/dataService';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';
import { ScrollReveal, StaggerReveal } from '../components/premium';

// =============================================================================
// CONSTANTS
// =============================================================================

const FALLBACK = {
  service: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop',
  story: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=1000&fit=crop',
  hero: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop',
};

const PARTNER_NAMES = ['Biesse', 'Homag', 'Blum', 'Hettich', 'Grass', 'Festool'];

// =============================================================================
// TYPES
// =============================================================================

interface ServiceWithStatus extends Service {
  visibilityStatus?: string;
}

interface StoryWithStatus extends Story {
  visibilityStatus?: string;
}

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
  };
  services_section: {
    title_en: string;
    title_he: string;
    show_descriptions: boolean;
  };
  stories_section: {
    title_en: string;
    title_he: string;
    button_text_en: string;
    button_text_he: string;
    button_link: string;
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
  };
}

const DEFAULT_SETTINGS: HomepageSettings = {
  hero: {
    left_image_url: FALLBACK.hero,
    left_video_url: '',
    left_title_en: 'Industrial Carpentry Systems',
    left_title_he: 'מערכות נגרות תעשייתיות',
    left_subtitle_en: 'CNC production systems for construction, architecture, and manufacturing',
    left_subtitle_he: '',
    right_image_url: FALLBACK.hero,
    right_title_en: 'Modular Cabinet Systems',
    right_title_he: '',
    right_link: '/services/modular-cabinet-systems',
    hero_height: '100vh',
  },
  services_section: { title_en: 'Production Systems', title_he: 'מערכות ייצור', show_descriptions: true },
  stories_section: { title_en: 'Projects', title_he: 'פרויקטים', button_text_en: 'View all projects', button_text_he: '', button_link: '/portfolio' },
  about_section: { title_en: 'HWOOD', title_he: '', description_en: 'Industrial-grade carpentry and CNC production facility serving construction, architecture, and manufacturing sectors in Israel.', description_he: '', button_text_en: 'About Facility', button_text_he: '', button_link: '/about', background_color: '#EAEAEA', text_color: '#005f5f' },
  layout: { primary_color: '#005f5f', secondary_color: '#004d4d', background_dark: '#002828' },
};

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

// =============================================================================
// COMING SOON OVERLAY
// =============================================================================

const ComingSoonOverlay: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
      <Clock className={`${iconSize} text-white mb-2`} />
      <span className={`text-white ${textSize} font-medium uppercase tracking-wider`}>Coming Soon</span>
    </div>
  );
};

// =============================================================================
// PARTNERS SECTION
// =============================================================================

const PartnersSection: React.FC = () => (
  <section className="w-full bg-white py-8 md:py-12 overflow-hidden border-b border-neutral-100">
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="flex animate-marquee">
        {[...PARTNER_NAMES, ...PARTNER_NAMES, ...PARTNER_NAMES].map((name, i) => (
          <span key={i} className="flex-shrink-0 mx-8 md:mx-16 text-h2 text-neutral-300 hover:text-neutral-500 transition-colors tracking-wide uppercase whitespace-nowrap">
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

// =============================================================================
// SERVICE CARD WITH COMING SOON
// =============================================================================

const ServiceCard: React.FC<{
  service: ServiceWithStatus;
  onClick: () => void;
  showDescription: boolean;
}> = ({ service, onClick, showDescription }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isComingSoon = service.visibilityStatus === 'coming_soon';
  const imgSrc = service.imageUrl || FALLBACK.service;

  return (
    <div 
      className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg ${isComingSoon ? '' : 'cursor-pointer group'}`}
      onClick={isComingSoon ? undefined : onClick}
      onMouseEnter={() => !isComingSoon && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imgSrc}
        alt={service.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
          isComingSoon ? 'grayscale brightness-75' : isHovered ? 'scale-105' : 'scale-100'
        }`}
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.service; }}
      />
      
      {isComingSoon && <ComingSoonOverlay />}
      
      <div className={`absolute inset-0 transition-all duration-300 ${
        isComingSoon ? 'bg-black/20' :
        isHovered ? 'bg-gradient-to-t from-brand via-brand/60 to-brand/20' 
                  : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
      }`} />

      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className={`text-white text-h2 mb-3 transition-transform duration-300 ${
          isComingSoon ? 'opacity-70' : isHovered ? '-translate-y-1' : ''
        }`}>
          {service.title}
        </h3>
        {showDescription && !isComingSoon && (
          <p className="text-white/80 text-body leading-relaxed line-clamp-3">
            {service.description}
          </p>
        )}
        {!isComingSoon && (
          <div className={`flex items-center gap-2 mt-4 text-white/80 text-meta transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span>View System</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/80 transition-all duration-300" style={{ width: isHovered ? '100%' : '0%' }} />
      )}
    </div>
  );
};

// =============================================================================
// STORY CARD WITH COMING SOON
// =============================================================================

const StoryCard: React.FC<{ story: StoryWithStatus }> = ({ story }) => {
  const isComingSoon = story.visibilityStatus === 'coming_soon';
  const imgSrc = story.imageUrl || FALLBACK.story;

  const content = (
    <div className={`flex-shrink-0 w-[280px] md:w-[320px] flex flex-col items-center ${isComingSoon ? '' : 'group cursor-pointer'} transition-transform duration-300 ${isComingSoon ? '' : 'hover:-translate-y-1'}`}>
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl shadow-lg mb-6">
        <img
          src={imgSrc}
          alt={story.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
            isComingSoon ? 'grayscale brightness-75' : 'group-hover:scale-105'
          }`}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.story; }}
        />
        {isComingSoon && <ComingSoonOverlay />}
        {!isComingSoon && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>

      <div className="mb-4 px-4 py-1 rounded-full border border-white/30 bg-brand/80 text-white text-meta-sm tracking-wider uppercase">
        {story.type}
      </div>

      <h3 className={`text-body-lg font-medium text-center leading-tight mb-3 px-2 line-clamp-3 transition-colors duration-300 ${
        isComingSoon ? 'text-white/60' : 'text-white group-hover:text-neutral-200'
      }`}>
        {story.title}
      </h3>

      <div className="text-white/70 text-meta">{story.date}</div>
    </div>
  );

  if (isComingSoon) {
    return content;
  }

  return (
    <Link to={ROUTES.STORY(story.slug || story.id)}>
      {content}
    </Link>
  );
};

// =============================================================================
// HERO SECTION
// =============================================================================

const HeroSection: React.FC<{ settings: HomepageSettings['hero']; lang: 'en' | 'he' }> = ({ settings, lang }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const leftTitle = lang === 'he' && settings.left_title_he ? settings.left_title_he : settings.left_title_en;
  const leftSubtitle = lang === 'he' && settings.left_subtitle_he ? settings.left_subtitle_he : settings.left_subtitle_en || '';
  const rightTitle = lang === 'he' && settings.right_title_he ? settings.right_title_he : settings.right_title_en;
  const leftImg = settings.left_image_url || FALLBACK.hero;
  const rightImg = settings.right_image_url || FALLBACK.hero;

  useEffect(() => { setTimeout(() => setIsVisible(true), 100); }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: settings.hero_height, minHeight: '600px' }}>
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
          {settings.left_video_url ? (
            <video ref={videoRef} autoPlay loop muted playsInline preload="auto" poster="" className="absolute inset-0 w-full h-full object-cover">
              <source src={settings.left_video_url} type="video/mp4" />
            </video>
          ) : (
            <img src={leftImg} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.hero; }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pb-24 md:pb-32">
            <h1 className={`text-white text-display-sm md:text-display mb-4 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>{leftTitle}</h1>
            {leftSubtitle && <p className={`text-white/70 text-body-lg max-w-lg transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '200ms' }}>{leftSubtitle}</p>}
          </div>
          {settings.left_video_url && (
            <button onClick={toggleVideo} className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          )}
        </div>

        {/* Right Panel */}
        <Link to={settings.right_link || '/'} className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group">
          <img src={rightImg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.hero; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pb-24 md:pb-32">
            <div className="flex items-end gap-4">
              <h2 className={`text-white text-h1 md:text-display-sm transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>{rightTitle}</h2>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-brand transition-colors" />
              </div>
            </div>
            <span className="text-white/50 text-meta mt-4 tracking-wide uppercase group-hover:text-white/70 transition-colors">View Systems →</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

// =============================================================================
// ABOUT SECTION
// =============================================================================

const AboutSection: React.FC<{ settings: HomepageSettings['about_section']; lang: 'en' | 'he' }> = ({ settings, lang }) => {
  const navigate = useNavigate();
  const title = lang === 'he' && settings.title_he ? settings.title_he : settings.title_en;
  const description = lang === 'he' && settings.description_he ? settings.description_he : settings.description_en;
  const buttonText = lang === 'he' && settings.button_text_he ? settings.button_text_he : settings.button_text_en;

  return (
    <section className="relative w-full min-h-[500px] flex md:pt-12">
      <div className="relative z-10 flex-1 rounded-tl-[60px] md:rounded-tl-[100px] ml-8 md:ml-48 flex flex-col justify-center px-8 md:px-24 py-16 shadow-xl" style={{ backgroundColor: settings.background_color }}>
        <h2 className="text-display-sm font-medium mb-8" style={{ color: settings.text_color }}>{title}</h2>
        <p className="text-neutral-700 text-body-lg leading-relaxed mb-12 max-w-2xl">{description}</p>
        <button onClick={() => navigate(settings.button_link)} className="text-white px-8 py-3 rounded font-medium text-meta tracking-wide self-start hover:opacity-90 transition-opacity" style={{ backgroundColor: settings.text_color }}>
          {buttonText}
        </button>
      </div>
    </section>
  );
};

// =============================================================================
// MAIN HOME PAGE
// =============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceWithStatus[]>([]);
  const [stories, setStories] = useState<StoryWithStatus[]>([]);
  const [settings, setSettings] = useState<HomepageSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const storiesScrollRef = useRef<HTMLDivElement>(null);
  const lang = getCurrentLang();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch services with visibility_status
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .in('visibility_status', ['visible', 'coming_soon'])
          .order('sort_order', { ascending: true });

        if (servicesData) {
          const mapped = servicesData.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
            imageUrl: s.image_url || '',
            heroImageUrl: s.hero_image_url,
            accentColor: s.accent_color,
            visibilityStatus: s.visibility_status,
          }));
          setServices(mapped);
        }

        // Fetch stories with visibility_status
        const { data: storiesData } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false });

        if (storiesData) {
          const mapped = storiesData
            .filter((s: any) => {
              const status = s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden');
              return status === 'visible' || status === 'coming_soon';
            })
            .map((s: any) => ({
              id: s.id,
              slug: s.slug,
              title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
              date: new Date(s.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
              type: s.type || 'EVENTS',
              imageUrl: s.image_url || '',
              excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en,
              visibilityStatus: s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden'),
            }));
          setStories(mapped.slice(0, 6));
        }

        // Load settings
        const { data: settingsData } = await supabase.from('homepage_settings').select('*');
        if (settingsData && settingsData.length > 0) {
          const newSettings = { ...DEFAULT_SETTINGS };
          settingsData.forEach((row: { section: string; settings: any }) => {
            if (row.section in newSettings) {
              (newSettings as any)[row.section] = { ...(DEFAULT_SETTINGS as any)[row.section], ...row.settings };
            }
          });
          setSettings(newSettings);
        }
      } catch (error) {
        console.error('[HomePage] Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lang]);

  const scrollStories = (direction: 'left' | 'right') => {
    storiesScrollRef.current?.scrollBy({ left: direction === 'right' ? 400 : -400, behavior: 'smooth' });
  };

  const servicesTitle = lang === 'he' && settings.services_section.title_he ? settings.services_section.title_he : settings.services_section.title_en;
  const storiesTitle = lang === 'he' && settings.stories_section.title_he ? settings.stories_section.title_he : settings.stories_section.title_en;
  const storiesButtonText = lang === 'he' && settings.stories_section.button_text_he ? settings.stories_section.button_text_he : settings.stories_section.button_text_en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <HeroSection settings={settings.hero} lang={lang} />
      <PartnersSection />

      {/* Services Section */}
      <section className="w-full bg-[#EAEAEA] py-16 md:py-24">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-display-sm md:text-display tracking-tight mb-12" style={{ color: settings.layout.primary_color }}>{servicesTitle}</h2>
          </ScrollReveal>
          <StaggerReveal 
            animation="fade-up" 
            staggerDelay={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => navigate(ROUTES.SERVICE(service.slug))} 
                showDescription={settings.services_section.show_descriptions} 
              />
            ))}
          </StaggerReveal>
          {services.length === 0 && <p className="text-center py-12 text-neutral-500">No production systems available</p>}
        </div>
      </section>

      {/* Stories & About */}
      <div className="relative w-full overflow-hidden" style={{ backgroundColor: settings.layout.background_dark }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-16 -top-40 h-[200%] w-64 transform -skew-x-[20deg] opacity-30" style={{ backgroundColor: settings.layout.primary_color }} />
        </div>

        <section className="relative z-10 w-full text-white py-16 md:py-24">
          <div className="w-full px-8 md:px-12 lg:px-16">
            <ScrollReveal animation="fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
                <h2 className="text-display-sm tracking-tight">{storiesTitle}</h2>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex gap-2">
                    <button onClick={() => scrollStories('left')} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => scrollStories('right')} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <button onClick={() => navigate(settings.stories_section.button_link)} className="px-8 py-2 rounded border border-white text-white text-meta font-medium hover:bg-white hover:text-brand transition-all">
                    {storiesButtonText}
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <div ref={storiesScrollRef} className="flex overflow-x-auto no-scrollbar pb-10 scroll-smooth snap-x snap-mandatory gap-8">
              {stories.map((story) => (
                <div key={story.id} className="snap-start"><StoryCard story={story} /></div>
              ))}
              <div className="w-12 flex-shrink-0" />
            </div>
            {stories.length === 0 && <p className="text-center py-12 text-white/50">No projects available</p>}
          </div>
        </section>

        <AboutSection settings={settings.about_section} lang={lang} />
      </div>
    </>
  );
};
