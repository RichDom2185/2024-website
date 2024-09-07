import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { type BlogPost, getPostUrl } from 'src/utilities/content';
import { SITE_CANONICAL_URL, SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site || SITE_CANONICAL_URL,
    items: posts.map(getXmlFromPostData),
  });
}

const getXmlFromPostData = (post: BlogPost): RSSFeedItem => {
  return {
    title: post.data.title,
    pubDate: post.data.date,
    link: getPostUrl(post),
    // TODO: Description
  };
};
