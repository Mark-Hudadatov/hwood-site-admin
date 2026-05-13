/**
 * DESIGN TOKENS — Single source of truth for runtime values.
 *
 * Tailwind config mirrors these. Use Tailwind classes (bg-brand, text-brand-hover)
 * in JSX wherever possible. Import here only for:
 *   - inline style={{}} objects
 *   - default data values (e.g. accent_color fallback)
 *   - JS computations
 *
 * All values must match tailwind.config.js — if you change one, change both.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const COLORS = {
  // HWOOD brand
  brand:      '#005f5f',
  brandHover: '#004d4d',
  brandDark:  '#003d3d',

  // Dark surface backgrounds (public site)
  surfaceDark:     '#002828', // footer, dark overlays
  surfaceDeepTeal: '#001f1f', // deep gradient starts
  surfaceBlack:    '#0a0a0a', // darkest panels
  surfaceHero:     '#121212', // homepage hero section bg
  surfaceCharcoal: '#1a1a1a', // hero side panels
  surfaceRaised:   '#1a1a2e', // admin sidebar
  surfaceChrome:   '#EAEAEA', // public header background

  // Neutral scale — mirrors Tailwind neutral-{n}
  neutral50:  '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Skylum brand (facade & aluminum division)
  skylum:        '#0091DB',
  skylumHover:   '#0070C0',
  skylumDark:    '#1050A0',
  skylumInk:     '#2030A0',
  skylumDeepest: '#141A5C',

  // Functional
  whatsapp:      '#25D366',
  whatsappHover: '#20BA5C',
  accentMint:    '#00d4aa', // admin logo accent — minimize new use
  accentGold:    '#D48F28', // default service accent color (Modular Cabinet Systems)
  success:       '#10b981',
} as const;

export type ColorValue = (typeof COLORS)[keyof typeof COLORS];

// ---------------------------------------------------------------------------
// Order-type color tokens — named palette for Browse/Send/Describe/Informational
// These mirror ORDER_TYPE_CONFIG in lib/OrderTypes.ts.
// Use in inline style={{}} when you need order-type theming outside of OrderTypeTag.
// ---------------------------------------------------------------------------

export const ORDER_TYPE_COLORS = {
  catalog: {
    accent:    '#a8c47a',
    accentDark:'#6b8a4a',
    tagBg:     'rgba(168,196,122,.18)',
    tagFg:     '#3d5a3a',
    surface:   '#f4f6ee',
    filter:    '#005f5f',
  },
  service: {
    accent:    '#5fa8d3',
    accentDark:'#2c6ea3',
    tagBg:     'rgba(95,168,211,.16)',
    tagFg:     '#1e3a5f',
    surface:   '#eef3f7',
    filter:    '#1d4ed8',
  },
  custom: {
    accent:    '#e8a87c',
    accentDark:'#b87149',
    tagBg:     'rgba(232,168,124,.18)',
    tagFg:     '#7a3a1a',
    surface:   '#f5ede5',
    filter:    '#b45309',
  },
  informational: {
    accent:    '#00d4aa',
    accentDark:'#005f5f',
    tagBg:     'rgba(0,95,95,.12)',
    tagFg:     '#005f5f',
    surface:   '#f4f8f8',
    filter:    '#737373',
  },
} as const;

export type OrderTypeColorKey = keyof typeof ORDER_TYPE_COLORS;

// ---------------------------------------------------------------------------
// Admin CSS variable references
// Use inside inline style={{}} on admin pages only. Never in public pages.
// ---------------------------------------------------------------------------

export const ADMIN = {
  fg1:        'var(--fg-1)',
  fg2:        'var(--fg-2)',
  fg3:        'var(--fg-3)',
  bg1:        'var(--bg-1)',
  bg2:        'var(--bg-2)',
  bg3:        'var(--bg-3)',
  border1:    'var(--border-1)',
  brand:      'var(--brand)',
  brandLight: 'var(--brand-light)',
  brandText:  'var(--brand-text)',
} as const;

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------

export const Z = {
  base:     0,
  above:    1,
  dropdown: 10,
  sticky:   20,
  overlay:  30,
  modal:    40,
  toast:    50,
} as const;

// ---------------------------------------------------------------------------
// Breakpoints — match Tailwind defaults (px)
// ---------------------------------------------------------------------------

export const BP = {
  sm:    640,
  md:    768,
  lg:   1024,
  xl:   1280,
  '2xl': 1536,
} as const;

// ---------------------------------------------------------------------------
// Animation durations (ms)
// ---------------------------------------------------------------------------

export const DURATION = {
  fast:   150,
  base:   300,
  slow:   500,
  slower: 700,
} as const;
