import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export const getPostUrl = (post: BlogPost) => {
  const year = post.data.date.getFullYear().toString();
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  return `/blog/${year}/${month}/${post.slug}`;
};
