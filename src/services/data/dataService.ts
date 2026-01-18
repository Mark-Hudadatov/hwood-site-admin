/**
 * DATA SERVICE - FIXED WITH DEBUGGING
 * ====================================
 * Added console.log to see what's happening
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

// ============================================================================
// NO MORE MOCK DATA FALLBACK - Show real errors instead
// ============================================================================

let currentLang: 'en' | 'he' = 'en';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return currentLang;
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

export function setLanguage(lang: 'en' | 'he'): void {
  currentLang = lang;
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getServices(): Promise<Service[]> {
  console.log('[DataService] Fetching services...');
  
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    console.log('[DataService] Services response:', { data, error });

    if (error) {
      console.error('[DataService] Services ERROR:', error);
      // Return empty array instead of mock data to see real issue
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[DataService] No services found in database');
      return [];
    }

    const lang = getCurrentLang();
    const services = data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
      imageUrl: s.image_url || '',
      heroImageUrl: s.hero_image_url || '',
      accentColor: s.accent_color || '#005f5f',
      visibilityStatus: s.visibility_status,
    }));

    console.log('[DataService] Mapped services:', services);
    return services;
  } catch (e) {
    console.error('[DataService] Services EXCEPTION:', e);
    return [];
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
      console.error('[DataService] getServiceBySlug error:', error);
      return null;
    }

    const lang = getCurrentLang();
    return {
      id: data.id,
      slug: data.slug,
      title: lang === 'he' && data.title_he ? data.title_he : data.title_en,
      description: lang === 'he' && data.description_he ? data.description_he : data.description_en || '',
      imageUrl: data.image_url || '',
      heroImageUrl: data.hero_image_url || '',
      accentColor: data.accent_color || '#005f5f',
    };
  } catch (e) {
    console.error('[DataService] getServiceBySlug exception:', e);
    return null;
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
      console.warn('[DataService] No subservices found');
      return [];
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      serviceId: s.service_id,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
      imageUrl: s.image_url || '',
      heroImageUrl: s.hero_image_url || '',
    }));
  } catch (e) {
    console.error('[DataService] getSubservices exception:', e);
    return [];
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
      return [];
    }

    const lang = getCurrentLang();
    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      serviceId: s.service_id,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
      imageUrl: s.image_url || '',
      heroImageUrl: s.hero_image_url || '',
    }));
  } catch (e) {
    return [];
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
      return null;
    }

    const lang = getCurrentLang();
    return {
      id: data.id,
      slug: data.slug,
      serviceId: data.service_id,
      title: lang === 'he' && data.title_he ? data.title_he : data.title_en,
      description: lang === 'he' && data.description_he ? data.description_he : data.description_en || '',
      imageUrl: data.image_url || '',
      heroImageUrl: data.hero_image_url || '',
    };
  } catch (e) {
    return null;
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
      return [];
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
    return [];
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
      return [];
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
    return [];
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
      return [];
    }

    const lang = getCurrentLang();
    return data.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      categoryId: p.category_id,
      title: lang === 'he' && p.title_he ? p.title_he : p.title_en,
      subtitle: lang === 'he' && p.subtitle_he ? p.subtitle_he : p.subtitle_en || '',
      description: lang === 'he' && p.description_he ? p.description_he : p.description_en || '',
      imageUrl: p.image_url || '',
      galleryImages: p.gallery_images || [],
      videoUrl: p.video_url,
      features: lang === 'he' && p.features_he ? p.features_he : p.features_en || [],
      specifications: p.specifications || [],
      has3DView: p.has_3d_view,
      visibilityStatus: p.visibility_status,
    }));
  } catch (e) {
    return [];
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
      return [];
    }

    const lang = getCurrentLang();
    return data.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      categoryId: p.category_id,
      title: lang === 'he' && p.title_he ? p.title_he : p.title_en,
      subtitle: lang === 'he' && p.subtitle_he ? p.subtitle_he : p.subtitle_en || '',
      description: lang === 'he' && p.description_he ? p.description_he : p.description_en || '',
      imageUrl: p.image_url || '',
      galleryImages: p.gallery_images || [],
      videoUrl: p.video_url,
      features: lang === 'he' && p.features_he ? p.features_he : p.features_en || [],
      specifications: p.specifications || [],
      has3DView: p.has_3d_view,
      visibilityStatus: p.visibility_status,
    }));
  } catch (e) {
    return [];
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
      return null;
    }

    const lang = getCurrentLang();
    return {
      id: data.id,
      slug: data.slug,
      categoryId: data.category_id,
      title: lang === 'he' && data.title_he ? data.title_he : data.title_en,
      subtitle: lang === 'he' && data.subtitle_he ? data.subtitle_he : data.subtitle_en || '',
      description: lang === 'he' && data.description_he ? data.description_he : data.description_en || '',
      imageUrl: data.image_url || '',
      galleryImages: data.gallery_images || [],
      videoUrl: data.video_url,
      features: lang === 'he' && data.features_he ? data.features_he : data.features_en || [],
      specifications: data.specifications || [],
      has3DView: data.has_3d_view,
      visibilityStatus: data.visibility_status,
    };
  } catch (e) {
    return null;
  }
}

// ============================================================================
// STORIES
// ============================================================================

export async function getStories(): Promise<Story[]> {
  console.log('[DataService] Fetching stories...');
  
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('is_visible', true)
      .order('date', { ascending: false });

    console.log('[DataService] Stories response:', { data, error });

    if (error) {
      console.error('[DataService] Stories ERROR:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[DataService] No stories found');
      return [];
    }

    const lang = getCurrentLang();
    const stories = data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
      date: formatDate(s.date),
      type: s.type as any,
      imageUrl: s.image_url || '',
      excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en,
      content: lang === 'he' && s.content_he ? s.content_he : s.content_en,
    }));

    console.log('[DataService] Mapped stories:', stories);
    return stories;
  } catch (e) {
    console.error('[DataService] Stories EXCEPTION:', e);
    return [];
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
      return null;
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
      return [];
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
    return [];
  }
}

// ============================================================================
// COMPANY INFO
// ============================================================================

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      console.error('[DataService] getCompanyInfo error:', error);
      return null;
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
    return null;
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
  
  const categoryIds = categories.map((c) => c.id);
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => categoryIds.includes(p.categoryId));

  return { service, subservice, categories, products };
}

// ============================================================================
// PRODUCT CONFIGURATION
// ============================================================================

import {
  ConfigOptionType,
  ConfigOptionValue,
  ProductConfiguration,
  SavedConfiguration,
  ConfigurationSelection,
} from '../../domain/types';

export async function getProductConfiguration(productId: string): Promise<ProductConfiguration | null> {
  try {
    // First, get the product to find its category
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, category_id')
      .eq('id', productId)
      .single();
    
    if (productError || !product) return null;
    
    // Get the category to find the subservice
    const { data: category, error: catError } = await supabase
      .from('product_categories')
      .select('id, subservice_id')
      .eq('id', product.category_id)
      .single();
    
    if (catError || !category) return null;
    
    const subserviceId = category.subservice_id;
    
    // Get all config option types
    const { data: optionTypes, error: typesError } = await supabase
      .from('config_option_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (typesError || !optionTypes) return null;
    
    // Get all config option values
    const { data: optionValues, error: valuesError } = await supabase
      .from('config_option_values')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (valuesError) return null;
    
    // Get subservice templates (which options are enabled)
    const { data: templates, error: templatesError } = await supabase
      .from('subservice_config_templates')
      .select('*')
      .eq('subservice_id', subserviceId)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true });
    
    if (templatesError) return null;
    
    // Get product overrides
    const { data: overrides, error: overridesError } = await supabase
      .from('product_config_overrides')
      .select('*')
      .eq('product_id', productId);
    
    if (overridesError) return null;
    
    const lang = getCurrentLang();
    
    // Build the configuration
    const options: ConfigOptionType[] = (templates || [])
      .map(template => {
        const optionType = optionTypes.find(t => t.id === template.option_type_id);
        if (!optionType) return null;
        
        const override = (overrides || []).find(o => o.option_type_id === template.option_type_id);
        
        // Skip if product has disabled this option
        if (override && !override.is_enabled) return null;
        
        // Get values for this option type
        const disabledValueIds = override?.disabled_value_ids || [];
        const typeValues = (optionValues || [])
          .filter(v => v.option_type_id === optionType.id && !disabledValueIds.includes(v.id))
          .map(v => ({
            id: v.id,
            slug: v.slug,
            label: lang === 'he' && v.label_he ? v.label_he : v.label_en,
            value: v.value,
            colorHex: v.color_hex || undefined,
            imageUrl: v.image_url || undefined,
            icon: v.icon || undefined,
            priceModifier: v.price_modifier || 0,
            sortOrder: v.sort_order,
            isDisabled: false
          }));
        
        if (typeValues.length === 0) return null;
        
        return {
          id: optionType.id,
          slug: optionType.slug,
          name: lang === 'he' && optionType.name_he ? optionType.name_he : optionType.name_en,
          description: lang === 'he' && optionType.description_he ? optionType.description_he : optionType.description_en || undefined,
          inputType: optionType.input_type as ConfigOptionType['inputType'],
          unit: optionType.unit || undefined,
          sortOrder: template.sort_order,
          values: typeValues,
          isRequired: template.is_required,
          defaultValueId: override?.default_value_id || template.default_value_id
        };
      })
      .filter(Boolean) as ConfigOptionType[];
    
    return {
      productId,
      subserviceId,
      options
    };
  } catch (e) {
    console.error('[DataService] getProductConfiguration error:', e);
    return null;
  }
}

export async function saveProductConfiguration(
  productId: string,
  configData: ConfigurationSelection
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('saved_configurations')
      .insert([{
        product_id: productId,
        config_data: configData
      }])
      .select()
      .single();
    
    if (error) {
      console.error('[DataService] saveProductConfiguration error:', error);
      return null;
    }
    
    return data.id;
  } catch (e) {
    console.error('[DataService] saveProductConfiguration exception:', e);
    return null;
  }
}

export async function getSavedConfiguration(configId: string): Promise<SavedConfiguration | null> {
  try {
    const { data, error } = await supabase
      .from('saved_configurations')
      .select('*')
      .eq('id', configId)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      productId: data.product_id,
      configData: data.config_data,
      createdAt: data.created_at
    };
  } catch (e) {
    return null;
  }
}

// Helper to get subservice ID from product ID
export async function getSubserviceIdForProduct(productId: string): Promise<string | null> {
  try {
    const { data: product } = await supabase
      .from('products')
      .select('category_id')
      .eq('id', productId)
      .single();
    
    if (!product) return null;
    
    const { data: category } = await supabase
      .from('product_categories')
      .select('subservice_id')
      .eq('id', product.category_id)
      .single();
    
    return category?.subservice_id || null;
  } catch (e) {
    return null;
  }
}

// ============================================================================
// PRODUCT CONFIGURATION
// ============================================================================

import {
  ConfigOptionType,
  ConfigOptionValue,
  ProductConfiguration,
  Feature,
} from '../../domain/types';

/**
 * Get all global configuration option types with their values
 */
export async function getConfigOptionTypes(): Promise<ConfigOptionType[]> {
  try {
    const lang = getCurrentLang();
    
    // Get option types
    const { data: types, error: typesError } = await supabase
      .from('config_option_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (typesError || !types) {
      console.error('[DataService] getConfigOptionTypes error:', typesError);
      return [];
    }

    // Get all values
    const { data: values, error: valuesError } = await supabase
      .from('config_option_values')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (valuesError || !values) {
      console.error('[DataService] getConfigOptionValues error:', valuesError);
      return [];
    }

    // Map and combine
    return types.map((type: any) => ({
      id: type.id,
      slug: type.slug,
      name: lang === 'he' && type.name_he ? type.name_he : type.name_en,
      description: lang === 'he' && type.description_he ? type.description_he : type.description_en,
      inputType: type.input_type,
      unit: type.unit,
      sortOrder: type.sort_order,
      values: values
        .filter((v: any) => v.option_type_id === type.id)
        .map((v: any) => ({
          id: v.id,
          slug: v.slug,
          label: lang === 'he' && v.label_he ? v.label_he : v.label_en,
          value: v.value,
          colorHex: v.color_hex,
          imageUrl: v.image_url,
          sortOrder: v.sort_order,
        })),
    }));
  } catch (e) {
    console.error('[DataService] getConfigOptionTypes exception:', e);
    return [];
  }
}

/**
 * Get configuration template for a subservice
 */
export async function getSubserviceConfigTemplate(subserviceId: string): Promise<{
  optionTypeIds: string[];
  defaults: Record<string, string>;
}> {
  try {
    const { data, error } = await supabase
      .from('subservice_config_templates')
      .select(`
        option_type_id,
        is_enabled,
        is_required,
        sort_order,
        default_value_id,
        config_option_values!default_value_id (slug)
      `)
      .eq('subservice_id', subserviceId)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      console.log('[DataService] No config template for subservice:', subserviceId);
      return { optionTypeIds: [], defaults: {} };
    }

    const optionTypeIds = data.map((t: any) => t.option_type_id);
    const defaults: Record<string, string> = {};
    
    // Build defaults from template
    data.forEach((t: any) => {
      if (t.config_option_values?.slug) {
        // We need to get the option type slug - this will be done when building full config
      }
    });

    return { optionTypeIds, defaults };
  } catch (e) {
    console.error('[DataService] getSubserviceConfigTemplate exception:', e);
    return { optionTypeIds: [], defaults: {} };
  }
}

/**
 * Get product configuration overrides
 */
export async function getProductConfigOverrides(productId: string): Promise<{
  disabledOptions: string[];
  disabledValues: Record<string, string[]>;
  defaults: Record<string, string>;
}> {
  try {
    const { data, error } = await supabase
      .from('product_config_overrides')
      .select(`
        option_type_id,
        is_enabled,
        disabled_value_ids,
        default_value_id,
        config_option_types!option_type_id (slug),
        config_option_values!default_value_id (slug)
      `)
      .eq('product_id', productId);

    if (error || !data) {
      return { disabledOptions: [], disabledValues: {}, defaults: {} };
    }

    const disabledOptions: string[] = [];
    const disabledValues: Record<string, string[]> = {};
    const defaults: Record<string, string> = {};

    data.forEach((override: any) => {
      const optionSlug = override.config_option_types?.slug;
      if (!optionSlug) return;

      if (!override.is_enabled) {
        disabledOptions.push(optionSlug);
      }

      if (override.disabled_value_ids?.length) {
        disabledValues[optionSlug] = override.disabled_value_ids;
      }

      if (override.config_option_values?.slug) {
        defaults[optionSlug] = override.config_option_values.slug;
      }
    });

    return { disabledOptions, disabledValues, defaults };
  } catch (e) {
    console.error('[DataService] getProductConfigOverrides exception:', e);
    return { disabledOptions: [], disabledValues: {}, defaults: {} };
  }
}

/**
 * Get full product configuration (template + overrides combined)
 */
export async function getProductConfiguration(productId: string, subserviceId: string): Promise<ProductConfiguration | null> {
  try {
    // Get all option types
    const allOptions = await getConfigOptionTypes();
    if (!allOptions.length) {
      console.log('[DataService] No config options found');
      return null;
    }

    // Get subservice template
    const { data: templateData } = await supabase
      .from('subservice_config_templates')
      .select(`
        option_type_id,
        is_enabled,
        sort_order,
        default_value_id,
        config_option_types!option_type_id (slug),
        config_option_values!default_value_id (slug)
      `)
      .eq('subservice_id', subserviceId)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true });

    // Get product overrides
    const { data: overrideData } = await supabase
      .from('product_config_overrides')
      .select(`
        option_type_id,
        is_enabled,
        disabled_value_ids,
        default_value_id,
        config_option_types!option_type_id (slug),
        config_option_values!default_value_id (slug)
      `)
      .eq('product_id', productId);

    // Build enabled option type IDs from template
    const enabledTypeIds = templateData?.map((t: any) => t.option_type_id) || [];
    
    // Build overrides map
    const overridesMap: Record<string, any> = {};
    overrideData?.forEach((o: any) => {
      if (o.config_option_types?.slug) {
        overridesMap[o.config_option_types.slug] = o;
      }
    });

    // Build defaults from template
    const defaults: Record<string, string> = {};
    templateData?.forEach((t: any) => {
      if (t.config_option_types?.slug && t.config_option_values?.slug) {
        defaults[t.config_option_types.slug] = t.config_option_values.slug;
      }
    });

    // Override defaults with product-specific ones
    overrideData?.forEach((o: any) => {
      if (o.config_option_types?.slug && o.config_option_values?.slug) {
        defaults[o.config_option_types.slug] = o.config_option_values.slug;
      }
    });

    // Filter and process options
    const options: ConfigOptionType[] = allOptions
      .filter(opt => {
        // Must be in template
        if (!enabledTypeIds.includes(opt.id)) return false;
        
        // Check if disabled by product override
        const override = overridesMap[opt.slug];
        if (override && !override.is_enabled) return false;
        
        return true;
      })
      .map(opt => {
        const override = overridesMap[opt.slug];
        const disabledValueIds: string[] = override?.disabled_value_ids || [];
        
        return {
          ...opt,
          values: opt.values
            .filter(v => !disabledValueIds.includes(v.id))
            .map(v => ({
              ...v,
              isDefault: defaults[opt.slug] === v.slug,
            })),
        };
      });

    // If no template exists, return all options (fallback for products without template)
    if (!templateData?.length && allOptions.length) {
      return {
        productId,
        subserviceId,
        options: allOptions,
        defaults: {},
      };
    }

    return {
      productId,
      subserviceId,
      options,
      defaults,
    };
  } catch (e) {
    console.error('[DataService] getProductConfiguration exception:', e);
    return null;
  }
}

/**
 * Get features for a product
 */
export async function getProductFeatures(productId: string): Promise<Feature[]> {
  try {
    const lang = getCurrentLang();
    
    const { data, error } = await supabase
      .from('product_features')
      .select(`
        id,
        sort_order,
        custom_title_en,
        custom_title_he,
        feature_library (
          id,
          slug,
          title_en,
          title_he,
          description_en,
          description_he,
          icon
        )
      `)
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((f: any) => {
      if (f.feature_library) {
        // From library
        return {
          id: f.feature_library.id,
          title: lang === 'he' && f.feature_library.title_he 
            ? f.feature_library.title_he 
            : f.feature_library.title_en,
          description: lang === 'he' && f.feature_library.description_he 
            ? f.feature_library.description_he 
            : f.feature_library.description_en,
          icon: f.feature_library.icon,
        };
      } else {
        // Custom feature
        return {
          id: f.id,
          title: lang === 'he' && f.custom_title_he 
            ? f.custom_title_he 
            : f.custom_title_en,
          icon: 'check',
        };
      }
    });
  } catch (e) {
    console.error('[DataService] getProductFeatures exception:', e);
    return [];
  }
}

/**
 * Get feature library (all available features)
 */
export async function getFeatureLibrary(): Promise<Feature[]> {
  try {
    const lang = getCurrentLang();
    
    const { data, error } = await supabase
      .from('feature_library')
      .select('*')
      .eq('is_active', true)
      .order('title_en', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((f: any) => ({
      id: f.id,
      title: lang === 'he' && f.title_he ? f.title_he : f.title_en,
      description: lang === 'he' && f.description_he ? f.description_he : f.description_en,
      icon: f.icon,
    }));
  } catch (e) {
    console.error('[DataService] getFeatureLibrary exception:', e);
    return [];
  }
}
