import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ServiceCardsData, Service } from '../../domain/types';
import { getServices } from '../../services/data/dataService';
import { Container } from '../ui/Container';

const COLS = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

interface Props { data: ServiceCardsData; lang: 'en' | 'he'; }

export const ServiceCardsBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const heading    = isHe && data.heading_he    ? data.heading_he    : data.heading_en;
  const subheading = isHe && data.subheading_he ? data.subheading_he : data.subheading_en;
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (data.source === 'auto') {
      getServices().then(s => setServices(s)).catch(() => setServices([]));
    }
  }, [data.source]);

  const cards = data.source === 'auto'
    ? services.map(s => ({
        title:       isHe && s.title       ? s.title       : s.title,
        description: isHe && s.description ? s.description : s.description,
        image_url:   s.imageUrl, link_url: `/services/${s.slug}`,
        accent_color: s.accentColor ?? '#005f5f',
      }))
    : (data.manual_cards || []).map(c => ({
        title:        isHe && c.title_he       ? c.title_he       : c.title_en,
        description:  isHe && c.description_he ? c.description_he : c.description_en,
        image_url:    c.image_url, link_url: c.link_url, accent_color: c.accent_color,
      }));

  return (
    <section className="w-full py-16" style={{ background: data.bg_color }} dir={isHe ? 'rtl' : 'ltr'}>
      <Container className="max-w-6xl">
        {(heading || subheading) && (
          <div className="mb-10 flex flex-col gap-2">
            {heading    && <h2 className="text-3xl font-bold text-neutral-900">{heading}</h2>}
            {subheading && <p className="text-lg text-neutral-600">{subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${COLS[data.columns] ?? COLS[3]} gap-6`}>
          {cards.map((c, i) => (
            <Link key={i} to={c.link_url || '#'}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex items-end shadow-md hover:shadow-xl transition-shadow">
              {c.image_url && (
                <img src={c.image_url} alt={c.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">{c.title}</h3>
                {c.description && <p className="text-sm text-white/70 line-clamp-2">{c.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
