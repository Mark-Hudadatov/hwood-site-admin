import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { TextColumnsData } from '../../domain/types';

const PAD = { tight: 'py-8 px-6 md:px-12', normal: 'py-16 px-6 md:px-12', spacious: 'py-24 px-6 md:px-12' };
const COLS = { '1': 'grid-cols-1', '2': 'grid-cols-1 md:grid-cols-2', '3': 'grid-cols-1 md:grid-cols-3' };

interface Props { data: TextColumnsData; lang: 'en' | 'he'; }

export const TextColumnsBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  return (
    <section className={`w-full ${PAD[data.padding] ?? PAD.normal}`}
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <div className={`max-w-6xl mx-auto grid gap-8 ${COLS[data.layout] ?? COLS['3']}`}>
        {(data.columns || []).map((col, i) => {
          const Icon = col.icon_name ? (LucideIcons as any)[col.icon_name] : null;
          const h = isHe && col.heading_he ? col.heading_he : col.heading_en;
          const b = isHe && col.body_he    ? col.body_he    : col.body_en;
          return (
            <div key={i} className="flex flex-col gap-3">
              {Icon && <Icon className="w-8 h-8 mb-1" style={{ color: 'var(--brand-runtime,#005f5f)' }} />}
              {h && <h3 className="text-xl font-semibold">{h}</h3>}
              {b && <p className="leading-relaxed opacity-80">{b}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
};
