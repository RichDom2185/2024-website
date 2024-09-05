import { experienceSchema, projectSchema } from '@site-types/data';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.array(experienceSchema),
});

const projects = defineCollection({
  type: 'data',
  schema: z.array(projectSchema),
});

export const collections = { blog, experience, projects };
