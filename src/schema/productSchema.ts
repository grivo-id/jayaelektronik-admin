import { z } from 'zod';

export const getCreateProductSchema = () =>
    z.object({
        product_name: z.string().min(1, 'Product name is required'),
        product_code: z.string().min(1, 'Product code is required'),
        product_price: z.number().min(0, 'Price cannot be negative'),
        product_item_sold: z.number().min(0, 'Items sold cannot be negative'),
        product_desc: z.string().min(1, 'Product description is required'),
        product_is_available: z.boolean(),
        product_is_show: z.boolean(),
        product_is_bestseller: z.boolean(),
        product_is_new_arrival: z.boolean(),
        brand_id: z.string().min(1, 'Brand must be selected'),
        product_category_id: z.string().min(1, 'Category must be selected'),
        product_subcategory_id: z.string().min(1, 'Subcategory must be selected'),
        product_tag_names: z.array(z.string()),
        product_promo_is_best_deal: z.boolean(),
        product_promo_is_discount: z.boolean(),
        product_promo_discount_percentage: z.number(),
        product_promo_final_price: z.number(),
        product_promo_expired_date: z.string().nullable(),
        product_image1: z.string().min(1, 'At least one product image is required'),
        product_image2: z.string().optional(),
        product_image3: z.string().optional(),
    });

export const getUpdateProductSchema = () =>
    z.object({
        product_name: z.string().min(1, 'Product name is required'),
        product_code: z.string().min(1, 'Product code is required'),
        product_price: z.number().min(0, 'Price cannot be negative'),
        product_item_sold: z.number().min(0, 'Items sold cannot be negative'),
        product_desc: z.string().min(1, 'Product description is required'),
        product_is_available: z.boolean(),
        product_is_show: z.boolean(),
        product_is_bestseller: z.boolean(),
        product_is_new_arrival: z.boolean(),
        brand_id: z.string().min(1, 'Brand must be selected'),
        product_category_id: z.string().min(1, 'Category must be selected'),
        product_subcategory_id: z.string().min(1, 'Subcategory must be selected'),
        product_tag_names: z.array(z.string()),
        product_promo_is_best_deal: z.boolean(),
        product_promo_is_discount: z.boolean(),
        product_promo_discount_percentage: z.number(),
        product_promo_final_price: z.number(),
        product_promo_expired_date: z.string().nullable(),
        product_image1: z.string().min(1, 'At least one product image is required'),
        product_image2: z.string().optional(),
        product_image3: z.string().optional(),
    });

export type CreateProductPayload = z.infer<ReturnType<typeof getCreateProductSchema>>;
export type UpdateProductPayload = z.infer<ReturnType<typeof getUpdateProductSchema>>;
