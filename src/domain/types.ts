/**
 * DOMAIN TYPES - Canonical Data Model v2.1
 * ==========================================
 * CHANGES v2.1:
 *   + Service.brand: 'hwood' | 'skylum'
 *   + Service.orderType: ServiceOrderType
 *   + Service.visibilityStatus
 */

// =============================================================================
// BRAND & ORDER TYPE (v2.1)
// =============================================================================

export type ServiceBrand = 'hwood' | 'skylum';

export type ServiceOrderType =
  | 'browse-and-order'
  | 'send-file-and-process'
  | 'describe-and-request'
  | 'informational';

// =============================================================================
// CORE DOMAIN ENTITIES
// =============================================================================

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
  accentColor?: string;
  // v2.1 fields
  brand?: ServiceBrand;
  orderType?: ServiceOrderType;
  visibilityStatus?: string;
}

export interface Subservice {
  id: string;
  slug: string;
  serviceId: string;
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
  visibilityStatus?: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  subserviceId: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  videoUrl?: string;
  features?: string[];
  specifications?: ProductSpecification[];
  has3DView?: boolean;
  modelUrl?: string;
  visibilityStatus?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
  unit?: string;
}

// =============================================================================
// SUPPORTING ENTITIES
// =============================================================================

export type StoryType = 'EVENTS' | 'CUSTOMER STORY';

export interface Story {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  type: StoryType;
  date?: string;
  visibilityStatus?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CompanyInfo {
  name?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  openingHours?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  about?: string;
  aboutHe?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// =============================================================================
// PRODUCT CONFIGURATION TYPES
// =============================================================================

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
  isDisabled?: boolean;
}

export interface ProductConfiguration {
  productId: string;
  subserviceId: string;
  options: ConfigOptionType[];
  defaults: Record<string, string>;
}

export interface SelectedConfiguration {
  [optionSlug: string]: string;
}

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
// ORDER SUBMISSION (quote_submissions table)
// =============================================================================

export interface OrderSubmission {
  name: string;
  phone: string;
  company?: string;
  message?: string;
  orderType?: ServiceOrderType;
  serviceSlug?: string;
  subserviceSlug?: string;
  clientRole?: string;
  material?: string;
  volume?: string;
  approximateVolume?: string;
  deadline?: string;
  fileUrl?: string;
  objectType?: string;
  operationType?: string;
  productTitle?: string;
  quantity?: string;
}

/** Returned by submitOrderForm() */
export interface QuoteSubmissionResult {
  success: boolean;
  error?: string;
}
