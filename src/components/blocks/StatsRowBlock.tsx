import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { StatsRowData } from '../../domain/types';

interface Props { data: StatsRowData; lang: 'en' | 'he'; }

export const StatsRowBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const isDark = data.style === 'dark';
  const isCard = data.style === 'cards';

  return (
    <section className="w-full py-16 px-6 md:px-12"
             style={{ background: isDark ? '#002828' : data.bg_color, color: isDark ? '#ffffff' : data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {(data.stats || []).map((s, i) => {
          const Icon = s.icon_name ? (LucideIcons as any)[s.icon_name] : null;
          const val   = isHe && s.value_he ? s.value_he : s.value_en;
          const label = isHe && s.label_he ? s.label_he : s.label_en;
          return (
            <div key={i} className={`flex flex-col items-center gap-2 py-8 text-center ${isCard ? 'bg-white/10 rounded-2xl' : ''}`}>
              {Icon && <Icon className="w-7 h-7 mb-1 opacity-70" />}
              <span className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--brand-runtime,#005f5f)' }}>{val}</span>
              <span className="text-sm uppercase tracking-wider opacity-70">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
