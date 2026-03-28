import { z } from 'zod';

export const commentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment content is required'),
    parentCommentId: z.string().uuid('Invalid parent comment ID').optional(),
  }),
});

export type CommentInput = z.infer<typeof commentSchema>['body'];
