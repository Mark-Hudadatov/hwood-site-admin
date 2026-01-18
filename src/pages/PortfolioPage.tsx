/**
 * PORTFOLIO PAGE - FIXED
 * ======================
 * ✅ Stories are clickable links
 * ✅ Coming Soon overlay for visibility_status='coming_soon'
 * ✅ Fetches directly from Supabase to get visibility_status
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Filter, Clock } from 'lucide-react';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop';

interface StoryWithStatus {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  imageUrl: string;
  excerpt?: string;
  visibilityStatus: 'visible' | 'coming_soon' | 'hidden';
}

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

export const PortfolioPage: React.FC = () => {
  const [stories, setStories] = useState<StoryWithStatus[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [storyTypes, setStoryTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        // Fetch ALL stories including coming_soon (exclude only hidden)
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false });

        console.log('[PortfolioPage] Raw stories:', data);

        if (data) {
          const lang = getCurrentLang();
          const mapped: StoryWithStatus[] = data
            .filter((s: any) => {
              // Determine visibility - check both visibility_status and is_visible
              const status = s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden');
              return status === 'visible' || status === 'coming_soon';
            })
            .map((s: any) => ({
              id: s.id,
              slug: s.slug,
              title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
              date: formatDate(s.date),
              type: s.type || 'EVENTS',
              imageUrl: s.image_url || '',
              excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en,
              visibilityStatus: s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden'),
            }));
          
          console.log('[PortfolioPage] Mapped stories:', mapped);
          setStories(mapped);
          
          // Get unique types
          const types = [...new Set(mapped.map(s => s.type).filter(Boolean))];
          setStoryTypes(types);
        }
      } catch (e) {
        console.error('[PortfolioPage] Error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const filteredStories = filter === 'all' 
    ? stories 
    : stories.filter(s => s.type === filter);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EVENTS': return 'News & Events';
      case 'CUSTOMER STORY': return 'Projects';
      default: return type;
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'EVENTS': return 'bg-blue-100 text-blue-700';
      case 'CUSTOMER STORY': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#005f5f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-[#005f5f] text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects & News</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Explore our latest projects, customer success stories, and company updates.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-1/4 h-full bg-[#004d4d] -skew-x-12 origin-top-right opacity-50" />
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === 'all' ? 'bg-[#005f5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {storyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === type ? 'bg-[#005f5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => {
              const isComingSoon = story.visibilityStatus === 'coming_soon';
              
              const cardContent = (
                <article className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 h-full ${
                  isComingSoon ? '' : 'hover:shadow-xl group cursor-pointer'
                }`}>
                  {/* Image with Coming Soon overlay */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={story.imageUrl || FALLBACK_IMAGE}
                      alt={story.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isComingSoon ? 'grayscale brightness-75' : 'group-hover:scale-110'
                      }`}
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    
                    {/* Coming Soon Overlay */}
                    {isComingSoon && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                        <Clock className="w-12 h-12 text-white mb-3" />
                        <span className="text-white text-xl font-bold uppercase tracking-wider">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getTypeBadgeStyle(story.type)}`}>
                        {story.type === 'EVENTS' ? 'News' : story.type === 'CUSTOMER STORY' ? 'Project' : story.type}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {story.date}
                      </div>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 transition-colors ${
                      isComingSoon ? 'text-gray-500' : 'text-gray-900 group-hover:text-[#005f5f]'
                    }`}>
                      {story.title}
                    </h3>
                    
                    {story.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{story.excerpt}</p>
                    )}
                    
                    {!isComingSoon && (
                      <div className="flex items-center gap-2 text-[#005f5f] font-medium">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </article>
              );

              // Coming soon - not clickable
              if (isComingSoon) {
                return <div key={story.id}>{cardContent}</div>;
              }

              // Visible - clickable link
              return (
                <Link key={story.id} to={ROUTES.STORY(story.slug || story.id)} className="block">
                  {cardContent}
                </Link>
              );
            })}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No stories found for this filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Want to Be Featured?</h2>
          <p className="text-gray-600 mb-8">
            We love showcasing successful projects. If you're a satisfied customer, we'd love to hear your story.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#005f5f] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#004d4d] transition-colors"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

