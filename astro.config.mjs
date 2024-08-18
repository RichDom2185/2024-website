import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import { remarkTruncateLinks } from 'remark-truncate-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), react(), tailwind()],
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkMath, remarkTruncateLinks],
  },
});
