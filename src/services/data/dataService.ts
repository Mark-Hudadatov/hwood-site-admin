/**
 * DATA SERVICE
 * ============
 * v2.1 — April 2026
 * Updated: brand + orderType mapping in getServices / getServiceBySlug
 * Added:   getServicesByBrand(), submitOrderForm(), uploadOrderFile()
 */

import { supabase } from '../supabase';
import {
  Service,
  ServiceBrand,
  ServiceOrderType,
  Subservice,
  ProductCategory,
  Product,
  Story,
  HeroSlide,
  CompanyInfo,
  ConfigOptionType,
  ConfigOptionValue,
  ProductConfiguration,
  OrderSubmission,
  QuoteSubmissionResult,
} from '../../domain/types';

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

    if (error) {
      console.error('[DataService] Services ERROR:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[DataService] No services found in database');
      return [];
    }

    const lang = getCurrentLang();
    return data.map((s: any) => mapService(s, lang));
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
    return mapService(data, lang);
  } catch (e) {
    console.error('[DataService] getServiceBySlug exception:', e);
    return null;
  }
}

/** Получить сервисы по бренду (hwood | skylum) */
export async function getServicesByBrand(brand: ServiceBrand): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('brand', brand)
      .in('visibility_status', ['visible', 'coming_soon'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((s: any) => mapService(s, lang));
  } catch (e) {
    console.error('[DataService] getServicesByBrand exception:', e);
    return [];
  }
}

/** Внутренний маппинг строки Supabase → Service */
function mapService(s: any, lang: 'en' | 'he'): Service {
  return {
    id: s.id,
    slug: s.slug,
    title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
    subtitle: lang === 'he' && s.subtitle_he ? s.subtitle_he : s.subtitle_en || '',
    description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
    ctaText: lang === 'he' && s.cta_text_he ? s.cta_text_he : s.cta_text_en || 'Learn More',
    imageUrl: s.image_url || '',
    heroImageUrl: s.hero_image_url || '',
    accentColor: s.accent_color || '#005f5f',
    brand: (s.brand as ServiceBrand) || 'hwood',
    orderType: (s.order_type as ServiceOrderType) || 'browse-and-order',
    visibilityStatus: s.visibility_status,
  };
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

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((s: any) => mapSubservice(s, lang));
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

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((s: any) => mapSubservice(s, lang));
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

    if (error || !data) return null;

    const lang = getCurrentLang();
    return mapSubservice(data, lang);
  } catch (e) {
    return null;
  }
}

function mapSubservice(s: any, lang: 'en' | 'he'): Subservice {
  return {
    id: s.id,
    slug: s.slug,
    serviceId: s.service_id,
    title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
    description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
    imageUrl: s.image_url || '',
    heroImageUrl: s.hero_image_url || '',
  };
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

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((c: any) => mapCategory(c, lang));
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

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((c: any) => mapCategory(c, lang));
  } catch (e) {
    return [];
  }
}

function mapCategory(c: any, lang: 'en' | 'he'): ProductCategory {
  return {
    id: c.id,
    slug: c.slug,
    subserviceId: c.subservice_id,
    title: lang === 'he' && c.title_he ? c.title_he : c.title_en,
    description: lang === 'he' && c.description_he ? c.description_he : c.description_en || '',
    sortOrder: c.sort_order,
  };
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

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((p: any) => mapProduct(p, lang));
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

    if (error || !data || data.length === 0) return [];

    const lang = getCurrentLang();
    return data.map((p: any) => mapProduct(p, lang));
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

    if (error || !data) return null;

    const lang = getCurrentLang();
    return mapProduct(data, lang);
  } catch (e) {
    return null;
  }
}

function mapProduct(p: any, lang: 'en' | 'he'): Product {
  return {
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
    modelUrl: p.model_url,
    visibilityStatus: p.visibility_status,
  };
}

// ============================================================================
// ORDER FORM SUBMISSION (v2.0)
// ============================================================================

export async function submitOrderForm(
  submission: OrderSubmission
): Promise<QuoteSubmissionResult> {
  try {
    const base = {
      name:         submission.name,
      phone:        submission.phone,
      company:      submission.company || null,
      order_type:   submission.orderType,
      service_slug: submission.serviceSlug,
      message:      JSON.stringify(submission), // полный объект для надёжности
      is_read:      false,
    };

    let extra: Record<string, any> = {};

    if (submission.orderType === 'browse-and-order') {
      extra = {
        product_interest: submission.productTitle ? [submission.productTitle] : [],
        project_type:     'Browse & Order',
        timeline:         submission.quantity || null,
      };
    }

    if (submission.orderType === 'send-file-and-process') {
      extra = {
        project_type:     submission.operationType || 'CNC Service',
        subservice_slug:  submission.subserviceSlug || null,
        material:         submission.material || null,
        volume:           submission.volume || null,
        deadline:         submission.deadline || null,
        file_url:         submission.fileUrl || null,
      };
    }

    if (submission.orderType === 'describe-and-request') {
      extra = {
        project_type:  submission.objectType || 'Custom Project',
        client_role:   submission.clientRole,
        object_type:   submission.objectType || null,
        material:      submission.material || null,
        volume:        submission.approximateVolume || null,
        file_url:      submission.fileUrl || null,
      };
    }

    const { error } = await supabase
      .from('quote_submissions')
      .insert([{ ...base, ...extra }]);

    if (error) {
      console.error('[DataService] submitOrderForm error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('[DataService] submitOrderForm exception:', e);
    return { success: false, error: 'Network error' };
  }
}

/** Загрузка файла (чертёж, DXF, PDF) из форм заказа */
export async function uploadOrderFile(file: File): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop();
    const path = `order-files/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('[DataService] uploadOrderFile error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(path);

    return publicUrl;
  } catch (e) {
    console.error('[DataService] uploadOrderFile exception:', e);
    return null;
  }
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

    if (error || !data || data.length === 0) return [];

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

    if (error || !data) return null;

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
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
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

    if (error || !data || data.length === 0) return [];

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

    if (error || !data) return null;

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

    if (error || !data) return [];

    return data
      .filter((s: any) => s.url)
      .map((s: any) => ({ platform: s.platform, url: s.url }));
  } catch (e) {
    return [];
  }
}

// ============================================================================
// FORM SUBMISSIONS (legacy contact form)
// ============================================================================

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('contact_submissions').insert([formData]);
    return !error;
  } catch (e) {
    return false;
  }
}

// ============================================================================
// BREADCRUMB HELPERS
// ============================================================================

export async function getProductWithBreadcrumb(productSlug: string) {
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

export const getProductBreadcrumb = getProductWithBreadcrumb;

// ============================================================================
// NAVIGATION DATA
// ============================================================================

export async function getNavigationData(): Promise<{
  services: (Service & { subservices: Subservice[] })[];
}> {
  const [services, subservices] = await Promise.all([getServices(), getSubservices()]);

  const servicesWithSubs = services.map((service) => ({
    ...service,
    subservices: subservices.filter((sub) => sub.serviceId === service.id),
  }));

  return { services: servicesWithSubs };
}

// ============================================================================
// SUBSERVICE PAGE DATA
// ============================================================================

export async function getSubservicesByServiceSlug(serviceSlug: string): Promise<Subservice[]> {
  const service = await getServiceBySlug(serviceSlug);
  if (!service) return [];
  return getSubservicesByService(service.id);
}

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

export async function getProductConfiguration(
  productId: string,
  subserviceId: string
): Promise<ProductConfiguration | null> {
  const lang = getCurrentLang();

  try {
    const { data: templateData, error: templateError } = await supabase
      .from('subservice_config_templates')
      .select('option_type_id, is_enabled, is_required, default_value_id, sort_order')
      .eq('subservice_id', subserviceId)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true });

    if (templateError || !templateData || templateData.length === 0) return null;

    const optionTypeIds = templateData.map((t: any) => t.option_type_id);

    const { data: optionTypes, error: typesError } = await supabase
      .from('config_option_types')
      .select('*')
      .in('id', optionTypeIds)
      .eq('is_active', true);

    if (typesError || !optionTypes) return null;

    const { data: optionValues, error: valuesError } = await supabase
      .from('config_option_values')
      .select('*')
      .in('option_type_id', optionTypeIds)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (valuesError) return null;

    const { data: overrides } = await supabase
      .from('product_config_overrides')
      .select('*')
      .eq('product_id', productId);

    const overrideMap = new Map(
      (overrides || []).map((o: any) => [o.option_type_id, o])
    );

    const defaults: Record<string, string> = {};
    const options: ConfigOptionType[] = [];

    for (const template of templateData) {
      const optionType = optionTypes.find((t: any) => t.id === template.option_type_id);
      if (!optionType) continue;

      const override = overrideMap.get(template.option_type_id);
      if (override?.is_enabled === false) continue;

      const values = (optionValues || [])
        .filter((v: any) => v.option_type_id === optionType.id)
        .map((v: any) => ({
          id: v.id,
          slug: v.slug,
          label: lang === 'he' && v.label_he ? v.label_he : v.label_en,
          labelHe: v.label_he,
          value: v.value,
          colorHex: v.color_hex,
          imageUrl: v.image_url,
          sortOrder: v.sort_order,
          isActive: v.is_active,
          isDisabled: override?.disabled_value_ids?.includes(v.id) || false,
        }));

      const configOption: ConfigOptionType = {
        id: optionType.id,
        slug: optionType.slug,
        name: lang === 'he' && optionType.name_he ? optionType.name_he : optionType.name_en,
        nameHe: optionType.name_he,
        description: lang === 'he' && optionType.description_he ? optionType.description_he : optionType.description_en,
        descriptionHe: optionType.description_he,
        inputType: optionType.input_type,
        unit: optionType.unit,
        sortOrder: template.sort_order,
        values: values.filter((v: ConfigOptionValue) => !v.isDisabled),
      };

      options.push(configOption);

      const defaultValueId = override?.default_value_id || template.default_value_id;
      const defaultValue = values.find((v: ConfigOptionValue) => v.id === defaultValueId) || values[0];
      if (defaultValue) defaults[optionType.slug] = defaultValue.slug;
    }

    return { productId, subserviceId, options, defaults };
  } catch (e) {
    console.error('[DataService] getProductConfiguration exception:', e);
    return null;
  }
}
