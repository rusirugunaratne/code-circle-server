import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
    bio: z.string().max(160, 'Bio cannot exceed 160 characters').optional(),
    avatarUrl: z.string().url('Invalid URL format for avatar').optional().or(z.literal('')),
    location: z.string().optional(),
    headline: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    websiteUrl: z.string().url('Invalid website URL').optional().or(z.literal('')),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
