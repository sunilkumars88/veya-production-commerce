import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: { DEFAULT: '#E8F4F2', dark: '#DFF0EE' },
        teal: { DEFAULT: '#1A7A6E', mid: '#2A9D8F', light: '#5BBFB5' },
        ink: { DEFAULT: '#0D1E1C', mute: '#3A5C58' },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        silk: '0 8px 32px rgba(13,30,28,0.10)',
        glow: '0 4px 16px rgba(26,122,110,0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
