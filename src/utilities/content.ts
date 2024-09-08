import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export const getPostUrl = (post: BlogPost) => {
  const year = post.data.date.getFullYear().toString();
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  return `/blog/${year}/${month}/${post.slug}`;
};

export const getPostOgImage = (post: BlogPost) => {
  // TODO: If custom OG image is set, return that
  const year = post.data.date.getFullYear().toString();
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  return `/api/og/${year}/${month}/${post.slug}.png`;
};
