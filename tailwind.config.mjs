// @ts-check
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,json}',
    './astro.config.mjs',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
