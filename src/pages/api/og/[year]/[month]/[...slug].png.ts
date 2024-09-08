import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import type { BlogPost } from 'src/utilities/content';
import { createNodes, getFont } from 'src/utilities/og';

const fontRegular = await getFont('Plus Jakarta Sans', 400);
const fontMedium = await getFont('Plus Jakarta Sans', 500);
const fontBold = await getFont('Plus Jakarta Sans', 700);

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: {
      year: post.data.date.getFullYear().toString(),
      month: String(post.data.date.getMonth() + 1).padStart(2, '0'),
      slug: post.slug,
    },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const nodes = await createNodes(props as BlogPost);
  const svg = await satori(nodes as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Plus Jakarta Sans', data: fontRegular!, weight: 400 },
      { name: 'Plus Jakarta Sans', data: fontMedium!, weight: 500 },
      { name: 'Plus Jakarta Sans', data: fontBold!, weight: 700 },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  });
};
