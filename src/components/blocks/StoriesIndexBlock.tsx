import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { ROUTES } from '../../router';
import type { StoriesIndexData } from '../../domain/types';

interface StoryEntry {
  id: string; slug: string; title: string; date: string;
  type: string; imageUrl: string; excerpt: string;
  visibilityStatus: string;
}

const FALLBACK = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none"><rect width="800" height="600" fill="#1a1a1a"/></svg>')}`;

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '';

interface Props { data: StoriesIndexData; lang: 'en' | 'he'; }

export const StoriesIndexBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe   = lang === 'he';
  const heading = isHe && data.heading_he    ? data.heading_he    : data.heading_en;
  const sub     = isHe && data.subheading_he ? data.subheading_he : data.subheading_en;

  const [stories, setStories]   = useState<StoryEntry[]>([]);
  const [filter,  setFilter]    = useState<string>('all');
  const [types,   setTypes]     = useState<string[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase
      .from('stories')
      .select('*')
      .order('date', { ascending: false })
      .limit(data.limit || 12)
      .then(({ data: rows }) => {
        const mapped: StoryEntry[] = (rows ?? [])
          .filter((s: any) => {
            const st = s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden');
            return st === 'visible' || st === 'coming_soon';
          })
          .map((s: any) => ({
            id: s.id, slug: s.slug,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            date: formatDate(s.date), type: s.type || 'NEWS',
            imageUrl: s.image_url || '',
            excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en || '',
            visibilityStatus: s.visibility_status || 'visible',
          }));
        setStories(mapped);
        setTypes([...new Set(mapped.map(s => s.type).filter(Boolean))]);
        setLoading(false);
      });
  }, [data.limit, lang]);

  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3' };
  const filtered = filter === 'all' ? stories : stories.filter(s => s.type === filter);

  return (
    <section className="py-16 md:py-24" style={{ background: data.bg_color }} dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {(heading || sub) && (
          <div className="mb-10 md:mb-14">
            {heading && <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 mb-3">{heading}</h2>}
            {sub     && <p className="text-neutral-500 text-lg">{sub}</p>}
          </div>
        )}

        {data.show_filter && types.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', ...types].map(t => (
              <button key={t} onClick={() => setFilter(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === t ? 'bg-brand text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}>
                {t === 'all' ? (isHe ? 'הכל' : 'All') : t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={`grid grid-cols-1 ${cols[data.columns] ?? cols[3]} gap-8`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-1/3" />
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${cols[data.columns] ?? cols[3]} gap-8`}>
            {filtered.map(story => {
              const isComingSoon = story.visibilityStatus === 'coming_soon';
              const card = (
                <article className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all h-full ${
                  isComingSoon ? '' : 'hover:shadow-xl group cursor-pointer'
                }`}>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={story.imageUrl || FALLBACK} alt={story.title}
                         className={`w-full h-full object-cover transition-transform duration-500 ${
                           isComingSoon ? 'grayscale brightness-75' : 'group-hover:scale-110'
                         }`}
                         onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                    {isComingSoon && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                        <Clock className="w-10 h-10 text-white mb-2" />
                        <span className="text-white text-sm font-medium uppercase tracking-wider">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-neutral-100 text-neutral-600">
                        {story.type}
                      </span>
                      {story.date && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Calendar className="w-3 h-3" /> {story.date}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-medium mb-2 line-clamp-2 transition-colors ${
                      isComingSoon ? 'text-neutral-400' : 'text-neutral-900 group-hover:text-brand'
                    }`}>{story.title}</h3>
                    {story.excerpt && <p className="text-neutral-500 text-sm line-clamp-2">{story.excerpt}</p>}
                    {!isComingSoon && (
                      <div className="flex items-center gap-2 mt-3 text-brand font-medium text-sm">
                        <span>{isHe ? 'קרא עוד' : 'Read more'}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </article>
              );
              return isComingSoon
                ? <div key={story.id}>{card}</div>
                : <Link key={story.id} to={ROUTES.STORY(story.slug || story.id)} className="block">{card}</Link>;
            })}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <p className="text-center text-neutral-400 py-12">{isHe ? 'לא נמצאו פרויקטים.' : 'No stories found.'}</p>
        )}
      </div>
    </section>
  );
};
