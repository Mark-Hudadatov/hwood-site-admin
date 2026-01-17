/**
 * PORTFOLIO PAGE - HWOOD
 * ======================
 * Recent projects and news
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Filter } from 'lucide-react';
import { getStories } from '../services/data/dataService';
import { Story } from '../domain/types';

export const PortfolioPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<'all' | 'EVENTS' | 'CUSTOMER STORY'>('all');

  useEffect(() => {
    const loadStories = async () => {
      const data = await getStories();
      setStories(data);
    };
    loadStories();
  }, []);

  const filteredStories = filter === 'all' 
    ? stories 
    : stories.filter(s => s.type === filter);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-[#005f5f] text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Projects & News
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Explore our latest projects, customer success stories, and company updates.
          </p>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-1/4 h-full bg-[#004d4d] -skew-x-12 origin-top-right opacity-50" />
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'CUSTOMER STORY', label: 'Projects' },
                { value: 'EVENTS', label: 'News & Events' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value as typeof filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === item.value
                      ? 'bg-[#005f5f] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item.label}
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
            {filteredStories.map((story) => (
              <article 
                key={story.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      story.type === 'EVENTS' 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {story.type === 'EVENTS' ? 'News' : 'Project'}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {story.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#005f5f] transition-colors">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[#005f5f] font-medium">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))}
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Want to Be Featured?
          </h2>
          <p className="text-gray-600 mb-8">
            We love showcasing successful projects. If you're a satisfied customer, 
            we'd love to hear your story.
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
