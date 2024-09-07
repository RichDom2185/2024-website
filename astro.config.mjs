// @ts-check
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import { transformerNotationErrorLevel } from '@shikijs/transformers';
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
import { SITE_BASE_URL } from './src/consts';
import { brainfuck, markdownClasses, plantuml } from './src/lib/json';
import { openExternalLinksInNewTab } from './src/utilities/markdown';

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

/**
 * @import {ShikiTransformer} from '@shikijs/core'
 * @type {ShikiTransformer}
 */
const transformerWrapWithDiv = {
  pre: (node) => {
    const common = ['highlight', 'bg-[#f8f8f8]', 'mx-0 my-[1em]', 'rounded'];
    node.properties.class = clsx(node.properties.class, ...common);
    return h(
      'div',
      {
        className: clsx(
          ...common,
          node.properties.dataLanguage &&
            `language-${node.properties.dataLanguage}`
        ),
      },
      node
    );
  },
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
  site: SITE_BASE_URL,
  integrations: [
    mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
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
      // Refer to https://shiki.style/guide/dual-themes
      defaultColor: false,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        // @ts-expect-error incompatible type definitoion
        transformerNotationErrorLevel(),
        // @ts-expect-error incompatible type definitoion
        transformerWrapWithDiv,
      ],
    },
    remarkPlugins: [
      remarkMath,
      remarkTruncateLinks,
      [remarkToc, { depth: 3 }],
      remarkGemoji,
    ],
    rehypePlugins: [
      openExternalLinksInNewTab,
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
