import React from 'react';
import { Link } from 'react-router-dom';
import type { HeroBannerData } from '../../domain/types';
import { Container } from '../ui/Container';

const HEIGHTS = { small: '40vh', medium: '60vh', large: '80vh', fullscreen: '100vh' };

interface Props { data: HeroBannerData; lang: 'en' | 'he'; }

export const HeroBannerBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const heading    = isHe && data.heading_he    ? data.heading_he    : data.heading_en;
  const subheading = isHe && data.subheading_he ? data.subheading_he : data.subheading_en;
  const ctaText    = isHe && data.cta_text_he   ? data.cta_text_he   : data.cta_text_en;
  const align      = data.content_align ?? 'center';

  const ctaCls =
    data.cta_style === 'white'   ? 'bg-white text-neutral-900 hover:bg-neutral-100' :
    data.cta_style === 'outline' ? 'border-2 border-white text-white hover:bg-white/10' :
    'bg-brand text-white hover:bg-brand-hover';

  return (
    <section
      className="relative w-full flex items-center overflow-hidden"
      style={{ minHeight: HEIGHTS[data.height] ?? '60vh', background: data.bg_color }}
    >
      {data.bg_image_url && (
        <>
          <img src={data.bg_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${(data.overlay_opacity ?? 50) / 100})` }} />
        </>
      )}
      <Container className={`relative z-10 w-full max-w-6xl py-20 text-${align}`}
                 dir={isHe ? 'rtl' : 'ltr'}>
        {heading && (
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: data.text_color }}>
            {heading}
          </h1>
        )}
        {subheading && (
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-90"
             style={{ color: data.text_color }}>
            {subheading}
          </p>
        )}
        {ctaText && data.cta_url && (
          <Link to={data.cta_url}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-base transition-all ${ctaCls}`}>
            {ctaText}
          </Link>
        )}
      </Container>
    </section>
  );
};
