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
// PRODUCT CONFIGURATION SYSTEM
// =============================================================================

/**
 * Configuration Option Type - Categories of configurable options
 * Examples: "Width", "Carcass Color", "Drawer System"
 */
export interface ConfigOptionType {
  id: string;
  slug: string;                    // 'width', 'carcass_color'
  name: string;                    // Display name (localized)
  description?: string;            // Help text (localized)
  inputType: 'button_group' | 'color_picker' | 'dropdown' | 'checkbox_group';
  unit?: string;                   // 'cm', 'mm', etc.
  sortOrder: number;
  values: ConfigOptionValue[];     // Available values for this option type
  isRequired?: boolean;            // Whether selection is required
  defaultValueId?: string;         // Default value ID
}

/**
 * Configuration Option Value - Individual selectable values
 * Examples: "30cm", "White", "Soft Close"
 */
export interface ConfigOptionValue {
  id: string;
  slug: string;                    // 'white', '30cm'
  label: string;                   // Display label (localized)
  value: string;                   // Actual value
  colorHex?: string;               // For color pickers
  imageUrl?: string;               // For texture previews
  icon?: string;                   // Icon name
  priceModifier?: number;          // Price adjustment
  sortOrder: number;               // Display order
  isDefault?: boolean;             // Default selection
  isDisabled?: boolean;            // Disabled for this product
}

/**
 * Subservice Config Template - Links config options to a subservice
 */
export interface SubserviceConfigTemplate {
  subserviceId: string;
  optionTypeId: string;
  isEnabled: boolean;
  isRequired: boolean;
  sortOrder: number;
  defaultValueId?: string;
}

/**
 * Product Config Override - Product-level customization
 */
export interface ProductConfigOverride {
  productId: string;
  optionTypeId: string;
  isEnabled: boolean;
  defaultValueId?: string;
  disabledValueIds?: string[];
}

/**
 * Product Configuration - Full configuration for a product
 * Combines subservice template + product overrides
 */
export interface ProductConfiguration {
  productId: string;
  subserviceId: string;
  options: ConfigOptionType[];     // Available options with their values
  defaults: Record<string, string>;// Default selections { optionSlug: valueSlug }
}

/**
 * Configuration Selection - User's selected configuration values
 */
export interface ConfigurationSelection {
  [optionTypeSlug: string]: string;  // { 'width': '60cm', 'carcass_color': 'white' }
}

/**
 * Saved Configuration - Persisted configuration for quote requests
 */
export interface SavedConfiguration {
  id: string;
  productId: string;
  configData: ConfigurationSelection;
  createdAt: string;
}

/**
 * Feature - Product feature item
 */
export interface Feature {
  id: string;
  title: string;                   // Localized title
  description?: string;            // Localized description
  icon?: string;                   // Icon name
}

/**
 * Product Document - Downloadable files
 */
export interface ProductDocument {
  id: string;
  type: 'datasheet' | 'assembly' | 'cad' | '3d_model' | 'certificate';
  title: string;                   // Display title (localized)
  fileUrl: string;
  fileSize?: string;               // '2.4 MB'
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
