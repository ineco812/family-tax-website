import { defineCollection, z } from 'astro:content';
import { glob } from 'astro:loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    aiSummary: z.string().optional(),
    readingTime: z.number().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { posts };
