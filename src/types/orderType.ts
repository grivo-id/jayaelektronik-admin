export interface Order {
    order_id: string;
    coupon_code?: string;
    order_email: string;
    order_user_name: string;
    order_phone: string;
    order_address: string;
    order_grand_total: number;
    order_is_completed: boolean;
    order_user_verified: boolean;
    order_updated_at: string;
    order_created_date: string;
    products: Array<{
        brand_id: string;
        brand_name: string;
        product_id: string;
        product_qty: number;
        product_name: string;
        product_price: number;
        product_subtotal: number;
        product_subcategory_id: string;
        product_subcategory_name: string;
        order_discount_percentage: number | null;
        product_price_at_purchase: number;
    }>;
    coupon_detail?: {
        coupon_code: string;
        coupon_used: number;
        coupon_percentage: number;
        coupon_discount_id: string;
        coupon_expired_date: string;
        coupon_max_discount: number;
        coupon_min_product_qty: number;
        coupon_min_transaction: number;
    };
}
