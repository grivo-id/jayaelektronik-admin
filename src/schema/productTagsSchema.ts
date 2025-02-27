import { z } from 'zod';

export const getCreateProductTagSchema = () =>
    z.object({
        product_tag_name: z.string().nonempty('Name is required'),
    });

export type CreateProductTagPayload = z.infer<ReturnType<typeof getCreateProductTagSchema>>;
