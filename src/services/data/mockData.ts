/**
 * MOCK DATA - HWOOD
 * =================
 * Raw data arrays that simulate a database.
 * All data conforms to domain/types.ts interfaces.
 * 
 * This file is the SINGLE SOURCE OF TRUTH for mock data.
 * Components should NEVER import this directly - use dataService.ts instead.
 */

import {
  Service,
  Subservice,
  ProductCategory,
  Product,
  Story,
} from '../../domain/types';

// =============================================================================
// SERVICES (Top Level) - HWOOD Core Services
// =============================================================================

export const SERVICES: Service[] = [
  {
    id: 'svc-1',
    slug: 'modular-cabinet-systems',
    title: 'Modular & Cabinet Systems',
    description: 'Scalable, durable, and precisely engineered modular systems for kitchens, bathrooms, wardrobes, and storage spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000',
    accentColor: '#D48F28',
  },
  {
    id: 'svc-2',
    slug: 'cnc-board-processing',
    title: 'CNC Board Processing',
    description: 'Advanced CNC infrastructure for complex shapes, drilling, milling, and high-volume production with consistent accuracy.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000',
    accentColor: '#2D5A5A',
  },
  {
    id: 'svc-3',
    slug: 'furniture-fronts-production',
    title: 'Furniture Fronts Production',
    description: 'High-quality MDF, PVC, veneer, and HPL fronts for kitchens, wardrobes, storage furniture, and architectural applications.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
    accentColor: '#8B4513',
  },
];

// =============================================================================
// SUBSERVICES - HWOOD Service Categories
// =============================================================================

export const SUBSERVICES: Subservice[] = [
  // --- Modular & Cabinet Systems (svc-1) ---
  {
    id: 'sub-1',
    slug: 'kitchen-modules',
    serviceId: 'svc-1',
    title: 'Kitchen Modules',
    description: 'Complete modular solutions for kitchen cabinet bodies, from cutting to assembly.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
    heroImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'sub-2',
    slug: 'bathroom-niche-modules',
    serviceId: 'svc-1',
    title: 'Bathroom & Niche Modules',
    description: 'Specialized solutions for bathroom furniture and built-in niche systems.',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-3',
    slug: 'wardrobe-closet-systems',
    serviceId: 'svc-1',
    title: 'Wardrobe & Closet Systems',
    description: 'Flexible manufacturing systems for walk-in closets and wardrobe interiors.',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-4',
    slug: 'drawer-storage-units',
    serviceId: 'svc-1',
    title: 'Drawer & Storage Units',
    description: 'Precision-built drawer boxes and pull-out storage solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
  },

  // --- CNC Board Processing (svc-2) ---
  {
    id: 'sub-5',
    slug: 'front-milling',
    serviceId: 'svc-2',
    title: 'Front Milling',
    description: 'High-precision CNC milling for furniture fronts and decorative panels.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-6',
    slug: 'drilling-boring',
    serviceId: 'svc-2',
    title: 'Drilling & Boring',
    description: 'Accurate drilling and boring operations for hardware, dowels, and fittings.',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-7',
    slug: 'board-cutting',
    serviceId: 'svc-2',
    title: 'Board Cutting',
    description: 'Precision cutting services for panels and boards of all sizes.',
    imageUrl: 'https://images.unsplash.com/photo-1616627577385-5c0c4dab8c3f?auto=format&fit=crop&q=80&w=800',
  },

  // --- Furniture Fronts Production (svc-3) ---
  {
    id: 'sub-8',
    slug: 'painted-mdf',
    serviceId: 'svc-3',
    title: 'Painted MDF',
    description: 'Premium painted MDF fronts with smooth finishes and custom colors.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-9',
    slug: 'pvc-thermofoil',
    serviceId: 'svc-3',
    title: 'PVC / Thermofoil',
    description: 'Durable PVC and thermofoil wrapped fronts for moisture-resistant applications.',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-10',
    slug: 'veneer-fronts',
    serviceId: 'svc-3',
    title: 'Veneer Fronts',
    description: 'Natural wood veneer fronts for premium furniture applications.',
    imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sub-11',
    slug: 'hpl-laminate-fronts',
    serviceId: 'svc-3',
    title: 'HPL Laminate Fronts',
    description: 'High-pressure laminate fronts for commercial and high-traffic environments.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
  },
];

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  // --- Kitchen Modules (sub-1) ---
  {
    id: 'cat-1',
    slug: 'upper-cabinets',
    subserviceId: 'sub-1',
    title: 'Upper Cabinets',
    description: 'Wall-mounted upper cabinet modules',
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    slug: 'lower-cabinets',
    subserviceId: 'sub-1',
    title: 'Lower Cabinets',
    description: 'Base cabinet modules with various configurations',
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    slug: 'tall-cabinets',
    subserviceId: 'sub-1',
    title: 'Tall Cabinets',
    description: 'Full-height pantry and storage cabinets',
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    slug: 'island-modules',
    subserviceId: 'sub-1',
    title: 'Island Modules',
    description: 'Freestanding kitchen island modules',
    sortOrder: 4,
  },

  // --- Drilling & Boring (sub-6) ---
  {
    id: 'cat-5',
    slug: 'hardware-drilling',
    subserviceId: 'sub-6',
    title: 'Hardware Drilling',
    description: 'Drilling for hinges, handles, and fittings',
    sortOrder: 1,
  },
  {
    id: 'cat-6',
    slug: 'dowel-drilling',
    subserviceId: 'sub-6',
    title: 'Dowel Drilling',
    description: 'Precision dowel hole drilling for assembly',
    sortOrder: 2,
  },
  {
    id: 'cat-7',
    slug: 'system-drilling',
    subserviceId: 'sub-6',
    title: 'System Drilling',
    description: 'Systematic drilling for modular furniture systems',
    sortOrder: 3,
  },

  // --- Front Milling (sub-5) ---
  {
    id: 'cat-8',
    slug: '3d-milling',
    subserviceId: 'sub-5',
    title: '3D Milling',
    description: 'Complex 3D shapes and decorative patterns',
    sortOrder: 1,
  },
  {
    id: 'cat-9',
    slug: 'edge-profiling',
    subserviceId: 'sub-5',
    title: 'Edge Profiling',
    description: 'Decorative edge profiles and chamfers',
    sortOrder: 2,
  },
  {
    id: 'cat-10',
    slug: 'panel-routing',
    subserviceId: 'sub-5',
    title: 'Panel Routing',
    description: 'Precision routing for panel grooves and channels',
    sortOrder: 3,
  },

  // --- Painted MDF (sub-8) ---
  {
    id: 'cat-11',
    slug: 'flat-panel-fronts',
    subserviceId: 'sub-8',
    title: 'Flat Panel Fronts',
    description: 'Smooth, modern flat panel designs',
    sortOrder: 1,
  },
  {
    id: 'cat-12',
    slug: 'shaker-style-fronts',
    subserviceId: 'sub-8',
    title: 'Shaker Style Fronts',
    description: 'Classic shaker profile designs',
    sortOrder: 2,
  },
  {
    id: 'cat-13',
    slug: 'handleless-fronts',
    subserviceId: 'sub-8',
    title: 'Handleless Fronts',
    description: 'Contemporary handleless (J-pull) designs',
    sortOrder: 3,
  },
];

// =============================================================================
// PRODUCTS
// =============================================================================

export const PRODUCTS: Product[] = [
  // --- Kitchen Modules > Upper Cabinets (cat-1) ---
  {
    id: 'prod-1',
    slug: 'upper-standard-600',
    categoryId: 'cat-1',
    title: 'Wall Cabinet 600',
    subtitle: 'Standard upper unit',
    description: 'A versatile wall-mounted cabinet perfect for storing everyday kitchen essentials. Features adjustable shelves and soft-close hinges.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
    features: ['Soft-close hinges', 'Adjustable shelves', '18mm panels'],
    specifications: [
      { label: 'Width', value: '600', unit: 'mm' },
      { label: 'Height', value: '720', unit: 'mm' },
      { label: 'Depth', value: '320', unit: 'mm' },
    ],
    has3DView: true,
  },
  {
    id: 'prod-2',
    slug: 'upper-corner-900',
    categoryId: 'cat-1',
    title: 'Corner Cabinet 900',
    subtitle: 'L-shaped corner unit',
    description: 'Maximize corner space with this L-shaped upper cabinet. Includes rotating carousel for easy access.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    features: ['Carousel included', 'Corner optimization', 'Easy installation'],
    specifications: [
      { label: 'Width', value: '900x900', unit: 'mm' },
      { label: 'Height', value: '720', unit: 'mm' },
    ],
    has3DView: true,
  },
  {
    id: 'prod-3',
    slug: 'upper-glass-display',
    categoryId: 'cat-1',
    title: 'Glass Display Cabinet',
    subtitle: 'Display wall unit',
    description: 'Elegant display cabinet with glass doors for showcasing items.',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    features: ['Tempered glass doors', 'LED lighting ready', 'Glass shelves'],
    specifications: [
      { label: 'Width', value: '400-800', unit: 'mm' },
      { label: 'Height', value: '720', unit: 'mm' },
    ],
    has3DView: false,
  },

  // --- Kitchen Modules > Lower Cabinets (cat-2) ---
  {
    id: 'prod-4',
    slug: 'lower-standard-600',
    categoryId: 'cat-2',
    title: 'Base Cabinet 600',
    subtitle: 'Standard base unit',
    description: 'Foundational base cabinet with drawer and door configuration. Built for durability with moisture-resistant materials.',
    imageUrl: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&q=80&w=800',
    features: ['Moisture-resistant', 'Adjustable legs', 'Soft-close drawers'],
    specifications: [
      { label: 'Width', value: '600', unit: 'mm' },
      { label: 'Height', value: '720', unit: 'mm' },
      { label: 'Depth', value: '560', unit: 'mm' },
    ],
    has3DView: true,
  },
  {
    id: 'prod-5',
    slug: 'sink-base-cabinet',
    categoryId: 'cat-2',
    title: 'Sink Base Cabinet',
    subtitle: 'Under-sink unit',
    description: 'Specially designed cabinet for sink installation with waterproof base.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    features: ['Waterproof base', 'Flexible pipe routing', 'Waste bin ready'],
    specifications: [
      { label: 'Width', value: '800', unit: 'mm' },
      { label: 'Height', value: '720', unit: 'mm' },
    ],
    has3DView: true,
  },
  {
    id: 'prod-10',
    slug: 'b-80-d2-s1',
    categoryId: 'cat-2',
    title: 'B-80-D2-S1',
    subtitle: 'Premium base cabinet with double drawers',
    description: 'High-quality base cabinet featuring two spacious soft-close drawers. Engineered for maximum storage efficiency with premium hardware and durable construction. Ideal for modern kitchen layouts requiring accessible lower storage.',
    imageUrl: 'https://drive.google.com/uc?export=view&id=1JHLgiVLcgSjKlOcAK3gZKOqLU-2eZeBj?auto=format&fit=crop&q=80&w=800',
    galleryImages: [
      'https://drive.google.com/uc?export=view&id=1JHLgiVLcgSjKlOcAK3gZKOqLU-2eZeBj?auto=format&fit=crop&q=80&w=800',
    ],
    videoUrl: '/B-80-D2-S1.webm',
    features: [
      'Double drawer configuration',
      'Soft-close mechanism',
      'Full extension slides',
      '18mm moisture-resistant panels',
      'Adjustable legs included'
    ],
    specifications: [
      { label: 'Width', value: '800', unit: 'mm' },
      { label: 'Height', value: '720', unit: 'mm' },
      { label: 'Depth', value: '560', unit: 'mm' },
      { label: 'Drawer Height', value: '140', unit: 'mm' },
    ],
    has3DView: true,
  },

  // --- Kitchen Modules > Island Modules (cat-4) ---
  {
    id: 'prod-6',
    slug: 'island-base-1200',
    categoryId: 'cat-4',
    title: 'Island Base 1200',
    subtitle: 'Freestanding island',
    description: 'Versatile kitchen island base configurable with various tops and storage options.',
    imageUrl: 'https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?auto=format&fit=crop&q=80&w=800',
    features: ['Modular design', 'Appliance integration', 'Multiple configurations'],
    specifications: [
      { label: 'Width', value: '1200', unit: 'mm' },
      { label: 'Height', value: '900', unit: 'mm' },
      { label: 'Depth', value: '600', unit: 'mm' },
    ],
    has3DView: true,
  },

  // --- Drilling & Boring > Hardware Drilling (cat-5) ---
  {
    id: 'prod-7',
    slug: 'hinge-drilling-service',
    categoryId: 'cat-5',
    title: 'Hinge Drilling',
    subtitle: 'Cup hinge preparation',
    description: 'Precision drilling for concealed cup hinges with exact positioning.',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800',
    features: ['35mm cup holes', 'Exact positioning', 'All hinge types'],
    specifications: [
      { label: 'Hole Diameter', value: '35', unit: 'mm' },
      { label: 'Depth Tolerance', value: '±0.1', unit: 'mm' },
    ],
    has3DView: false,
  },

  // --- Painted MDF > Flat Panel (cat-11) ---
  {
    id: 'prod-8',
    slug: 'flat-mdf-front',
    categoryId: 'cat-11',
    title: 'Flat MDF Front',
    subtitle: 'Smooth finish',
    description: 'Clean, modern flat panel MDF front with premium paint finish.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    features: ['2-layer paint', 'Smooth finish', 'Custom colors'],
    specifications: [
      { label: 'Thickness', value: '19', unit: 'mm' },
      { label: 'Max Width', value: '1200', unit: 'mm' },
    ],
    has3DView: false,
  },
  {
    id: 'prod-9',
    slug: 'shaker-mdf-front',
    categoryId: 'cat-12',
    title: 'Shaker MDF Front',
    subtitle: 'Classic profile',
    description: 'Timeless shaker style MDF front suitable for traditional and transitional kitchens.',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=800',
    features: ['Classic shaker profile', 'Premium finish', 'Various sizes'],
    specifications: [
      { label: 'Thickness', value: '19', unit: 'mm' },
      { label: 'Profile Depth', value: '12', unit: 'mm' },
    ],
    has3DView: false,
  },
];

// =============================================================================
// STORIES (Recent Projects & News section)
// =============================================================================

export const STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'New CNC Center Installation Complete',
    date: '01/15/2025',
    type: 'EVENTS',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'story-2',
    title: 'Luxury Kitchen Project: Tel Aviv Penthouse',
    date: '01/08/2025',
    type: 'CUSTOMER STORY',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'story-3',
    title: 'HWOOD Expands Production Capacity',
    date: '12/20/2024',
    type: 'EVENTS',
    imageUrl: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'story-4',
    title: 'Boutique Hotel Wardrobe Systems Delivered',
    date: '12/10/2024',
    type: 'CUSTOMER STORY',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'story-5',
    title: 'Quality Control: Our Process Explained',
    date: '11/28/2024',
    type: 'EVENTS',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
  },
];

// =============================================================================
// HERO SLIDES (for homepage carousel)
// =============================================================================

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Modular Cabinet Systems for Any Project',
    subtitle: 'Industrial-strength cabinets engineered for kitchens, wardrobes, bathrooms, and storage rooms.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000',
    ctaText: 'Explore Modules',
    ctaLink: '/services/modular-cabinet-systems',
  },
  {
    id: 'slide-2',
    title: 'Advanced CNC Processing for Complex Designs',
    subtitle: 'Accurate cutting, drilling, milling, and shaping — from one-off parts to high-volume production.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000',
    ctaText: 'View CNC Services',
    ctaLink: '/services/cnc-board-processing',
  },
  {
    id: 'slide-3',
    title: 'Premium Furniture Fronts & Architectural Panels',
    subtitle: 'MDF, PVC, veneer, and HPL fronts produced with precision finishing and full quality control.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
    ctaText: 'See Front Options',
    ctaLink: '/services/furniture-fronts-production',
  },
];

// =============================================================================
// COMPANY INFO
// =============================================================================

export const COMPANY_INFO = {
  name: 'HWOOD',
  tagline: 'Industrial Carpentry & CNC Production',
  description: 'A modern production powerhouse delivering modular cabinet systems, CNC processing, and premium furniture fronts for residential and commercial projects.',
  phone: '+972-54-922-2804',
  email: 'office@skylum.co.il',
  address: 'Ha Masger 20, Netanya, Israel',
};
