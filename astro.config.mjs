import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeClassNames from 'rehype-class-names';
import rehypeMathjax from 'rehype-mathjax';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import { remarkTruncateLinks } from 'remark-truncate-links';
import { markdownClasses, plantuml } from './src/lib/json';

// function remarkMeta() {
//   return function transformer(tree) {
//     visit(tree, 'code', (node) => {
//       console.log(node.meta);
//     });
//   };
// }

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx(),
    sitemap(),
    react(),
    tailwind({ applyBaseStyles: false }),
    partytown(),
  ],
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
    rehypePlugins: [
      rehypeMathjax,
      rehypeAccessibleEmojis,
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeClassNames, markdownClasses],
    ],
  },
});
