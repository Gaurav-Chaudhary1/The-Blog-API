import { z } from 'zod';

// Validation schema for creating a new post
export const createPostSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    content: z.string().min(20, "Content must be at least 20 characters long"),
    category: z.enum(['Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment']),
    mode: z.enum(['Draft', 'Published']).optional()
});

// Validation schema for updating an existing post
export const updatePostSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").optional(),
    content: z.string().min(20, "Content must be at least 20 characters long").optional(),
    category: z.enum(['Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment']).optional(),
    mode: z.enum(['Draft', 'Published']).optional()
});