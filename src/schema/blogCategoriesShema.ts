import { z } from 'zod';

export const getCreateBlogCategorySchema = () =>
    z.object({
        blog_category_name: z.string().nonempty('Name is required'),
        blog_category_desc: z.string().nonempty('Description is required'),
    });

export type CreateBlogCategoryPayload = z.infer<ReturnType<typeof getCreateBlogCategorySchema>>;
