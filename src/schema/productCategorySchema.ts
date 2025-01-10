import { z } from 'zod';

export const getCreateProductCategorySchema = () =>
    z.object({
        product_category_name: z.string().nonempty('Name is required'),
        product_category_desc: z.string().nonempty('Description is required'),
    });

export type CreateProductCategoryPayload = z.infer<ReturnType<typeof getCreateProductCategorySchema>>;
