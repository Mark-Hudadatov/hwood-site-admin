/**
 * DOMAIN TYPES - Canonical Data Model
 * ====================================
 * Updated for bilingual support and CMS integration
 * 
 * HIERARCHY:
 * Service → Subservice → ProductCategory → Product
 */

// =============================================================================
// CORE DOMAIN ENTITIES
// =============================================================================

/**
 * Service - Top-level offering
 */
export interface Service {
  id: string;
  slug: string;
  title: string;                   // Localized title
  description: string;             // Localized description
  imageUrl: string;
  heroImageUrl?: string;
  accentColor?: string;
  visibilityStatus?: 'visible' | 'hidden' | 'coming_soon';
}

/**
 * Subservice - Specific process within a Service
 */
export interface Subservice {
  id: string;
  slug: string;
  serviceId: string;
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
  visibilityStatus?: 'visible' | 'hidden' | 'coming_soon';
}

/**
 * ProductCategory - Grouping of products within a Subservice
 */
export interface ProductCategory {
  id: string;
  slug: string;
  subserviceId: string;
  title: string;
  description: string;
  sortOrder?: number;
  visibilityStatus?: 'visible' | 'hidden' | 'coming_soon';
}

/**
 * Product - Actual item/SKU
 */
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
  visibilityStatus?: 'visible' | 'hidden' | 'not_in_stock';
}

/**
 * Product Specification - Key-value pairs for product details
 */
export interface ProductSpecification {
  label: string;
  value: string;
  unit?: string;
}

// =============================================================================
// STORIES / ARTICLES
// =============================================================================

export type StoryType = 'EVENTS' | 'CUSTOMER STORY' | 'CASE STUDY';

export interface Story {
  id: string;
  slug?: string;
  title: string;
  date: string;
  type: StoryType;
  imageUrl: string;
  excerpt?: string;
  content?: string;                // Markdown content for full article
  isGenerated?: boolean;
}

// =============================================================================
// HERO SLIDES
// =============================================================================

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;              // Video URL (external)
  ctaText?: string;
  ctaLink?: string;
}

// =============================================================================
// COMPANY INFO
// =============================================================================

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

// =============================================================================
// FORMS
// =============================================================================

/**
 * Contact Form submission data
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Quote Request - Form submission data
 */
export interface QuoteRequest {
  id?: string;
  productId?: string;
  productTitle?: string;
  // Customer info
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  // Project details
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  message?: string;
  productInterest?: string[];
  // Metadata
  submittedAt?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Visibility status for all entities
 */
export type VisibilityStatus = 'visible' | 'hidden' | 'coming_soon' | 'not_in_stock';
