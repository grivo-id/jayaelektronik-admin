import { z } from 'zod';

export const getCreateProductSubCategorySchema = () =>
    z.object({
        product_category_id: z.string().nonempty('Category ID is required'),
        product_subcategory_name: z.string().nonempty('Sub-category name is required'),
        product_subcategory_desc: z.string().optional(),
    });

export type CreateProductSubCategoryPayload = z.infer<ReturnType<typeof getCreateProductSubCategorySchema>>;
