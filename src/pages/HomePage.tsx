/**
 * HOME PAGE
 * =========
 * Landing page showing:
 * 1. Hero section (split layout)
 * 2. Services grid (Our Services)
 * 3. What's Next (stories carousel)
 * 4. About HWOOD section
 * 
 * Note: Header and Footer are handled by MainLayout
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Service, Story } from '../domain/types';
import { getServices, getStories, getHeroSlides, getCompanyInfo} from '../services/data/dataService';
import { HeroSlide } from '../services/data/mockData';
import { ROUTES } from '../router';

// =============================================================================
// SERVICE CARD COMPONENT
// =============================================================================

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
      className="relative w-full aspect-[3/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={service.imageUrl}
        alt={service.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-wide">
          {service.title}
        </h3>
        <p className="text-white/90 text-sm md:text-base leading-relaxed font-light line-clamp-3">
          {service.description}
        </p>
      </div>

      {/* Accent Bottom Strip */}
      <div 
        className="absolute bottom-0 left-0 w-full h-3" 
        style={{ backgroundColor: service.accentColor || '#005f5f' }}
      />
    </div>
  );
};

// =============================================================================
//  CARD COMPONENT
// =============================================================================

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[360px] flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1">

      {/* Image Wrapper — фиксированная область */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[3rem] shadow-lg mb-6">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Pill */}
      <div className="mb-4 px-4 py-1 rounded-full border border-white/30 bg-[#004D4D] text-white text-[10px] md:text-xs font-semibold tracking-wider uppercase">
        {story.type}
      </div>

      {/* Title */}
      <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight mb-3 px-2 line-clamp-3">
        {story.title}
      </h3>

      {/* Date */}
      <div className="text-white/80 text-sm font-medium">
        {story.date}
      </div>
    </div>
  );
};

// =============================================================================
// ABOUT HWOOD SECTION
// =============================================================================

const AboutHWOOD: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative w-full min-h-[500px] flex md:pt-12">
      {/* Main Content Card */}
      <div className="relative z-10 flex-1 bg-[#EAEAEA] rounded-tl-[80px] md:rounded-tl-[160px] ml-8 md:ml-48 mt-0 flex flex-col justify-center px-8 md:px-24 py-16 shadow-2xl">
        <div className="max-w-3xl">
          <h2 className="text-[#005f5f] text-3xl md:text-4xl font-normal mb-8 tracking-tight">
            About HWOOD
          </h2>
          
          <p className="text-gray-900 text-xl md:text-2xl font-light leading-relaxed mb-12 max-w-2xl">
            We are modern production powerhouse delivering modular cabinet systems, CNC processing, and premium furniture fronts for residential and commercial projects.
          </p>
          
          <button 
            onClick={() => navigate('/about')}
            className="bg-[#005f5f] text-white px-8 py-3.5 rounded-md font-semibold hover:bg-[#004d4d] transition-colors inline-block text-sm tracking-wide"
          >
            Discover HWOOD
          </button>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// HERO SECTION
// =============================================================================

const HeroSection: React.FC = () => {
  return (
    <div className="w-full h-[70vh] md:h-[80vh] flex flex-col md:flex-row relative overflow-hidden">
      {/* Left Side: Industrial Dark */}
      <div className="w-full md:w-1/2 relative bg-zinc-900 h-1/2 md:h-full">
        <img 
          src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45f7?auto=format&fit=crop&q=80&w=1600" 
          alt="CNC Machine Detail" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pb-20 md:pb-32">
          <h2 className="text-white text-2xl md:text-4xl font-medium max-w-md leading-tight">
            Engineered for kitchens, bathrooms, and storage rooms
          </h2>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-8 md:left-12 flex gap-3">
          <button className="w-2.5 h-2.5 rounded-full bg-white border border-white" />
          <button className="w-2.5 h-2.5 rounded-full border border-white/60 hover:bg-white/40 transition-colors" />
          <button className="w-2.5 h-2.5 rounded-full border border-white/60 hover:bg-white/40 transition-colors" />
        </div>
      </div>

      {/* Right Side: Purple Abstract */}
      <div className="w-full md:w-1/2 relative bg-purple-900 h-1/2 md:h-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1600" 
          alt="Polymers Structure" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pb-20 md:pb-32">
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold flex items-center gap-4 group cursor-pointer">
            Modular Cabinet Systems
            <ArrowRight className="w-8 h-8 md:w-12 md:h-12 mt-2 group-hover:translate-x-2 transition-transform" />
          </h2>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN HOME PAGE COMPONENT
// =============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const [servicesData, storiesData] = await Promise.all([
        getServices(),
        getStories(),
      ]);
      setServices(servicesData);
      setStories(storiesData);
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

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    // Simulate AI generation (integrate your geminiService if needed)
    setTimeout(() => {
      const newStory: Story = {
        id: Date.now().toString(),
        title: 'HWOOD Conference Stand',
        date: new Date().toLocaleDateString(),
        type: 'EVENTS',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        isGenerated: true,
      };
      setStories(prev => [...prev, newStory]);
      setIsGenerating(false);
      
      // Auto scroll to new item
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ 
            left: scrollContainerRef.current.scrollWidth,
            behavior: 'smooth' 
          });
        }
      }, 100);
    }, 1500);
  };

  return (
    <>
      {/* 1. Hero Block */}
      <HeroSection />

      {/* 2. Our Services (Light Grey Background) */}
      <section className="w-full bg-[#EAEAEA] py-16 md:py-20 lg:py-24">
        <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col">
          <h2 className="text-[#005f5f] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-12">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SHARED BACKGROUND CONTAINER FOR: WHAT'S NEXT, ABOUT HWOOD */}
      <div className="relative w-full bg-[#002828] overflow-hidden">
        {/* Background Texture Elements */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#001f1f]" />
          <div className="absolute -left-16 -top-40 h-[200%] w-64 bg-[#004D4D] transform -skew-x-[20deg]" />
          <div className="absolute left-32 -top-40 h-[200%] w-40 bg-[#005f5f] transform -skew-x-[20deg] opacity-60" />
          <div className="absolute left-80 -top-40 h-[200%] w-24 bg-[#003f3f] transform -skew-x-[20deg] opacity-40" />
          <div className="absolute left-[28rem] -top-40 h-[200%] w-12 bg-[#004D4D] transform -skew-x-[20deg] opacity-20" />
        </div>

        {/* 3. Recent Projects and News */}
        <section className="relative z-10 w-full text-white py-16 md:py-20 lg:py-24">
          <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Recent Projects and News
              </h1>

              <div className="flex gap-4">
                {/* Gemini Generation Button */}
                <button 
                  onClick={handleGenerateStory}
                  disabled={isGenerating}
                  className={`
                    px-6 py-2 rounded-lg border border-teal-300/50 flex items-center gap-2
                    transition-all duration-300 hover:bg-white/10
                    ${isGenerating ? 'opacity-50 cursor-wait' : ''}
                  `}
                >
                  <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">
                    {isGenerating ? 'HWOOD' : 'See more'}
                  </span>
                </button>

                {/* See all Button */}
                <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-8 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-[#005f5f] transition-colors duration-300 text-sm font-medium"
                >
                  See all
                </button>
              </div>
            </div>

            {/* Carousel Section */}
            <div className="relative w-full">
              <div 
                ref={scrollContainerRef}
                className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar pb-10 px-4 -mx-4 scroll-smooth"
              >
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
                <div className="w-12 flex-shrink-0" />
              </div>

              {/* Floating Navigation Arrow (Right) */}
              <div className="absolute right-0 top-1/2 -translate-y-[80%] z-10 hidden md:block">
                <button 
                  onClick={scrollRight}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ArrowRight className="w-6 h-6 text-[#005f5f]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. About HWOOD */}
        <AboutHWOOD />
      </div>
    </>
  );
};
