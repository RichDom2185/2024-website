// @ts-check
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import clsx from 'clsx';
import { h } from 'hastscript';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeClassNames from 'rehype-class-names';
import rehypeMathjax from 'rehype-mathjax';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import { remarkTruncateLinks } from 'remark-truncate-links';
import { brainfuck, markdownClasses, plantuml } from './src/lib/json';

/**
 * @import {Options as AutolinkOptions} from 'rehype-autolink-headings';
 * @type {AutolinkOptions}
 */
const autolinkOptions = {
  behavior: 'wrap',
  content: h(
    'span',
    {
      className: clsx(
        'inline-block ml-1 text-sm',
        'opacity-0 group-hover:opacity-100',
        'LINK_DYNAMIC_NO_HOVER'
      ),
    },
    '#'
  ),
  // properties: { ariaHidden: true, tabIndex: -1 },
};

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
    partytown(),
    react({
      include: ['**/*.react.tsx'],
    }),
    sitemap(),
    solidJs({
      include: ['**/*.solid.tsx'],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  markdown: {
    shikiConfig: {
      // @ts-expect-error incompatible type definitions
      langs: [brainfuck, plantuml],
    },
    remarkPlugins: [
      remarkMath,
      remarkTruncateLinks,
      [remarkToc, { depth: 3 }],
      remarkGemoji,
    ],
    rehypePlugins: [
      rehypeMathjax,
      // @ts-expect-error incompatible type definitoion
      rehypeAccessibleEmojis,
      rehypeHeadingIds,
      [rehypeClassNames, markdownClasses],
      // Ordering matters - apply classes first
      // Before adding the custom link styling
      [rehypeAutolinkHeadings, autolinkOptions],
    ],
  },
});
