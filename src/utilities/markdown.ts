import type { Root as HastRoot } from 'hast';
import type { Root as MdastRoot } from 'mdast';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export type LinkOptions = {
  target?: string;
  noopener?: boolean;
  noreferrer?: boolean;
  nofollow?: boolean;
};

function setLinkAttrs(options: LinkOptions = {}) {
  const { target, noopener, noreferrer, nofollow } = options;
  const rel = [
    noopener && 'noopener',
    noreferrer && 'noreferrer',
    nofollow && 'nofollow',
  ]
    .filter(Boolean)
    .join(' ');
  return function transformer(tree: HastRoot) {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') {
        return;
      }
      if (target) {
        node.properties.target = target;
      }
      if (rel) {
        node.properties.rel = rel;
      }
    });
  };
}

export function openExternalLinksInNewTab() {
  return function transformer(tree: HastRoot) {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') {
        return;
      }
      const href = node.properties.href as string | null | undefined;
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        node.properties.target = '_blank';
        // TODO: Double check noreferrer
        node.properties.rel = 'noopener noreferrer';
      }
    });
  };
}

export const mdToHtmlString = (linkOptions: LinkOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(setLinkAttrs, linkOptions)
    .use(rehypeStringify);

function getFirstParagraph() {
  return function transformer(tree: MdastRoot) {
    visit(tree, 'root', (node) => {
      node.children = node.children
        .filter((child) => child.type === 'paragraph')
        .filter((child) => child.children.some((c) => c.type === 'text'));

      node.children.forEach((p) => {
        // Guard clause, for type inference
        if (p.type !== 'paragraph') {
          return;
        }

        // Flatten links in paragraphs
        p.children = p.children.flatMap((child) => {
          if (child.type !== 'link') {
            return [child];
          }
          return child.children;
        });
      });

      node.children.length =
        node.children.length > 1 ? 1 : node.children.length;
    });
  };
}

export const mdToExcerpt = unified()
  .use(remarkParse)
  .use(getFirstParagraph)
  .use(remarkStringify);
