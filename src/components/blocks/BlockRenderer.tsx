import React from 'react';
import type { Block } from '../../domain/types';
import { HeroBannerBlock }     from './HeroBannerBlock';
import { TextColumnsBlock }     from './TextColumnsBlock';
import { ImageTextBlock }       from './ImageTextBlock';
import { StatsRowBlock }        from './StatsRowBlock';
import { CtaBandBlock }         from './CtaBandBlock';
import { GalleryGridBlock }     from './GalleryGridBlock';
import { TestimonialBlock }     from './TestimonialBlock';
import { AccordionFaqBlock }    from './AccordionFaqBlock';
import { ServiceCardsBlock }    from './ServiceCardsBlock';
import { RichTextBlock }        from './RichTextBlock';
import { SpacerBlock }          from './SpacerBlock';
import { VideoEmbedBlock }      from './VideoEmbedBlock';
import { ContactFormEmbedBlock } from './ContactFormEmbedBlock';

interface Props { block: Block; lang: 'en' | 'he'; }

export const BlockRenderer: React.FC<Props> = ({ block, lang }) => {
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
    default:                   return null;
  }
};
