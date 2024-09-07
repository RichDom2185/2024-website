// @ts-check
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostUrl } from 'src/utilities/content';
import { SITE_CANONICAL_URL, SITE_DESCRIPTION, SITE_TITLE } from '../consts';

/**
 * @import { APIContext } from 'astro';
 * @import { RSSFeedItem } from '@astrojs/rss';
 * @import { BlogPost } from 'src/utilities/content';
 */

/**
 * @param {APIContext} context
 */
export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site || SITE_CANONICAL_URL,
    items: posts.map(getXmlFromPostData),
  });
}

/**
 *
 * @param {BlogPost} post
 * @returns {RSSFeedItem}
 */
const getXmlFromPostData = (post) => {
  return {
    title: post.data.title,
    pubDate: post.data.date,
    link: getPostUrl(post),
    // TODO: Description
  };
};
