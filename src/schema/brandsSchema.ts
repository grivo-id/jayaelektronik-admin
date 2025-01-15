import { z } from 'zod';

export const getCreateBrandSchema = () =>
    z.object({
        brand_name: z.string().nonempty('Name is required'),
    });

export type CreateBrandPayload = z.infer<ReturnType<typeof getCreateBrandSchema>>;
