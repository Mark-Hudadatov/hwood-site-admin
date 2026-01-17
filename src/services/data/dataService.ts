/**
 * DATA SERVICE - HWOOD
 * =====================
 * Reads data from Supabase with fallback to mock data
 */

import { supabase } from '../supabase';
import {
  Service,
  Subservice,
  ProductCategory,
  Product,
  Story,
  HeroSlide,
  CompanyInfo,
} from '../../domain/types';

// Import mock data for fallback
import {
  SERVICES as MOCK_SERVICES,
  SUBSERVICES as MOCK_SUBSERVICES,
  PRODUCT_CATEGORIES as MOCK_CATEGORIES,
  PRODUCTS as MOCK_PRODUCTS,
  STORIES as MOCK_STORIES,
  HERO_SLIDES as MOCK_HERO_SLIDES,
  COMPANY_INFO as MOCK_COMPANY_INFO,
} from './mockData';

// Current language state
let currentLang: 'en' | 'he' = 'en';

// Get current language from localStorage
const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return currentLang;
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

// Set language (called from i18n)
export function setLanguage(lang: 'en' | 'he'): void {
  currentLang = lang;
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using mock services');
      return MOCK_SERVICES;
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
      imageUrl: s.image_url || '',
      heroImageUrl: s.hero_image_url,
      accentColor: s.accent_color,
      visibilityStatus: s.visibility_status,
    }));
  } catch (e) {
    console.error('Error fetching services:', e);
    return MOCK_SERVICES;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_SERVICES.find((s) => s.slug === slug) || null;
    }

    const lang = getCurrentLang();
    return {
      id: data.id,
      slug: data.slug,
      title: lang === 'he' && data.title_he ? data.title_he : data.title_en,
      description: lang === 'he' && data.description_he ? data.description_he : data.description_en || '',
      imageUrl: data.image_url || '',
      heroImageUrl: data.hero_image_url,
      accentColor: data.accent_color,
    };
  } catch (e) {
    return MOCK_SERVICES.find((s) => s.slug === slug) || null;
  }
}

// ============================================================================
// SUBSERVICES
// ============================================================================

export async function getSubservices(): Promise<Subservice[]> {
  try {
    const { data, error } = await supabase
      .from('subservices')
      .select('*')
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_SUBSERVICES;
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      serviceId: s.service_id,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
      imageUrl: s.image_url || '',
      heroImageUrl: s.hero_image_url,
    }));
  } catch (e) {
    return MOCK_SUBSERVICES;
  }
}

export async function getSubservicesByService(serviceId: string): Promise<Subservice[]> {
  try {
    const { data, error } = await supabase
      .from('subservices')
      .select('*')
      .eq('service_id', serviceId)
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_SUBSERVICES.filter((s) => s.serviceId === serviceId);
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      serviceId: s.service_id,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
      imageUrl: s.image_url || '',
      heroImageUrl: s.hero_image_url,
    }));
  } catch (e) {
    return MOCK_SUBSERVICES.filter((s) => s.serviceId === serviceId);
  }
}

export async function getSubserviceBySlug(slug: string): Promise<Subservice | null> {
  try {
    const { data, error } = await supabase
      .from('subservices')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_SUBSERVICES.find((s) => s.slug === slug) || null;
    }

    const lang = getCurrentLang();
    return {
      id: data.id,
      slug: data.slug,
      serviceId: data.service_id,
      title: lang === 'he' && data.title_he ? data.title_he : data.title_en,
      description: lang === 'he' && data.description_he ? data.description_he : data.description_en || '',
      imageUrl: data.image_url || '',
      heroImageUrl: data.hero_image_url,
    };
  } catch (e) {
    return MOCK_SUBSERVICES.find((s) => s.slug === slug) || null;
  }
}

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }

    const lang = getCurrentLang();
    return data.map((c: any) => ({
      id: c.id,
      slug: c.slug,
      subserviceId: c.subservice_id,
      title: lang === 'he' && c.title_he ? c.title_he : c.title_en,
      description: lang === 'he' && c.description_he ? c.description_he : c.description_en || '',
      sortOrder: c.sort_order,
    }));
  } catch (e) {
    return MOCK_CATEGORIES;
  }
}

export async function getCategoriesBySubservice(subserviceId: string): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('subservice_id', subserviceId)
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES.filter((c) => c.subserviceId === subserviceId);
    }

    const lang = getCurrentLang();
    return data.map((c: any) => ({
      id: c.id,
      slug: c.slug,
      subserviceId: c.subservice_id,
      title: lang === 'he' && c.title_he ? c.title_he : c.title_en,
      description: lang === 'he' && c.description_he ? c.description_he : c.description_en || '',
      sortOrder: c.sort_order,
    }));
  } catch (e) {
    return MOCK_CATEGORIES.filter((c) => c.subserviceId === subserviceId);
  }
}

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('visibility_status', ['visible', 'not_in_stock'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS;
    }

    const lang = getCurrentLang();
    return data.map((p: any) => mapProduct(p, lang));
  } catch (e) {
    return MOCK_PRODUCTS;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .in('visibility_status', ['visible', 'not_in_stock'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
    }

    const lang = getCurrentLang();
    return data.map((p: any) => mapProduct(p, lang));
  } catch (e) {
    return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    const lang = getCurrentLang();
    return mapProduct(data, lang);
  } catch (e) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

function mapProduct(p: any, lang: 'en' | 'he'): Product {
  return {
    id: p.id,
    slug: p.slug,
    categoryId: p.category_id,
    title: lang === 'he' && p.title_he ? p.title_he : p.title_en,
    subtitle: lang === 'he' && p.subtitle_he ? p.subtitle_he : p.subtitle_en,
    description: lang === 'he' && p.description_he ? p.description_he : p.description_en || '',
    imageUrl: p.image_url || '',
    galleryImages: p.gallery_images || [],
    videoUrl: p.video_url,
    features: lang === 'he' && p.features_he ? p.features_he : p.features_en || [],
    specifications: p.specifications || [],
    has3DView: p.has_3d_view,
    visibilityStatus: p.visibility_status,
  };
}

// ============================================================================
// STORIES
// ============================================================================

export async function getStories(): Promise<Story[]> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('is_visible', true)
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_STORIES;
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      date: formatDate(s.date),
      type: s.type as any,
      imageUrl: s.image_url || '',
      excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en,
      content: lang === 'he' && s.content_he ? s.content_he : s.content_en,
    }));
  } catch (e) {
    return MOCK_STORIES;
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_STORIES.find((s) => s.slug === slug) || null;
    }

    const lang = getCurrentLang();
    return {
      id: data.id,
      slug: data.slug,
      title: lang === 'he' && data.title_he ? data.title_he : data.title_en,
      date: formatDate(data.date),
      type: data.type as any,
      imageUrl: data.image_url || '',
      excerpt: lang === 'he' && data.excerpt_he ? data.excerpt_he : data.excerpt_en,
      content: lang === 'he' && data.content_he ? data.content_he : data.content_en,
    };
  } catch (e) {
    return null;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  });
}

// ============================================================================
// HERO SLIDES
// ============================================================================

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .limit(3);

    if (error || !data || data.length === 0) {
      return MOCK_HERO_SLIDES;
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      subtitle: lang === 'he' && s.subtitle_he ? s.subtitle_he : s.subtitle_en || '',
      imageUrl: s.image_url || '',
      videoUrl: s.video_url,
      ctaText: lang === 'he' && s.cta_text_he ? s.cta_text_he : s.cta_text_en,
      ctaLink: s.cta_link,
    }));
  } catch (e) {
    return MOCK_HERO_SLIDES;
  }
}

// ============================================================================
// COMPANY INFO
// ============================================================================

export async function getCompanyInfo(): Promise<CompanyInfo> {
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return MOCK_COMPANY_INFO;
    }

    const lang = getCurrentLang();
    return {
      name: lang === 'he' && data.name_he ? data.name_he : data.name_en || 'HWOOD',
      tagline: lang === 'he' && data.tagline_he ? data.tagline_he : data.tagline_en || '',
      description: lang === 'he' && data.description_he ? data.description_he : data.description_en || '',
      phone: data.phone || '',
      email: data.email || '',
      address: lang === 'he' && data.address_he ? data.address_he : data.address_en || '',
    };
  } catch (e) {
    return MOCK_COMPANY_INFO;
  }
}

// ============================================================================
// SOCIAL LINKS
// ============================================================================

export async function getSocialLinks(): Promise<{ platform: string; url: string }[]> {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data
      .filter((s: any) => s.url)
      .map((s: any) => ({
        platform: s.platform,
        url: s.url,
      }));
  } catch (e) {
    return [];
  }
}

// ============================================================================
// FORM SUBMISSIONS
// ============================================================================

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    return !error;
  } catch (e) {
    console.error('Failed to submit contact form:', e);
    return false;
  }
}

export async function submitQuoteRequest(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  message?: string;
  product_interest?: string[];
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quote_submissions')
      .insert([formData]);

    return !error;
  } catch (e) {
    console.error('Failed to submit quote request:', e);
    return false;
  }
}

// ============================================================================
// BREADCRUMB HELPERS
// ============================================================================

export async function getProductBreadcrumb(productSlug: string) {
  const product = await getProductBySlug(productSlug);
  if (!product) return null;

  const categories = await getProductCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  if (!category) return null;

  const subservices = await getSubservices();
  const subservice = subservices.find((s) => s.id === category.subserviceId);
  if (!subservice) return null;

  const services = await getServices();
  const service = services.find((s) => s.id === subservice.serviceId);
  if (!service) return null;

  return { service, subservice, category, product };
}

// Alias for backward compatibility
export const getProductWithBreadcrumb = getProductBreadcrumb;

// ============================================================================
// NAVIGATION DATA
// ============================================================================

export async function getNavigationData(): Promise<{
  services: (Service & { subservices: Subservice[] })[];
}> {
  const [services, subservices] = await Promise.all([
    getServices(),
    getSubservices(),
  ]);

  const servicesWithSubs = services.map((service) => ({
    ...service,
    subservices: subservices.filter((sub) => sub.serviceId === service.id),
  }));

  return { services: servicesWithSubs };
}

// ============================================================================
// SERVICE-BASED QUERIES
// ============================================================================

export async function getSubservicesByServiceSlug(serviceSlug: string): Promise<Subservice[]> {
  const service = await getServiceBySlug(serviceSlug);
  if (!service) return [];
  return getSubservicesByService(service.id);
}

// ============================================================================
// SUBSERVICE PAGE DATA
// ============================================================================

export async function getSubservicePageData(subserviceSlug: string): Promise<{
  service: Service;
  subservice: Subservice;
  categories: ProductCategory[];
  products: Product[];
} | null> {
  const subservice = await getSubserviceBySlug(subserviceSlug);
  if (!subservice) return null;

  const services = await getServices();
  const service = services.find((s) => s.id === subservice.serviceId);
  if (!service) return null;

  const categories = await getCategoriesBySubservice(subservice.id);
  
  // Get all products for all categories in this subservice
  const categoryIds = categories.map((c) => c.id);
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => categoryIds.includes(p.categoryId));

  return { service, subservice, categories, products };
}
