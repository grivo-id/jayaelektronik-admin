interface Product {
    product_id: string;
    user_id: string;
    product_subcategory_id: string;
    brand_id: string;
    product_code: string;
    product_name: string;
    product_price: number;
    product_item_sold: number;
    product_desc: string;
    product_image1: string | null;
    product_image2: string | null;
    product_image3: string | null;
    product_is_available: boolean;
    product_is_show: boolean;
    product_is_bestseller: boolean;
    product_is_new_arrival: boolean;
    product_updated_by: string;
    product_updated_at: string;
    product_created_date: string;
    user_name: string;
    updated_by: string;
    brand_name: string;
    brand_image: string;
    product_category_id: string;
    product_subcategory_name: string;
    product_category_name: string;
    product_tags: Array<{
        product_tag_id: string;
        product_tag_name: string;
    }>;
    product_promo: {
        product_promo_id: string;
        product_promo_price: number;
        product_promo_final_price: number;
        product_promo_is_discount: boolean;
        product_promo_created_date: string;
        product_promo_expired_date: string;
        product_promo_is_best_deal: boolean;
        product_promo_discount_percentage: number;
    };
}
