import React from 'react';
import type { GalleryGridData } from '../../domain/types';

const COLS = { 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' };
const GAPS = { tight: 'gap-1', normal: 'gap-3', spacious: 'gap-6' };
const RADIUS = { plain: '', rounded: 'overflow-hidden rounded-xl', card: 'overflow-hidden rounded-xl shadow-lg' };

interface Props { data: GalleryGridData; lang: 'en' | 'he'; }

export const GalleryGridBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  if (!data.images?.length) return null;
  return (
    <section className="w-full py-12 px-6 md:px-12" style={{ background: data.bg_color }}>
      <div className={`max-w-6xl mx-auto grid ${COLS[data.columns] ?? COLS[3]} ${GAPS[data.gap] ?? GAPS.normal}`}>
        {data.images.map((img, i) => (
          <div key={i} className={`aspect-square ${RADIUS[data.style] ?? ''}`}>
            {img.url && <img src={img.url} alt={isHe ? img.caption_he : img.caption_en} className="w-full h-full object-cover" />}
          </div>
        ))}
      </div>
    </section>
  );
};
