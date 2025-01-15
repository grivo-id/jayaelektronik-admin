import { z } from 'zod';

export const getCreateBlogKeywordSchema = () =>
    z.object({
        blog_keyword_name: z.string().nonempty('Name is required'),
    });

export type CreateBlogKeywordPayload = z.infer<ReturnType<typeof getCreateBlogKeywordSchema>>;
