import React from 'react';
import { Link } from 'react-router-dom';
import type { PageHeroData } from '../../domain/types';

interface Props { data: PageHeroData; lang: 'en' | 'he'; }

export const PageHeroBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe      = lang === 'he';
  const eyebrow   = isHe && data.eyebrow_he   ? data.eyebrow_he   : data.eyebrow_en;
  const heading   = isHe && data.heading_he   ? data.heading_he   : data.heading_en;
  const sub       = isHe && data.subheading_he ? data.subheading_he : data.subheading_en;
  const cta1Text  = isHe && data.cta1_text_he ? data.cta1_text_he : data.cta1_text_en;
  const cta2Text  = isHe && data.cta2_text_he ? data.cta2_text_he : data.cta2_text_en;

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: data.bg_color, color: data.text_color }}
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-4 opacity-70">{eyebrow}</p>
        )}
        <div className="max-w-3xl">
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 500, lineHeight: 1.1, marginBottom: '1.25rem' }}>
            {heading}
          </h1>
          {sub && (
            <p style={{ fontSize: '1.125rem', opacity: 0.75, lineHeight: 1.7, marginBottom: '2rem', maxWidth: '42rem' }}>
              {sub}
            </p>
          )}
          {(cta1Text || cta2Text) && (
            <div className={`flex flex-wrap gap-3 ${isHe ? 'flex-row-reverse' : ''}`}>
              {cta1Text && data.cta1_url && (
                <Link to={data.cta1_url}
                      className="inline-flex items-center px-8 py-3 rounded font-medium transition-colors"
                      style={{ background: data.text_color, color: data.bg_color }}>
                  {cta1Text}
                </Link>
              )}
              {cta2Text && data.cta2_url && (
                <Link to={data.cta2_url}
                      className="inline-flex items-center px-8 py-3 rounded font-medium border transition-colors hover:bg-white/10"
                      style={{ borderColor: data.text_color, color: data.text_color }}>
                  {cta2Text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      {data.decoration === 'skew' && (
        <div className="absolute right-0 top-0 w-1/3 h-full -skew-x-12 origin-top-right opacity-20 pointer-events-none"
             style={{ background: data.text_color }} />
      )}
    </section>
  );
};
