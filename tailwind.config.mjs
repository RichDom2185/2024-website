// @ts-check
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,json}',
    './astro.config.mjs',
  ],
  // Allow both automatic and manual dark mode. See:
  // https://tailwindcss.com/docs/dark-mode#using-multiple-selectors
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(.light *) }',
      '&:is(.dark *)',
    ],
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
