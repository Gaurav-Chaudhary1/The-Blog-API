import { z } from 'zod';

export const createCommentSchema = z.object({
    content: z.string().min(1, 'Content should be at least 1 character long'),
    postId: z.string().min(1, 'Post ID is required') 
});

export const updateCommentSchema = z.object({
    content: z.string().min(1, 'Content should be at least 1 character long').optional()
});