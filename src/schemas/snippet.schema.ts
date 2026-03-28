import { z } from 'zod';

export const createSnippetSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().optional(),
    code: z.string().min(1, 'Code is required'),
    language: z.string().min(1, 'Language is required'),
    tags: z.array(z.string()).default([]),
  }),
});

export const getFeedSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
  }),
});

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>['body'];
