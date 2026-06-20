import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    link: z.string().optional(),
    repo: z.string().optional(),
    docs: z.string().optional(),
    type: z.string().optional(),
    useCase: z.string().optional(),
    pricing: z.string().optional(),
    status: z.string().optional(),
    featured: z.boolean().optional(),
    aiGenerated: z.boolean().optional(),

    // Metadatos del repositorio de GitHub (se actualizan con scripts/refresh-github.mjs)
    stars: z.number().optional(),
    lastCommit: z.coerce.date().optional(),
    version: z.string().optional(),
    archived: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    stack: z.array(z.string()).optional(),
    author: z.string().optional(),
    aditional: z.array(z.string()).optional(),
    internal: z.array(z.string()).optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
};
