/**
 * DOMAIN TYPES - Canonical Data Model
 * ====================================
 * This file defines the stable interfaces for the entire application.
 * All data (mock or real) must conform to these types.
 * 
 * HIERARCHY:
 * Service → Subservice → ProductCategory → Product
 * 
 * EXAMPLE CHAIN:
 * "Modular bodies and cabinets" → "Kitchen modules" → "Upper" → "N1"
 */

// =============================================================================
// CORE DOMAIN ENTITIES
// =============================================================================

export type ServiceBrand = 'hwood' | 'skylum';

export type ServiceOrderType =
  | 'browse-and-order'
  | 'send-file-and-process'
  | 'describe-and-request'
  | 'informational';

/**
 * Service - Top-level offering
 * Examples: "Modular bodies and cabinets", "CNC processing of panels", "Furniture fronts production"
 */
export interface Service {
  id: string;
  slug: string;                    // URL-friendly: "modular-bodies-and-cabinets"
  title: string;                   // Display: "Modular bodies and cabinets"
  description: string;
  imageUrl: string;
  heroImageUrl?: string;           // Optional larger hero image for service page
  accentColor?: string;            // Optional brand color (e.g., "#D48F28")
  subtitle?: string;
  ctaText?: string;
  visibilityStatus?: string;
  brand?: ServiceBrand;
  orderType?: ServiceOrderType;
}

/**
 * Subservice - Specific process within a Service
 * Examples: "Kitchen modules", "Bathrooms and niches", "Wardrobes and closets"
 */
export interface Subservice {
  id: string;
  slug: string;                    // URL-friendly: "kitchen-modules"
  serviceId: string;               // FK to parent Service
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
}

/**
 * ProductCategory - Grouping of products within a Subservice
 * Examples: "Upper", "Lower", "Base", "Islands"
 */
export interface ProductCategory {
  id: string;
  slug: string;                    // URL-friendly: "upper"
  subserviceId: string;            // FK to parent Subservice
  title: string;
  description: string;
  sortOrder?: number;              // For tab ordering
}

/**
 * Product - Actual item/SKU
 * Examples: "N1", "N2", "N3" (kitchen modules)
 */
export interface Product {
  id: string;
  slug: string;                    // URL-friendly: "n1-upper-module"
  categoryId: string;              // FK to parent ProductCategory
  title: string;
  subtitle?: string;               // Short tagline
  description: string;
  imageUrl: string;
  galleryImages?: string[];        // Additional product images
  videoUrl?: string;               // Product video (360° spin, etc.)
  features?: string[];             // Key features list
  specifications?: ProductSpecification[];
  has3DView?: boolean;             // Whether 360° view is available
  modelUrl?: string;               // URL to GLB/glTF 3D model file
  visibilityStatus?: string;
}

/**
 * Product Specification - Key-value pairs for product details
 */
export interface ProductSpecification {
  label: string;                   // e.g., "Working Field Size"
  value: string;                   // e.g., "3000mm"
  unit?: string;                   // e.g., "mm"
}

// =============================================================================
// SUPPORTING ENTITIES (for other sections of the site)
// =============================================================================

/**
 * Story - News/Events items for "What's Next" section
 */
export type StoryType = 'EVENTS' | 'CUSTOMER STORY';

export interface Story {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: StoryType;
  imageUrl: string;
  excerpt?: string;
  content?: string;
  isGenerated?: boolean;
}

/**
 * Quote Request - Form submission data
 */
export interface QuoteRequest {
  id?: string;
  productId: string;
  productTitle: string;
  // Customer info
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  // Configuration
  selectedOptions?: Record<string, string>;
  message?: string;
  // Metadata
  submittedAt?: string;
}
export interface OrderContact {
  name: string;
  phone: string;
  company?: string;
}

export interface BrowseOrderSubmission extends OrderContact {
  orderType: 'browse-and-order';
  serviceSlug: string;
  productId?: string;
  productTitle?: string;
  selectedConfiguration?: Record<string, string>;
  quantity?: string;
  comment?: string;
}

export interface SendFileSubmission extends OrderContact {
  orderType: 'send-file-and-process';
  serviceSlug: string;
  subserviceSlug?: string;
  operationType?: string;
  material?: string;
  thickness?: string;
  volume?: string;
  deadline?: string;
  description?: string;
  fileUrl?: string;
}

export interface DescribeRequestSubmission extends OrderContact {
  orderType: 'describe-and-request';
  serviceSlug: string;
  clientRole: 'designer' | 'contractor' | 'developer' | 'private';
  objectType?: string;
  material?: string;
  approximateVolume?: string;
  description: string;
  fileUrl?: string;
}

export type OrderSubmission =
  | BrowseOrderSubmission
  | SendFileSubmission
  | DescribeRequestSubmission;

export interface QuoteSubmissionResult {
  success: boolean;
  error?: string;
}

/**
 * Company Info - Basic company details
 */
export interface CompanyInfo {
  name: string;
  tagline?: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}

/**
 * Hero Slide - Homepage hero carousel items
 */
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;                   // If undefined, rendered as current page (no link)
}

/**
 * API response wrapper (for future real API)
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// =============================================================================
// PRODUCT CONFIGURATION TYPES
// =============================================================================

/**
 * Configuration Option Type - e.g., "Width", "Color", "Drawer System"
 */
export interface ConfigOptionType {
  id: string;
  slug: string;
  name: string;
  nameHe?: string;
  description?: string;
  descriptionHe?: string;
  inputType: 'button_group' | 'color_picker' | 'dropdown' | 'checkbox_group';
  unit?: string;
  sortOrder: number;
  values: ConfigOptionValue[];
}

/**
 * Configuration Option Value - e.g., "60cm", "White", "Soft Close"
 */
export interface ConfigOptionValue {
  id: string;
  slug: string;
  label: string;
  labelHe?: string;
  value: string;
  colorHex?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  isDisabled?: boolean;  // For product-level overrides
}

/**
 * Product Configuration - Complete config for a product
 */
export interface ProductConfiguration {
  productId: string;
  subserviceId: string;
  options: ConfigOptionType[];
  defaults: Record<string, string>;  // optionSlug -> valueSlug
}

/**
 * Selected Configuration - User's selections
 */
export interface SelectedConfiguration {
  [optionSlug: string]: string;  // optionSlug -> valueSlug
}

/**
 * Feature - Product feature from library
 */
export interface Feature {
  id: string;
  slug: string;
  name: string;
  nameHe?: string;
  description?: string;
  descriptionHe?: string;
  iconName?: string;
}

// =============================================================================
// PAGE BUILDER TYPES
// =============================================================================

export type BlockType =
  | 'hero_banner'
  | 'text_columns'
  | 'image_text'
  | 'stats_row'
  | 'cta_band'
  | 'gallery_grid'
  | 'testimonial'
  | 'accordion_faq'
  | 'service_cards'
  | 'rich_text'
  | 'spacer'
  | 'video_embed'
  | 'contact_form_embed'
  | 'page_hero'
  | 'partners_marquee'
  | 'marketing_split'
  | 'stories_index'
  | 'partner_boxes';

// Field types that drive the right-panel settings UI
export type FieldType =
  | 'text' | 'textarea' | 'image' | 'url' | 'color'
  | 'select' | 'toggle' | 'number'
  | 'bilingual_text' | 'bilingual_textarea'
  | 'repeater';

export interface FieldOption { label: string; value: string; }

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  subFields?: FieldDef[];
}

// Per-block data shapes
export interface HeroBannerData {
  heading_en: string; heading_he: string;
  subheading_en: string; subheading_he: string;
  bg_image_url: string; bg_color: string;
  text_color: string; overlay_opacity: number;
  cta_text_en: string; cta_text_he: string;
  cta_url: string; cta_style: 'brand' | 'white' | 'outline';
  height: 'small' | 'medium' | 'large' | 'fullscreen';
  content_align: 'left' | 'center' | 'right';
}

export interface TextColumnItem {
  heading_en: string; heading_he: string;
  body_en: string; body_he: string;
  icon_name: string;
}
export interface TextColumnsData {
  columns: TextColumnItem[];
  layout: '1' | '2' | '3';
  bg_color: string; text_color: string;
  padding: 'tight' | 'normal' | 'spacious';
}

export interface ImageTextData {
  eyebrow_en: string; eyebrow_he: string;
  heading_en: string; heading_he: string;
  body_en: string; body_he: string;
  image_url: string; image_side: 'left' | 'right';
  image_aspect: 'square' | 'portrait' | 'landscape';
  cta_text_en: string; cta_text_he: string;
  cta_url: string; bg_color: string; text_color: string;
}

export interface StatItem {
  value_en: string; value_he: string;
  label_en: string; label_he: string;
  icon_name: string;
}
export interface StatsRowData {
  stats: StatItem[];
  bg_color: string; text_color: string;
  style: 'plain' | 'cards' | 'dark';
}

export interface CtaBandData {
  heading_en: string; heading_he: string;
  subheading_en: string; subheading_he: string;
  cta_primary_text_en: string; cta_primary_text_he: string;
  cta_primary_url: string;
  cta_secondary_text_en: string; cta_secondary_text_he: string;
  cta_secondary_url: string;
  bg_color: string; text_color: string;
  style: 'centered' | 'split';
}

export interface GalleryImage { url: string; caption_en: string; caption_he: string; }
export interface GalleryGridData {
  images: GalleryImage[];
  columns: 2 | 3 | 4; gap: 'tight' | 'normal' | 'spacious';
  style: 'plain' | 'rounded' | 'card';
  bg_color: string;
}

export interface TestimonialData {
  quote_en: string; quote_he: string;
  author_name: string;
  author_title_en: string; author_title_he: string;
  author_image_url: string; company_name: string;
  bg_color: string; text_color: string;
  style: 'centered' | 'card' | 'side-image';
}

export interface FaqItem {
  question_en: string; question_he: string;
  answer_en: string; answer_he: string;
}
export interface AccordionFaqData {
  heading_en: string; heading_he: string;
  items: FaqItem[];
  bg_color: string; text_color: string;
  default_open_index: number;
}

export interface ServiceCardItem {
  title_en: string; title_he: string;
  description_en: string; description_he: string;
  image_url: string; link_url: string; accent_color: string;
}
export interface ServiceCardsData {
  heading_en: string; heading_he: string;
  subheading_en: string; subheading_he: string;
  source: 'auto' | 'manual';
  service_ids: string;
  manual_cards: ServiceCardItem[];
  bg_color: string; columns: 2 | 3 | 4;
}

export interface RichTextData {
  content_en: string; content_he: string;
  bg_color: string; text_color: string;
  max_width: 'narrow' | 'normal' | 'wide' | 'full';
  padding: 'tight' | 'normal' | 'spacious';
}

export interface SpacerData { height_px: number; bg_color: string; }

export interface VideoEmbedData {
  heading_en: string; heading_he: string;
  video_url: string; poster_image_url: string;
  autoplay: boolean; loop: boolean;
  bg_color: string;
  caption_en: string; caption_he: string;
}

export interface ContactFormEmbedData {
  heading_en: string; heading_he: string;
  form_type: 'contact' | 'quote';
  bg_color: string; text_color: string;
}

// ─── New block data types ─────────────────────────────────────────────────────

export interface PageHeroData {
  eyebrow_en: string; eyebrow_he: string;
  heading_en: string; heading_he: string;
  subheading_en: string; subheading_he: string;
  bg_color: string; text_color: string;
  cta1_text_en: string; cta1_text_he: string; cta1_url: string;
  cta2_text_en: string; cta2_text_he: string; cta2_url: string;
  decoration: 'none' | 'skew';
}

export interface LogoItem { url: string; alt_en: string; alt_he: string; }
export interface PartnersMarqueeData {
  heading_en: string; heading_he: string;
  speed: 'slow' | 'medium' | 'fast';
  bg_color: string;
  logos: LogoItem[];
}

export interface MarketingSplitData {
  eyebrow_en: string; eyebrow_he: string;
  title_en: string; title_he: string;
  highlight_en: string; highlight_he: string;
  highlight_color: string;
  body1_en: string; body1_he: string;
  body2_en: string; body2_he: string;
  link_text_en: string; link_text_he: string;
  link_url: string;
  bg_color: string; text_color: string;
}

export interface StoriesIndexData {
  heading_en: string; heading_he: string;
  subheading_en: string; subheading_he: string;
  show_filter: boolean;
  limit: number;
  columns: 2 | 3;
  bg_color: string;
}

export interface PartnerBoxItem {
  title_en: string; title_he: string;
  subtitle_en: string; subtitle_he: string;
  description_en: string; description_he: string;
  image_url: string; overlay_opacity: number; cta_url: string;
}
export interface PartnerBoxesData {
  boxes: PartnerBoxItem[];
  bg_color: string;
}

export type BlockData =
  | HeroBannerData | TextColumnsData | ImageTextData
  | StatsRowData | CtaBandData | GalleryGridData
  | TestimonialData | AccordionFaqData | ServiceCardsData
  | RichTextData | SpacerData | VideoEmbedData | ContactFormEmbedData
  | PageHeroData | PartnersMarqueeData | MarketingSplitData
  | StoriesIndexData | PartnerBoxesData;

// Common style overrides applied to every block at the wrapper level.
// These override the block-component's own internal styles where possible.
export interface BlockCommonStyle {
  // Style
  wrapBg?: string;             // wrapper background (overrides block's own bg)
  wrapTextColor?: string;      // wrapper text color
  paddingPreset?: 'tight' | 'normal' | 'spacious';
  customPaddingY?: number;     // px, replaces paddingPreset when set
  // Layout
  maxWidth?: 'full' | 'normal' | 'narrow';
  textAlign?: 'left' | 'center' | 'right';
  // Advanced
  customClass?: string;
  visibility?: 'always' | 'desktop-only' | 'mobile-only';
}

export interface Block {
  id: string;
  type: BlockType;
  data: BlockData;
  commonStyle?: BlockCommonStyle;
  visible: boolean;
}

export type PageStatus = 'draft' | 'published';

export interface AdminPage {
  id: string;
  slug: string;
  title_en: string;
  title_he: string;
  status: PageStatus;
  blocks: Block[];
  meta_description_en?: string;
  meta_description_he?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string; slug: string;
  titleEn: string; titleHe: string;
  status: PageStatus; blocks: Block[];
  metaDescriptionEn?: string; metaDescriptionHe?: string;
  sortOrder: number; createdAt: string; updatedAt: string;
}

export interface DesignTokens {
  brand: string; brand_hover: string; brand_dark: string;
  surface_dark: string; neutral_900: string;
  font_sans: string; base_radius: string; section_gap: string;
}
