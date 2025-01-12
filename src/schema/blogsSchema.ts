import { z } from 'zod';

export const createBlogSchema = z.object({
    blog_category_id: z.string().min(1, 'Category is required'),
    blog_title: z.string().min(1, 'Blog title is required'),
    blog_desc: z.string().min(1, 'Blog description is required'),
    blogKeywordNames: z.array(z.string()).min(1, 'At least one keyword is required'),
});

export type CreateBlogPayload = z.infer<typeof createBlogSchema>;
