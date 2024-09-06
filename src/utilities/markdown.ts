import type { Root } from 'mdast';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export const mdToHtmlString = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

function getFirstParagraph() {
  return function transformer(tree: Root) {
    visit(tree, 'root', (node) => {
      node.children = node.children.filter(
        (child) => child.type === 'paragraph'
      );
      node.children.length =
        node.children.length > 1 ? 1 : node.children.length;
    });
  };
}

export const mdToExcerpt = unified()
  .use(remarkParse)
  .use(getFirstParagraph)
  .use(remarkStringify);
