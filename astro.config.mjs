import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeMathjax from 'rehype-mathjax';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import { remarkTruncateLinks } from 'remark-truncate-links';
import { plantuml } from 'src/lib/json';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), react(), tailwind()],
  markdown: {
    shikiConfig: {
      langs: [plantuml],
    },
    remarkPlugins: [
      remarkMath,
      remarkTruncateLinks,
      [remarkToc, { depth: 3 }],
      remarkGemoji,
    ],
    rehypePlugins: [rehypeMathjax, rehypeAccessibleEmojis],
  },
});
