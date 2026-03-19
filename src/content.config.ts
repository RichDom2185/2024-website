import { experienceSchema, projectSchema } from '@site-types/data';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
  }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    authors: z.array(z.string()).min(1),
  }),
});

const experience = defineCollection({
  loader: glob({
    base: './src/content/experience',
    pattern: '**/*.yml',
  }),
  schema: z.array(experienceSchema),
});

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.yml',
  }),
  schema: z.array(projectSchema),
});

export const collections = { blog, experience, projects };
