import React from 'react';
import { Link } from 'react-router-dom';
import type { PartnerBoxesData } from '../../domain/types';

interface Props { data: PartnerBoxesData; lang: 'en' | 'he'; }

export const PartnerBoxesBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const boxes = data.boxes ?? [];

  return (
    <section dir={isHe ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
        {boxes.map((box, i) => {
          const title   = isHe && box.title_he   ? box.title_he   : box.title_en;
          const sub     = isHe && box.subtitle_he ? box.subtitle_he : box.subtitle_en;
          const desc    = isHe && box.description_he ? box.description_he : box.description_en;
          const opacity = (box.overlay_opacity ?? 70) / 100;

          const inner = (
            <div
              className="relative h-[280px] md:h-[360px] lg:h-[420px] overflow-hidden group border-r border-white/5 last:border-r-0"
              style={{ backgroundColor: data.bg_color || '#0a0a0a' }}
            >
              {box.image_url && (
                <img src={box.image_url} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black" style={{ opacity }} />
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-10">
                {sub && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-amber-500/80 mb-4">
                    {sub}
                  </span>
                )}
                <h3 className="text-lg md:text-xl font-semibold mb-3 tracking-tight leading-tight text-white group-hover:text-white/90 transition-colors">
                  {title}
                </h3>
                <div className="w-10 h-[1px] bg-white/20 mb-4" />
                {desc && (
                  <p className="text-sm leading-relaxed text-white/60 max-w-[90%] group-hover:text-white/90 transition-colors">
                    {desc}
                  </p>
                )}
              </div>
            </div>
          );

          return box.cta_url
            ? <Link key={i} to={box.cta_url} className="block">{inner}</Link>
            : <div key={i}>{inner}</div>;
        })}

        {boxes.length === 0 && (
          <div className="col-span-3 py-16 text-center text-neutral-400 bg-neutral-900 text-sm">
            Add boxes in the settings panel
          </div>
        )}
      </div>
    </section>
  );
};
