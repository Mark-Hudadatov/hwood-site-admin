import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MarketingSplitData } from '../../domain/types';

interface Props { data: MarketingSplitData; lang: 'en' | 'he'; }

export const MarketingSplitBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe     = lang === 'he';
  const eyebrow  = isHe && data.eyebrow_he   ? data.eyebrow_he   : data.eyebrow_en;
  const title    = isHe && data.title_he     ? data.title_he     : data.title_en;
  const highlight= isHe && data.highlight_he ? data.highlight_he : data.highlight_en;
  const body1    = isHe && data.body1_he     ? data.body1_he     : data.body1_en;
  const body2    = isHe && data.body2_he     ? data.body2_he     : data.body2_en;
  const linkText = isHe && data.link_text_he ? data.link_text_he : data.link_text_en;

  return (
    <section
      className="py-16 md:py-24 xl:py-32"
      style={{ background: data.bg_color, color: data.text_color }}
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-6 opacity-50">{eyebrow}</p>
        )}
        <h2 style={{ fontSize: 'clamp(1.75rem,4vw,3.75rem)', fontWeight: 700, lineHeight: 1.1,
                     letterSpacing: '-0.02em', marginBottom: '2rem' }}>
          {title}{' '}
          {highlight && <span style={{ color: data.highlight_color }}>{highlight}</span>}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-20">
          <div className="space-y-5">
            {body1 && <p className="text-base md:text-lg leading-relaxed opacity-70">{body1}</p>}
            {body2 && <p className="text-base md:text-lg leading-relaxed opacity-70">{body2}</p>}
          </div>
          {linkText && data.link_url && (
            <div className={`flex flex-col ${isHe ? 'items-start' : 'lg:items-end'} justify-end`}>
              <Link
                to={data.link_url}
                className={`inline-flex items-center gap-4 font-bold uppercase tracking-widest text-sm py-4 border-b-2 transition-all hover:gap-6 ${isHe ? 'flex-row-reverse' : ''}`}
                style={{ color: data.text_color, borderColor: data.text_color }}
              >
                {linkText}
                <ArrowRight className={`w-5 h-5 ${isHe ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
