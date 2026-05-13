import type {
  BlockType, BlockData, FieldDef,
  HeroBannerData, TextColumnsData, ImageTextData, StatsRowData,
  CtaBandData, GalleryGridData, TestimonialData, AccordionFaqData,
  ServiceCardsData, RichTextData, SpacerData, VideoEmbedData, ContactFormEmbedData,
  PageHeroData, PartnersMarqueeData, MarketingSplitData, StoriesIndexData, PartnerBoxesData,
} from '../../domain/types';

export function makeBlockId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export interface BlockTypeDef {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  category: 'layout' | 'content' | 'media' | 'interactive';
  fields: FieldDef[];
  defaultData: BlockData;
}

// ─── Shared color fields ──────────────────────────────────────────────────────
const bgColor  = (def = '#ffffff'): FieldDef => ({ key: 'bg_color',   label: 'Background', type: 'color', helpText: def });
const txtColor = (def = '#171717'): FieldDef => ({ key: 'text_color', label: 'Text color',  type: 'color', helpText: def });

// ─── Registry ─────────────────────────────────────────────────────────────────
export const BLOCK_REGISTRY: BlockTypeDef[] = [
  // ── HERO BANNER ─────────────────────────────────────────────────────────────
  {
    type: 'hero_banner',
    label: 'Hero Banner',
    description: 'Full-width hero with image, headline and CTA',
    icon: 'LayoutTemplate',
    category: 'layout',
    fields: [
      { key: 'heading',     label: 'Heading',    type: 'bilingual_text' },
      { key: 'subheading',  label: 'Subheading', type: 'bilingual_textarea' },
      { key: 'bg_image_url',label: 'Background image', type: 'image' },
      bgColor('#002828'),
      txtColor('#ffffff'),
      { key: 'overlay_opacity', label: 'Overlay opacity (0–100)', type: 'number', min: 0, max: 100, step: 5 },
      { key: 'height',       label: 'Height', type: 'select', options: [
        { value: 'small', label: 'Small (40vh)' }, { value: 'medium', label: 'Medium (60vh)' },
        { value: 'large', label: 'Large (80vh)' }, { value: 'fullscreen', label: 'Full screen' },
      ]},
      { key: 'content_align', label: 'Alignment', type: 'select', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' },
      ]},
      { key: 'cta_text',  label: 'Button text',  type: 'bilingual_text' },
      { key: 'cta_url',   label: 'Button link',  type: 'url' },
      { key: 'cta_style', label: 'Button style', type: 'select', options: [
        { value: 'brand', label: 'Brand' }, { value: 'white', label: 'White' }, { value: 'outline', label: 'Outline' },
      ]},
    ],
    defaultData: {
      heading_en: 'Your headline here', heading_he: 'הכותרת שלך כאן',
      subheading_en: 'A short supporting statement.', subheading_he: 'משפט תמיכה קצר.',
      bg_image_url: '', bg_color: '#002828', text_color: '#ffffff',
      overlay_opacity: 50, height: 'large', content_align: 'center',
      cta_text_en: 'Get Started', cta_text_he: 'להתחיל',
      cta_url: '/contact', cta_style: 'white',
    } as HeroBannerData,
  },

  // ── TEXT COLUMNS ─────────────────────────────────────────────────────────────
  {
    type: 'text_columns',
    label: 'Text Columns',
    description: '1–3 column text sections with optional icons',
    icon: 'Columns3',
    category: 'content',
    fields: [
      { key: 'layout', label: 'Columns', type: 'select', options: [
        { value: '1', label: '1 column' }, { value: '2', label: '2 columns' }, { value: '3', label: '3 columns' },
      ]},
      bgColor(), txtColor(),
      { key: 'padding', label: 'Padding', type: 'select', options: [
        { value: 'tight', label: 'Tight' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Spacious' },
      ]},
      { key: 'columns', label: 'Column items', type: 'repeater', subFields: [
        { key: 'heading',  label: 'Heading', type: 'bilingual_text' },
        { key: 'body',     label: 'Body',    type: 'bilingual_textarea' },
        { key: 'icon_name',label: 'Icon (lucide name)', type: 'text', placeholder: 'Zap' },
      ]},
    ],
    defaultData: {
      layout: '3', bg_color: '#ffffff', text_color: '#171717', padding: 'normal',
      columns: [
        { heading_en: 'Feature one', heading_he: 'תכונה ראשונה', body_en: 'Description of this feature.', body_he: 'תיאור של תכונה זו.', icon_name: 'Zap' },
        { heading_en: 'Feature two', heading_he: 'תכונה שנייה', body_en: 'Description of this feature.', body_he: 'תיאור של תכונה זו.', icon_name: 'Shield' },
        { heading_en: 'Feature three', heading_he: 'תכונה שלישית', body_en: 'Description of this feature.', body_he: 'תיאור של תכונה זו.', icon_name: 'Star' },
      ],
    } as TextColumnsData,
  },

  // ── IMAGE + TEXT ─────────────────────────────────────────────────────────────
  {
    type: 'image_text',
    label: 'Image & Text',
    description: 'Side-by-side image and text with optional CTA',
    icon: 'Image',
    category: 'content',
    fields: [
      { key: 'eyebrow',    label: 'Eyebrow label', type: 'bilingual_text', placeholder: 'About us' },
      { key: 'heading',    label: 'Heading', type: 'bilingual_text' },
      { key: 'body',       label: 'Body text', type: 'bilingual_textarea' },
      { key: 'image_url',  label: 'Image', type: 'image' },
      { key: 'image_side', label: 'Image side', type: 'select', options: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
      ]},
      { key: 'image_aspect', label: 'Aspect ratio', type: 'select', options: [
        { value: 'square', label: 'Square' }, { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' },
      ]},
      { key: 'cta_text', label: 'Button text', type: 'bilingual_text' },
      { key: 'cta_url',  label: 'Button link', type: 'url' },
      bgColor(), txtColor(),
    ],
    defaultData: {
      eyebrow_en: '', eyebrow_he: '',
      heading_en: 'Section heading', heading_he: 'כותרת קטע',
      body_en: 'Write your content here. Describe your product, service, or story in a compelling way.',
      body_he: 'כתוב את התוכן שלך כאן.',
      image_url: '', image_side: 'left', image_aspect: 'landscape',
      cta_text_en: '', cta_text_he: '', cta_url: '',
      bg_color: '#ffffff', text_color: '#171717',
    } as ImageTextData,
  },

  // ── STATS ROW ────────────────────────────────────────────────────────────────
  {
    type: 'stats_row',
    label: 'Stats Row',
    description: 'Key numbers and metrics',
    icon: 'BarChart3',
    category: 'content',
    fields: [
      { key: 'style', label: 'Style', type: 'select', options: [
        { value: 'plain', label: 'Plain' }, { value: 'cards', label: 'Cards' }, { value: 'dark', label: 'Dark' },
      ]},
      bgColor(), txtColor(),
      { key: 'stats', label: 'Stats', type: 'repeater', subFields: [
        { key: 'value',  label: 'Value', type: 'bilingual_text', placeholder: '2000+' },
        { key: 'label',  label: 'Label', type: 'bilingual_text', placeholder: 'Projects' },
        { key: 'icon_name', label: 'Icon', type: 'text', placeholder: 'Award' },
      ]},
    ],
    defaultData: {
      style: 'cards', bg_color: '#ffffff', text_color: '#171717',
      stats: [
        { value_en: '2000+', value_he: '2000+', label_en: 'Projects', label_he: 'פרויקטים', icon_name: 'Briefcase' },
        { value_en: '15',    value_he: '15',    label_en: 'Years',    label_he: 'שנים',     icon_name: 'Calendar' },
        { value_en: '500+',  value_he: '500+',  label_en: 'Clients',  label_he: 'לקוחות',   icon_name: 'Users' },
        { value_en: '3500',  value_he: '3500',  label_en: 'sqm',      label_he: 'מ"ר',      icon_name: 'Factory' },
      ],
    } as StatsRowData,
  },

  // ── CTA BAND ─────────────────────────────────────────────────────────────────
  {
    type: 'cta_band',
    label: 'CTA Band',
    description: 'Full-width call-to-action strip',
    icon: 'Megaphone',
    category: 'content',
    fields: [
      { key: 'heading',    label: 'Heading', type: 'bilingual_text' },
      { key: 'subheading', label: 'Subheading', type: 'bilingual_textarea' },
      { key: 'cta_primary_text', label: 'Primary button text', type: 'bilingual_text' },
      { key: 'cta_primary_url',  label: 'Primary button link', type: 'url' },
      { key: 'cta_secondary_text', label: 'Secondary button text', type: 'bilingual_text' },
      { key: 'cta_secondary_url',  label: 'Secondary button link', type: 'url' },
      bgColor('#005f5f'), txtColor('#ffffff'),
      { key: 'style', label: 'Layout', type: 'select', options: [
        { value: 'centered', label: 'Centered' }, { value: 'split', label: 'Split' },
      ]},
    ],
    defaultData: {
      heading_en: 'Ready to start?', heading_he: 'מוכן להתחיל?',
      subheading_en: 'Contact us today for a free consultation.', subheading_he: 'צור קשר לייעוץ חינם.',
      cta_primary_text_en: 'Contact Us', cta_primary_text_he: 'צור קשר',
      cta_primary_url: '/contact',
      cta_secondary_text_en: 'View Services', cta_secondary_text_he: 'ראה שירותים',
      cta_secondary_url: '/services',
      bg_color: '#005f5f', text_color: '#ffffff', style: 'centered',
    } as CtaBandData,
  },

  // ── GALLERY GRID ─────────────────────────────────────────────────────────────
  {
    type: 'gallery_grid',
    label: 'Gallery Grid',
    description: 'Image gallery with configurable layout',
    icon: 'LayoutGrid',
    category: 'media',
    fields: [
      { key: 'columns', label: 'Columns', type: 'select', options: [
        { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
      ]},
      { key: 'gap', label: 'Gap', type: 'select', options: [
        { value: 'tight', label: 'Tight' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Spacious' },
      ]},
      { key: 'style', label: 'Style', type: 'select', options: [
        { value: 'plain', label: 'Plain' }, { value: 'rounded', label: 'Rounded' }, { value: 'card', label: 'Card' },
      ]},
      bgColor(),
      { key: 'images', label: 'Images', type: 'repeater', subFields: [
        { key: 'url',        label: 'Image', type: 'image' },
        { key: 'caption', label: 'Caption', type: 'bilingual_text' },
      ]},
    ],
    defaultData: {
      columns: 3, gap: 'normal', style: 'rounded', bg_color: '#f5f5f5',
      images: [],
    } as GalleryGridData,
  },

  // ── TESTIMONIAL ──────────────────────────────────────────────────────────────
  {
    type: 'testimonial',
    label: 'Testimonial',
    description: 'Customer quote with attribution',
    icon: 'Quote',
    category: 'content',
    fields: [
      { key: 'quote',        label: 'Quote', type: 'bilingual_textarea' },
      { key: 'author_name',  label: 'Author name', type: 'text' },
      { key: 'author_title', label: 'Author title', type: 'bilingual_text' },
      { key: 'author_image_url', label: 'Author photo', type: 'image' },
      { key: 'company_name', label: 'Company', type: 'text' },
      { key: 'style', label: 'Style', type: 'select', options: [
        { value: 'centered', label: 'Centered' }, { value: 'card', label: 'Card' }, { value: 'side-image', label: 'Side image' },
      ]},
      bgColor(), txtColor(),
    ],
    defaultData: {
      quote_en: '"Working with HWOOD transformed our project. Exceptional quality and precision."',
      quote_he: '"העבודה עם HWOOD שינתה את הפרויקט שלנו."',
      author_name: 'John Smith', author_title_en: 'Project Manager', author_title_he: 'מנהל פרויקטים',
      author_image_url: '', company_name: 'Acme Construction',
      style: 'centered', bg_color: '#f5f5f5', text_color: '#171717',
    } as TestimonialData,
  },

  // ── ACCORDION FAQ ────────────────────────────────────────────────────────────
  {
    type: 'accordion_faq',
    label: 'FAQ Accordion',
    description: 'Collapsible Q&A section',
    icon: 'ListCollapse',
    category: 'content',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'bilingual_text' },
      bgColor(), txtColor(),
      { key: 'default_open_index', label: 'Default open item (-1 = all closed)', type: 'number', min: -1, step: 1 },
      { key: 'items', label: 'Questions', type: 'repeater', subFields: [
        { key: 'question', label: 'Question', type: 'bilingual_text' },
        { key: 'answer',   label: 'Answer',   type: 'bilingual_textarea' },
      ]},
    ],
    defaultData: {
      heading_en: 'Frequently Asked Questions', heading_he: 'שאלות נפוצות',
      bg_color: '#ffffff', text_color: '#171717', default_open_index: -1,
      items: [
        { question_en: 'What materials do you work with?', question_he: 'עם אילו חומרים אתם עובדים?', answer_en: 'We work with wood, MDF, aluminum, and composites.', answer_he: 'אנו עובדים עם עץ, MDF, אלומיניום וחומרים מרוכבים.' },
        { question_en: 'What is your turnaround time?', question_he: 'מה זמן ההספקה שלכם?', answer_en: 'Typical lead time is 2–4 weeks depending on complexity.', answer_he: 'זמן אספקה טיפוסי הוא 2-4 שבועות.' },
      ],
    } as AccordionFaqData,
  },

  // ── SERVICE CARDS ────────────────────────────────────────────────────────────
  {
    type: 'service_cards',
    label: 'Service Cards',
    description: 'Auto or manual service cards grid',
    icon: 'Layers',
    category: 'content',
    fields: [
      { key: 'heading',    label: 'Section heading', type: 'bilingual_text' },
      { key: 'subheading', label: 'Subheading',      type: 'bilingual_textarea' },
      { key: 'source', label: 'Source', type: 'select', options: [
        { value: 'auto', label: 'Auto (from DB)' }, { value: 'manual', label: 'Manual' },
      ]},
      { key: 'columns', label: 'Columns', type: 'select', options: [
        { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
      ]},
      bgColor('#f5f5f5'),
      { key: 'manual_cards', label: 'Manual cards (only if source=manual)', type: 'repeater', subFields: [
        { key: 'title',       label: 'Title',       type: 'bilingual_text' },
        { key: 'description', label: 'Description', type: 'bilingual_textarea' },
        { key: 'image_url',   label: 'Image',       type: 'image' },
        { key: 'link_url',    label: 'Link',        type: 'url' },
        { key: 'accent_color',label: 'Accent',      type: 'color' },
      ]},
    ],
    defaultData: {
      heading_en: 'Our Services', heading_he: 'השירותים שלנו',
      subheading_en: '', subheading_he: '',
      source: 'auto', service_ids: '', columns: 3,
      bg_color: '#f5f5f5', manual_cards: [],
    } as ServiceCardsData,
  },

  // ── RICH TEXT ────────────────────────────────────────────────────────────────
  {
    type: 'rich_text',
    label: 'Rich Text',
    description: 'Free-form text block with markdown',
    icon: 'AlignLeft',
    category: 'content',
    fields: [
      { key: 'content_en', label: 'Content (EN)', type: 'textarea' },
      { key: 'content_he', label: 'Content (HE)', type: 'textarea' },
      bgColor(), txtColor(),
      { key: 'max_width', label: 'Max width', type: 'select', options: [
        { value: 'narrow', label: 'Narrow' }, { value: 'normal', label: 'Normal' },
        { value: 'wide', label: 'Wide' }, { value: 'full', label: 'Full' },
      ]},
      { key: 'padding', label: 'Padding', type: 'select', options: [
        { value: 'tight', label: 'Tight' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Spacious' },
      ]},
    ],
    defaultData: {
      content_en: 'Write your content here using **markdown**.\n\n- List item\n- Another item',
      content_he: 'כתוב את התוכן שלך כאן.',
      bg_color: '#ffffff', text_color: '#171717', max_width: 'normal', padding: 'normal',
    } as RichTextData,
  },

  // ── SPACER ──────────────────────────────────────────────────────────────────
  {
    type: 'spacer',
    label: 'Spacer',
    description: 'Vertical spacing block',
    icon: 'ArrowUpDown',
    category: 'layout',
    fields: [
      { key: 'height_px', label: 'Height (px)', type: 'number', min: 8, max: 400, step: 8 },
      bgColor('transparent'),
    ],
    defaultData: { height_px: 64, bg_color: 'transparent' } as SpacerData,
  },

  // ── VIDEO EMBED ──────────────────────────────────────────────────────────────
  {
    type: 'video_embed',
    label: 'Video',
    description: 'Embedded video with optional heading',
    icon: 'Play',
    category: 'media',
    fields: [
      { key: 'heading',          label: 'Heading',      type: 'bilingual_text' },
      { key: 'video_url',        label: 'Video URL',    type: 'url', placeholder: 'https://youtube.com/embed/...' },
      { key: 'poster_image_url', label: 'Poster image', type: 'image' },
      { key: 'autoplay', label: 'Autoplay', type: 'toggle' },
      { key: 'loop',     label: 'Loop',     type: 'toggle' },
      bgColor('#000000'),
      { key: 'caption', label: 'Caption', type: 'bilingual_text' },
    ],
    defaultData: {
      heading_en: '', heading_he: '', video_url: '', poster_image_url: '',
      autoplay: false, loop: false, bg_color: '#000000',
      caption_en: '', caption_he: '',
    } as VideoEmbedData,
  },

  // ── CONTACT FORM EMBED ───────────────────────────────────────────────────────
  {
    type: 'contact_form_embed',
    label: 'Contact Form',
    description: 'Embedded contact or quote form',
    icon: 'Mail',
    category: 'interactive',
    fields: [
      { key: 'heading',   label: 'Heading', type: 'bilingual_text' },
      { key: 'form_type', label: 'Form type', type: 'select', options: [
        { value: 'contact', label: 'Contact form' }, { value: 'quote', label: 'Quote form' },
      ]},
      bgColor(), txtColor(),
    ],
    defaultData: {
      heading_en: 'Get in Touch', heading_he: 'צור קשר',
      form_type: 'contact', bg_color: '#f5f5f5', text_color: '#171717',
    } as ContactFormEmbedData,
  },

  // ── PAGE HERO ────────────────────────────────────────────────────────────────
  {
    type: 'page_hero',
    label: 'Page Hero',
    description: 'Standard full-width page hero with title, subtitle and optional CTA buttons',
    icon: 'PanelTop',
    category: 'layout',
    fields: [
      { key: 'eyebrow',     label: 'Eyebrow label', type: 'bilingual_text', placeholder: 'About us' },
      { key: 'heading',     label: 'Heading',    type: 'bilingual_text' },
      { key: 'subheading',  label: 'Subheading', type: 'bilingual_textarea' },
      bgColor('#005f5f'), txtColor('#ffffff'),
      { key: 'decoration', label: 'Decoration', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'skew', label: 'Diagonal accent' },
      ]},
      { key: 'cta1_text', label: 'Primary CTA text', type: 'bilingual_text' },
      { key: 'cta1_url',  label: 'Primary CTA link', type: 'url' },
      { key: 'cta2_text', label: 'Secondary CTA text', type: 'bilingual_text' },
      { key: 'cta2_url',  label: 'Secondary CTA link', type: 'url' },
    ],
    defaultData: {
      eyebrow_en: '', eyebrow_he: '',
      heading_en: 'Page Title', heading_he: 'כותרת עמוד',
      subheading_en: 'A short description of this page.',
      subheading_he: 'תיאור קצר של עמוד זה.',
      bg_color: '#005f5f', text_color: '#ffffff',
      decoration: 'skew',
      cta1_text_en: '', cta1_text_he: '', cta1_url: '',
      cta2_text_en: '', cta2_text_he: '', cta2_url: '',
    } as PageHeroData,
  },

  // ── PARTNERS MARQUEE ─────────────────────────────────────────────────────────
  {
    type: 'partners_marquee',
    label: 'Logo Strip',
    description: 'Infinite scrolling logo/partner strip',
    icon: 'Grip',
    category: 'media',
    fields: [
      { key: 'heading', label: 'Heading (optional)', type: 'bilingual_text', placeholder: 'Trusted by' },
      { key: 'speed',   label: 'Speed', type: 'select', options: [
        { value: 'slow', label: 'Slow' }, { value: 'medium', label: 'Medium' }, { value: 'fast', label: 'Fast' },
      ]},
      bgColor('#ffffff'),
      { key: 'logos', label: 'Logos', type: 'repeater', subFields: [
        { key: 'url',    label: 'Logo image', type: 'image' },
        { key: 'alt_en', label: 'Alt text (EN)', type: 'text' },
        { key: 'alt_he', label: 'Alt text (HE)', type: 'text' },
      ]},
    ],
    defaultData: {
      heading_en: '', heading_he: '',
      speed: 'medium', bg_color: '#ffffff', logos: [],
    } as PartnersMarqueeData,
  },

  // ── MARKETING SPLIT ──────────────────────────────────────────────────────────
  {
    type: 'marketing_split',
    label: 'Marketing Split',
    description: 'Large editorial heading with 2-column body text and CTA link',
    icon: 'SplitSquareHorizontal',
    category: 'content',
    fields: [
      { key: 'eyebrow',         label: 'Eyebrow',           type: 'bilingual_text' },
      { key: 'title',           label: 'Title',             type: 'bilingual_text' },
      { key: 'highlight',       label: 'Highlighted word',  type: 'bilingual_text' },
      { key: 'highlight_color', label: 'Highlight colour',  type: 'color', helpText: '#10b981' },
      { key: 'body1',           label: 'Body paragraph 1',  type: 'bilingual_textarea' },
      { key: 'body2',           label: 'Body paragraph 2',  type: 'bilingual_textarea' },
      { key: 'link_text',       label: 'Link text',         type: 'bilingual_text' },
      { key: 'link_url',        label: 'Link URL',          type: 'url' },
      bgColor('#ffffff'), txtColor('#171717'),
    ],
    defaultData: {
      eyebrow_en: '', eyebrow_he: '',
      title_en: 'Work starts from the', title_he: 'העבודה מתחילה',
      highlight_en: 'inside', highlight_he: 'מבפנים',
      highlight_color: '#10b981',
      body1_en: 'Production is rarely static. Layouts change, dimensions vary, and each project introduces new constraints.',
      body1_he: 'הייצור לעיתים רחוקות סטטי. פריסות משתנות, מידות משתנות.',
      body2_en: 'We focus on the internal logic of CNC-based production.',
      body2_he: 'אנחנו מתמקדים בלוגיקה הפנימית של ייצור מבוסס CNC.',
      link_text_en: 'Explore Our Engineering', link_text_he: 'לחקור את ההנדסה שלנו',
      link_url: '/about',
      bg_color: '#ffffff', text_color: '#171717',
    } as MarketingSplitData,
  },

  // ── STORIES INDEX ────────────────────────────────────────────────────────────
  {
    type: 'stories_index',
    label: 'Stories / Portfolio',
    description: 'Auto-loading stories grid with optional type filter',
    icon: 'Newspaper',
    category: 'content',
    fields: [
      { key: 'heading',    label: 'Section heading', type: 'bilingual_text' },
      { key: 'subheading', label: 'Subheading',      type: 'bilingual_textarea' },
      { key: 'show_filter', label: 'Show type filter', type: 'toggle' },
      { key: 'limit',   label: 'Max stories to load', type: 'number', min: 3, max: 48, step: 3 },
      { key: 'columns', label: 'Columns', type: 'select', options: [
        { value: '2', label: '2 columns' }, { value: '3', label: '3 columns' },
      ]},
      bgColor('#f5f5f5'),
    ],
    defaultData: {
      heading_en: 'Projects & News', heading_he: 'פרויקטים וחדשות',
      subheading_en: 'Explore our latest work.', subheading_he: 'גלה את העבודות האחרונות שלנו.',
      show_filter: true, limit: 9, columns: 3, bg_color: '#f5f5f5',
    } as StoriesIndexData,
  },

  // ── PARTNER BOXES ────────────────────────────────────────────────────────────
  {
    type: 'partner_boxes',
    label: 'Audience Cards',
    description: '3-column dark image cards with overlay — "Who We Work With" style',
    icon: 'PanelTopDashed',
    category: 'content',
    fields: [
      bgColor('#0a0a0a'),
      { key: 'boxes', label: 'Cards', type: 'repeater', subFields: [
        { key: 'title',           label: 'Title',           type: 'bilingual_text' },
        { key: 'subtitle',        label: 'Subtitle / Tag',  type: 'bilingual_text' },
        { key: 'description',     label: 'Description',     type: 'bilingual_textarea' },
        { key: 'image_url',       label: 'Background image',type: 'image' },
        { key: 'overlay_opacity', label: 'Overlay (0–100)', type: 'number', min: 0, max: 100, step: 5 },
        { key: 'cta_url',         label: 'Link URL',        type: 'url' },
      ]},
    ],
    defaultData: {
      bg_color: '#0a0a0a',
      boxes: [
        {
          title_en: 'Kitchen & Cabinet Manufacturers', title_he: 'יצרני מטבחים וארונות',
          subtitle_en: 'Series & Project Production', subtitle_he: 'ייצור סדרתי ופרויקטאלי',
          description_en: 'Focused on repeatable manufacturing and CNC-based workflows.',
          description_he: 'התמקדות בייצור חוזר ותהליכי CNC.',
          image_url: '', overlay_opacity: 70, cta_url: '',
        },
        {
          title_en: 'Professional Carpentry', title_he: 'נגרות מקצועית',
          subtitle_en: 'Custom Interior Fabrication', subtitle_he: 'ייצור פנים מותאם',
          description_en: 'Using CNC machining to improve accuracy and stabilize production.',
          description_he: 'שימוש ב-CNC לשיפור דיוק.',
          image_url: '', overlay_opacity: 75, cta_url: '',
        },
        {
          title_en: 'Interior Contractors', title_he: 'קבלני פנים',
          subtitle_en: 'Residential & Commercial', subtitle_he: 'מגורים ומסחר',
          description_en: 'Requiring predictable production and reliable integration.',
          description_he: 'דורשים ייצור צפוי ואינטגרציה אמינה.',
          image_url: '', overlay_opacity: 80, cta_url: '',
        },
      ],
    } as PartnerBoxesData,
  },
];

export const BLOCK_BY_TYPE = Object.fromEntries(
  BLOCK_REGISTRY.map(d => [d.type, d])
) as Record<BlockType, BlockTypeDef>;
