import React from 'react';
import type { TestimonialData } from '../../domain/types';

interface Props { data: TestimonialData; lang: 'en' | 'he'; }

export const TestimonialBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const quote  = isHe && data.quote_he       ? data.quote_he       : data.quote_en;
  const title  = isHe && data.author_title_he ? data.author_title_he : data.author_title_en;
  const isSide = data.style === 'side-image';

  return (
    <section className="w-full py-16 px-6 md:px-12"
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <div className={`max-w-4xl mx-auto ${isSide ? 'flex gap-10 items-center' : 'text-center'}`}>
        {isSide && data.author_image_url && (
          <img src={data.author_image_url} alt={data.author_name}
               className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
        )}
        <div className="flex flex-col gap-4">
          <p className="text-xl md:text-2xl italic leading-relaxed">"{quote}"</p>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">{data.author_name}</span>
            <span className="text-sm opacity-60">{title}{data.company_name ? ` · ${data.company_name}` : ''}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
