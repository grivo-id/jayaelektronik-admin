export interface Coupon {
    coupon_discount_id: string;
    user_id: string;
    coupon_code: string;
    coupon_percentage: number;
    coupon_min_product_qty: number;
    coupon_min_transaction: number;
    coupon_max_discount: number;
    coupon_expired_date: string;
    coupon_used: number;
    coupon_max_used: number;
    coupon_completed_used: number;
    coupon_created_date: string;
    created_by: string;
}
