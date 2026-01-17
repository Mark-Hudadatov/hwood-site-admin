/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#005f5f',
          50: '#e6f2f2',
          100: '#cce5e5',
          200: '#99cbcb',
          300: '#66b1b1',
          400: '#339797',
          500: '#005f5f',
          600: '#004d4d',
          700: '#003d3d',
          800: '#002e2e',
          900: '#001f1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
