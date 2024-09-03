import { z } from 'astro:content';
import { Technology } from './general';

const projectLinkSchema = z.object({
  icon: z.string(),
  url: z.string(),
  label: z.string(),
});

// Using `type` instead of `interface`
// results in inlining the type definition by TS.
// See https://stackoverflow.com/a/74091883
// {
//   icon: string;
//   url: string;
//   label: string;
// }
interface ProjectLink extends z.infer<typeof projectLinkSchema> {}

export const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  links: z.array(projectLinkSchema as z.ZodType<ProjectLink>).optional(),
  tech: z.array(z.nativeEnum(Technology)).optional(),
});

// See https://github.com/colinhacks/zod/issues/635#issuecomment-2196579063
// on undefined vs partial typings when using z.infer
// {
//   name: string;
//   description?: string; // TODO: See link
//   links?: ProjectLink[]; // TODO: See link
//   tech?: Technology[]; // TODO: See link
// }
export type Project = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
  company: z.string(),
  link: z.string().optional(),
  position: z.string(),
  from: z.string(),
  to: z.string(),
  description: z.string(),
  tech: z.array(z.nativeEnum(Technology)).optional(),
});

// See https://github.com/colinhacks/zod/issues/635#issuecomment-2196579063
// on undefined vs partial typings when using z.infer
// {
//   company: string;
//   link?: string; // TODO: See link
//   position: string;
//   from: string;
//   to: string;
//   description: string;
//   tech?: Technology[]; // TODO: See link
// }
export type Experience = z.infer<typeof experienceSchema>;
