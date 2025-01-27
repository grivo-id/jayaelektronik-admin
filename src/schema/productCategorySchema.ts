import { z } from 'zod';

export const getCreateProductCategorySchema = () =>
    z.object({
        product_category_name: z.string().nonempty('Category name is required'),
        product_category_desc: z.string().optional(),
    });

export type CreateProductCategoryPayload = z.infer<ReturnType<typeof getCreateProductCategorySchema>>;
