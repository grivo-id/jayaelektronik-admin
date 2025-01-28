export interface Order {
    order_id: string;
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
        product_subcategory_id: string;
        product_subcategory_name: string;
    }>;
}
