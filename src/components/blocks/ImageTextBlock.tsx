import React from 'react';
import { Link } from 'react-router-dom';
import type { ImageTextData } from '../../domain/types';

const ASPECT = { square: 'aspect-square', portrait: 'aspect-[3/4]', landscape: 'aspect-video' };

interface Props { data: ImageTextData; lang: 'en' | 'he'; }

export const ImageTextBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const eyebrow = isHe && data.eyebrow_he ? data.eyebrow_he : data.eyebrow_en;
  const heading  = isHe && data.heading_he ? data.heading_he : data.heading_en;
  const body     = isHe && data.body_he    ? data.body_he    : data.body_en;
  const ctaText  = isHe && data.cta_text_he ? data.cta_text_he : data.cta_text_en;
  const imgRight = data.image_side === 'right';

  return (
    <section className="w-full py-16 px-6 md:px-12"
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <div className={`max-w-6xl mx-auto flex flex-col ${imgRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
        {data.image_url && (
          <div className={`w-full md:w-1/2 flex-shrink-0 overflow-hidden rounded-2xl ${ASPECT[data.image_aspect] ?? ASPECT.landscape}`}>
            <img src={data.image_url} alt={heading} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 flex flex-col gap-4">
          {eyebrow && <p className="text-xs uppercase tracking-widest font-bold opacity-60">{eyebrow}</p>}
          {heading  && <h2 className="text-3xl md:text-4xl font-bold leading-tight">{heading}</h2>}
          {body     && <p className="leading-relaxed opacity-80 whitespace-pre-line">{body}</p>}
          {ctaText && data.cta_url && (
            <Link to={data.cta_url}
                  className="mt-2 self-start px-6 py-3 rounded-xl font-semibold text-sm bg-brand text-white hover:bg-brand-hover transition-colors">
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
