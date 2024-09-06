import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export const getPostUrl = (post: BlogPost) => {
  // TODO: Use /year/month/slug format
  return post.slug;
};
