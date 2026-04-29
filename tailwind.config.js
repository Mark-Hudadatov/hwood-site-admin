/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // COLOR AUTHORITY MODEL
      // Brand = identity elements | Accent = primary CTA only | Neutral = everything else
      colors: {
        brand: {
          DEFAULT: '#005f5f',
          600: '#004d4d',   // hover
          700: '#003d3d',   // press
          tint: 'rgba(0, 95, 95, 0.08)',
          ring: 'rgba(0, 95, 95, 0.40)',
        },
        accent: '#005f5f',
        // Skylum brand — facade/ACP services only, never mix with HWOOD teal
        skylum: {
          DEFAULT: '#0091DB',   // sky blue — wordmark, accents
          600: '#0070C0',       // hover / mid
          700: '#1050A0',       // deep cerulean
          ink: '#2030A0',       // deep indigo — gradient bottom, dark surfaces
          900: '#141A5C',       // darkest hero background
          tint: 'rgba(0, 145, 219, 0.10)',
        },
        // Dark industrial surfaces
        surface: {
          dark: '#002828',      // footer / dark section background
        },
        neutral: {
          50: '#fafafa',
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
        // Legacy support + teal-50 for OrderTypeBadge backgrounds
        teal: {
          DEFAULT: '#005f5f',
          50: '#f0fdfa',
          500: '#005f5f',
          600: '#004d4d',
          700: '#003d3d',
        },
      },
      // STRICT 5-LEVEL TYPOGRAPHY SYSTEM
      fontSize: {
        // Display: Hero headline only
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        // H1: Page title (one per page)
        'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        // H2: Section titles
        'h2': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        // Body: All paragraphs
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        // Meta: Captions, labels, specs
        'meta': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'meta-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.02em' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Display tier — Inter 24pt optical static family
        // Used for h1, h2, .display classes — tighter letterforms at large sizes
        display: ['"Inter Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      // 8px-BASED SPACING SYSTEM
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '30': '7.5rem',   // 120px
      },
    },
  },
  plugins: [],
}
