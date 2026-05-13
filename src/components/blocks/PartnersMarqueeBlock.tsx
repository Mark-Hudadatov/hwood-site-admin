import React from 'react';
import type { PartnersMarqueeData } from '../../domain/types';

const SPEED = { slow: '60s', medium: '40s', fast: '20s' };

interface Props { data: PartnersMarqueeData; lang: 'en' | 'he'; }

export const PartnersMarqueeBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe    = lang === 'he';
  const heading = isHe && data.heading_he ? data.heading_he : data.heading_en;
  const logos   = data.logos ?? [];
  const repeated = [...logos, ...logos, ...logos]; // triple for seamless loop

  return (
    <section className="w-full overflow-hidden py-6 md:py-10 border-b border-gray-100"
             style={{ background: data.bg_color }}>
      {heading && (
        <p className="text-center text-[10px] uppercase tracking-[0.22em] font-bold text-gray-400 mb-6">
          {heading}
        </p>
      )}
      <div className="relative flex overflow-hidden">
        <div
          className="flex gap-10 md:gap-16 animate-marquee"
          style={{ animationDuration: SPEED[data.speed ?? 'medium'] }}
        >
          {repeated.map((logo, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center h-10 md:h-14">
              {logo.url ? (
                <img
                  src={logo.url}
                  alt={isHe && logo.alt_he ? logo.alt_he : logo.alt_en}
                  className="h-full w-auto max-w-[120px] md:max-w-[160px] object-contain grayscale hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
