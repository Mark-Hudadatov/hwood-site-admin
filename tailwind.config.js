/** @type {import('tailwindcss').Config} */
// All raw values must match src/tokens.ts — keep both in sync.
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // COLORS
      // Brand = identity | Accent = primary CTA | Surface = dark backgrounds
      // -----------------------------------------------------------------------
      colors: {
        // HWOOD brand
        brand: {
          DEFAULT: '#005f5f',
          hover:   '#004d4d',
          dark:    '#003d3d',
        },
        accent: '#005f5f',

        // Dark surface backgrounds (public site)
        surface: {
          dark:      '#002828', // footer, dark overlays
          'deep-teal': '#001f1f', // deep gradient start
          black:     '#0a0a0a', // darkest panels
          hero:      '#121212', // homepage hero section
          charcoal:  '#1a1a1a', // hero side panels
          raised:    '#1a1a2e', // admin sidebar
          chrome:    '#EAEAEA', // public header background
        },

        // Neutral scale
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },

        // Skylum brand (facade & aluminum division)
        skylum: {
          DEFAULT: '#0091DB',
          600:     '#0070C0',
          700:     '#1050A0',
          ink:     '#2030A0',
          900:     '#141A5C',
        },

        // Order-type badge colours
        badge: {
          'browse-bg':  '#f0fdfa',
          'browse-fg':  '#0f766e',
          'project-bg': '#eff6ff',
          'project-fg': '#1e40af',
          'custom-bg':  '#fef3e2',
          'custom-fg':  '#92400e',
        },

        // Functional
        whatsapp: {
          DEFAULT: '#25D366',
          hover:   '#20BA5C',
        },
        'accent-mint': '#00d4aa', // admin logo accent — minimize new use
        'accent-gold': '#D48F28', // default service accent color
        success: '#10b981',

        // Legacy aliases (keep for backward compat — prefer brand.* above)
        teal: {
          DEFAULT: '#005f5f',
          500:     '#005f5f',
          600:     '#004d4d',
          700:     '#003d3d',
        },
      },

      // -----------------------------------------------------------------------
      // TYPOGRAPHY — strict 6-level scale
      // -----------------------------------------------------------------------
      fontSize: {
        'display-lg': ['5.5rem',  { lineHeight: '0.98', letterSpacing: '-0.028em', fontWeight: '600' }],
        'display':    ['4.5rem',  { lineHeight: '1.0',  letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-sm': ['3.5rem',  { lineHeight: '1.05', letterSpacing: '-0.02em',  fontWeight: '600' }],
        'h1':         ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        'h2':         ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '500' }],
        'body-lg':    ['1.125rem',{ lineHeight: '1.6',  fontWeight: '400' }],
        'body':       ['1rem',    { lineHeight: '1.6',  fontWeight: '400' }],
        'meta':       ['0.875rem',{ lineHeight: '1.5',  fontWeight: '500' }],
        'meta-sm':    ['0.75rem', { lineHeight: '1.5',  fontWeight: '500', letterSpacing: '0.02em' }],
        'eyebrow':    ['0.625rem',{ lineHeight: '1',    fontWeight: '700', letterSpacing: '0.2em'  }],
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter Display"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', '"JetBrains Mono"', 'Menlo', 'monospace'],
      },

      // -----------------------------------------------------------------------
      // SPACING — 8px base grid
      // -----------------------------------------------------------------------
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
        '30': '7.5rem',  // 120px
      },

      // -----------------------------------------------------------------------
      // BORDER RADIUS
      // -----------------------------------------------------------------------
      borderRadius: {
        curtain: '80px',
      },

      // -----------------------------------------------------------------------
      // BOX SHADOW
      // -----------------------------------------------------------------------
      boxShadow: {
        'xl-brand': '0 25px 50px -12px rgba(0,95,95,.25)',
      },

      // -----------------------------------------------------------------------
      // ANIMATIONS
      // -----------------------------------------------------------------------
      animation: {
        'slow-zoom':   'slow-zoom 20s ease-out both',
        'fade-in':     'fade-in .5s ease-out both',
        'fade-in-up':  'fade-in-up .7s ease-out both',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
        'check-pop':   'check-pop .5s cubic-bezier(0.34,1.56,0.64,1) both',
        'marquee':     'marquee 30s linear infinite',
        'scroll-down': 'scroll-down 2s ease-in-out infinite',
      },

      keyframes: {
        'slow-zoom': {
          from: { transform: 'scale(1.05)' },
          to:   { transform: 'scale(1.15)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(0,95,95,.4)' },
          '50%':     { boxShadow: '0 0 0 10px rgba(0,95,95,0)' },
        },
        'check-pop': {
          '0%':   { transform: 'scale(.5)', opacity: '0' },
          '60%':  { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        'scroll-down': {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '30%':  { opacity: '1' },
          '100%': { transform: 'translateY(200%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
