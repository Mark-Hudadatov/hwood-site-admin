import React from 'react';
import { Link } from 'react-router-dom';
import type { CtaBandData } from '../../domain/types';

interface Props { data: CtaBandData; lang: 'en' | 'he'; }

export const CtaBandBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const heading    = isHe && data.heading_he    ? data.heading_he    : data.heading_en;
  const subheading = isHe && data.subheading_he ? data.subheading_he : data.subheading_en;
  const p1 = isHe && data.cta_primary_text_he   ? data.cta_primary_text_he   : data.cta_primary_text_en;
  const p2 = isHe && data.cta_secondary_text_he ? data.cta_secondary_text_he : data.cta_secondary_text_en;
  const isSplit = data.style === 'split';

  return (
    <section className={`w-full py-16 px-6 md:px-12`}
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <div className={`max-w-6xl mx-auto flex flex-col ${isSplit ? 'md:flex-row md:items-center md:justify-between' : 'items-center text-center'} gap-8`}>
        <div className="flex flex-col gap-2">
          {heading    && <h2 className="text-3xl md:text-4xl font-bold">{heading}</h2>}
          {subheading && <p className="text-lg opacity-80">{subheading}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {p1 && data.cta_primary_url && (
            <Link to={data.cta_primary_url}
                  className="px-6 py-3 rounded-xl font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors">
              {p1}
            </Link>
          )}
          {p2 && data.cta_secondary_url && (
            <Link to={data.cta_secondary_url}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-white/50 hover:border-white transition-colors"
                  style={{ color: data.text_color }}>
              {p2}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
