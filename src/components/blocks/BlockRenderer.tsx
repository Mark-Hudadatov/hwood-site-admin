import React from 'react';
import type { Block, BlockCommonStyle } from '../../domain/types';
import { HeroBannerBlock }      from './HeroBannerBlock';
import { TextColumnsBlock }      from './TextColumnsBlock';
import { ImageTextBlock }        from './ImageTextBlock';
import { StatsRowBlock }         from './StatsRowBlock';
import { CtaBandBlock }          from './CtaBandBlock';
import { GalleryGridBlock }      from './GalleryGridBlock';
import { TestimonialBlock }      from './TestimonialBlock';
import { AccordionFaqBlock }     from './AccordionFaqBlock';
import { ServiceCardsBlock }     from './ServiceCardsBlock';
import { RichTextBlock }         from './RichTextBlock';
import { SpacerBlock }           from './SpacerBlock';
import { VideoEmbedBlock }       from './VideoEmbedBlock';
import { ContactFormEmbedBlock } from './ContactFormEmbedBlock';
import { PageHeroBlock }         from './PageHeroBlock';
import { PartnersMarqueeBlock }  from './PartnersMarqueeBlock';
import { MarketingSplitBlock }   from './MarketingSplitBlock';
import { StoriesIndexBlock }     from './StoriesIndexBlock';
import { PartnerBoxesBlock }     from './PartnerBoxesBlock';

// ─── CommonStyle → CSS ────────────────────────────────────────────────────────

const PADDING_Y: Record<string, string> = {
  tight:    '16px 0',
  normal:   '48px 0',
  spacious: '96px 0',
};

const MAX_W: Record<string, string> = {
  full:   '100%',
  normal: '1152px',
  narrow: '768px',
};

const VIS_CLASS: Record<string, string> = {
  always:       '',
  'desktop-only': 'hidden md:block',
  'mobile-only':  'block md:hidden',
};

function applyCommonStyle(cs: BlockCommonStyle | undefined): {
  wrapStyle: React.CSSProperties;
  innerStyle: React.CSSProperties;
  className: string;
} {
  if (!cs) return { wrapStyle: {}, innerStyle: {}, className: '' };

  const padY = cs.customPaddingY !== undefined
    ? `${cs.customPaddingY}px 0`
    : cs.paddingPreset
      ? PADDING_Y[cs.paddingPreset]
      : undefined;

  const wrapStyle: React.CSSProperties = {
    ...(cs.wrapBg        ? { background:  cs.wrapBg }        : {}),
    ...(cs.wrapTextColor ? { color:       cs.wrapTextColor }  : {}),
    ...(padY             ? { padding:     padY }              : {}),
    ...(cs.textAlign     ? { textAlign:   cs.textAlign }      : {}),
  };

  const mw = cs.maxWidth ? MAX_W[cs.maxWidth] : undefined;
  const innerStyle: React.CSSProperties = mw && cs.maxWidth !== 'full'
    ? { maxWidth: mw, margin: '0 auto', width: '100%' }
    : {};

  const className = [
    VIS_CLASS[cs.visibility ?? 'always'],
    cs.customClass ?? '',
  ].filter(Boolean).join(' ');

  return { wrapStyle, innerStyle, className };
}

// ─── Block switch ─────────────────────────────────────────────────────────────

interface Props { block: Block; lang: 'en' | 'he'; }

function renderBlock(block: Block, lang: 'en' | 'he'): React.ReactNode {
  const d = block.data as any;
  switch (block.type) {
    case 'hero_banner':        return <HeroBannerBlock       data={d} lang={lang} />;
    case 'text_columns':       return <TextColumnsBlock       data={d} lang={lang} />;
    case 'image_text':         return <ImageTextBlock         data={d} lang={lang} />;
    case 'stats_row':          return <StatsRowBlock          data={d} lang={lang} />;
    case 'cta_band':           return <CtaBandBlock           data={d} lang={lang} />;
    case 'gallery_grid':       return <GalleryGridBlock       data={d} lang={lang} />;
    case 'testimonial':        return <TestimonialBlock       data={d} lang={lang} />;
    case 'accordion_faq':      return <AccordionFaqBlock      data={d} lang={lang} />;
    case 'service_cards':      return <ServiceCardsBlock      data={d} lang={lang} />;
    case 'rich_text':          return <RichTextBlock          data={d} lang={lang} />;
    case 'spacer':             return <SpacerBlock            data={d} />;
    case 'video_embed':        return <VideoEmbedBlock        data={d} lang={lang} />;
    case 'contact_form_embed': return <ContactFormEmbedBlock  data={d} lang={lang} />;
    case 'page_hero':          return <PageHeroBlock          data={d} lang={lang} />;
    case 'partners_marquee':   return <PartnersMarqueeBlock   data={d} lang={lang} />;
    case 'marketing_split':    return <MarketingSplitBlock    data={d} lang={lang} />;
    case 'stories_index':      return <StoriesIndexBlock      data={d} lang={lang} />;
    case 'partner_boxes':      return <PartnerBoxesBlock      data={d} lang={lang} />;
    default:                   return null;
  }
}

export const BlockRenderer: React.FC<Props> = ({ block, lang }) => {
  const { wrapStyle, innerStyle, className } = applyCommonStyle(block.commonStyle);
  const hasCommon = Object.keys(wrapStyle).length > 0 || Object.keys(innerStyle).length > 0 || className;

  if (!hasCommon) return <>{renderBlock(block, lang)}</>;

  return (
    <div style={wrapStyle} className={className}>
      {Object.keys(innerStyle).length > 0 ? (
        <div style={innerStyle}>{renderBlock(block, lang)}</div>
      ) : renderBlock(block, lang)}
    </div>
  );
};
