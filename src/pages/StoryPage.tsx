/**
 * STORY PAGE
 * ===========
 * Full article view for stories/news
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Story } from '../domain/types';
import { getStoryBySlug, getStories } from '../services/data/dataService';
import { ROUTES } from '../router';

// Simple Markdown renderer
const renderMarkdown = (content: string): string => {
  if (!content) return '';
  
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>)\n(<li)/g, '$1$2')
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside my-4">$1</ul>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#005f5f] hover:underline">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    // Wrap in paragraph
    .replace(/^(.*)$/, '<p class="mb-4">$1</p>');
};

export const StoryPage: React.FC = () => {
  const { storySlug } = useParams<{ storySlug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStory = async () => {
      if (!storySlug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const storyData = await getStoryBySlug(storySlug);
        if (!storyData) {
          setError(true);
        } else {
          setStory(storyData);
          
          // Load related stories (same type, excluding current)
          const allStories = await getStories();
          const related = allStories
            .filter(s => s.type === storyData.type && s.id !== storyData.id)
            .slice(0, 3);
          setRelatedStories(related);
        }
      } catch (e) {
        console.error('Error loading story:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [storySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005f5f]" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-8">The story you're looking for doesn't exist.</p>
          <Link
            to={ROUTES.PORTFOLIO}
            className="px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors"
          >
            View All Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-[#005f5f] text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                {story.type}
              </span>
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="w-4 h-4" />
                {story.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {story.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
            {story.excerpt}
          </p>
        )}

        {story.content ? (
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(story.content) }}
          />
        ) : (
          <p className="text-gray-600">
            Full article content coming soon.
          </p>
        )}
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  to={ROUTES.STORY(relatedStory.slug || relatedStory.id)}
                  className="group"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                    <img
                      src={relatedStory.imageUrl}
                      alt={relatedStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs text-[#005f5f] font-semibold uppercase tracking-wider">
                    {relatedStory.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-[#005f5f] transition-colors">
                    {relatedStory.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{relatedStory.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#005f5f] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-white/80 mb-8">
            Contact us to discuss how HWOOD can help bring your vision to life.
          </p>
          <Link
            to={ROUTES.CONTACT}
            className="inline-block px-8 py-3 bg-white text-[#005f5f] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};
