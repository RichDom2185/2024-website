import { experimental_AstroContainer } from 'astro/container';
import axios from 'axios';
import { decode } from 'html-entities';
import { html } from 'satori-html';
import OgImage from 'src/components/blog/OgImage.astro';
import type { BlogPost } from './content';

// Retrieves font from Google Fonts. Adapted from
// https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts
export const getFont = async (fontName: string, weight: number) => {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontName
  )}:wght@${weight}`;
  const response = await axios.get<string>(url);
  const css = response.data;
  const font = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  return font ? (await fetch(font[1])).arrayBuffer() : null;
};

type VNode = ReturnType<typeof html>;

// Unescapes special characters for OG image. Copied from
// https://github.com/natemoo-re/satori-html/issues/20#issuecomment-1999332693
function unescapeHTML(node: VNode) {
  const children = node?.props?.children;
  if (!children) {
    return;
  } else if (Array.isArray(children)) {
    for (const n of children) {
      unescapeHTML(n);
    }
  } else if (typeof children === 'object') {
    unescapeHTML(children);
  } else if (typeof children === 'string') {
    node.props.children = decode(children);
  }
}

const container = await experimental_AstroContainer.create();
export const createNodes = async (post: BlogPost) => {
  const htmlString = await container.renderToString(OgImage, { props: post });
  const rawNodes = html(htmlString);
  unescapeHTML(rawNodes);
  return rawNodes;
};
