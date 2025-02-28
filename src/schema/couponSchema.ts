import { z } from 'zod';

export const getCreateCouponSchema = () =>
    z.object({
        coupon_code: z.string().min(1, 'Coupon code is required'),
        coupon_percentage: z.number().min(0, 'Percentage must be non-negative').max(100, 'Percentage cannot exceed 100'),
        coupon_min_product_qty: z.number().int().min(1, 'Minimum product quantity must be at least 1'),
        coupon_min_transaction: z.number().min(0, 'Minimum transaction amount must be non-negative'),
        coupon_max_discount: z.number().min(0, 'Maximum discount must be non-negative'),
        coupon_max_used: z.number().int().min(1, 'Maximum usage count must be at least 1'),
        coupon_expired_date: z.string().datetime('Invalid date format'),
    });

export type CreateCouponPayload = z.infer<ReturnType<typeof getCreateCouponSchema>>;
