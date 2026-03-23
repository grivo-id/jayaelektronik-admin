export interface SalesAnalyticsData {
    data: any;
    time_series: {
        date: Date | string;
        orders_count: number;
        revenue: number;
        average_order_value: number;
        unique_customers: number;
    }[];
    summary: {
        total_revenue: number;
        total_orders: number;
        average_order_value: number;
        unique_customers: number;
    };
}

export interface OrderStatusData {
    by_status: {
        status: 'completed' | 'pending';
        orders_count: number;
        revenue: number;
        percentage: number;
    }[];
    total_orders: number;
}

export interface RevenueComparisonData {
    current_period: {
        start_date: Date;
        end_date: Date;
        orders_count: number;
        revenue: number;
        average_order_value: number;
    };
    previous_period: {
        start_date: Date;
        end_date: Date;
        orders_count: number;
        revenue: number;
        average_order_value: number;
    };
    growth: {
        revenue: number;
        orders: number;
        aov: number;
    };
}

export interface TopSellingProduct {
    product_id: string;
    product_name: string;
    product_image1: string;
    category: string;
    brand_name: string;
    total_sold: number;
    total_revenue: number;
    order_count: number;
}

export interface CategoryPerformance {
    product_subcategory_id: string;
    category: string;
    parent_category: string;
    orders_count: number;
    items_sold: number;
    revenue: number;
    average_order_value: number;
}

export interface CustomerTierDistribution {
    tiers: {
        tier_id: string;
        tier_name: string;
        tier_order: number;
        customer_count: number;
        total_points: number;
        percentage: number;
    }[];
    total_customers: number;
}

export interface LoyaltyPointsActivity {
    transaction_type: string;
    positive_points: number;
    negative_points: number;
    transaction_count: number;
}

export interface CouponUsage {
    coupon_code: string;
    coupon_percentage: number;
    coupon_max_discount: number;
    usage_count: number;
    total_revenue_with_coupon: number;
    unique_customers: number;
}

export interface LowStockProduct {
    product_id: string;
    product_name: string;
    product_image1: string;
    product_stock: number;
    product_subcategory_name: string;
    brand_name: string;
    sold_last_30_days: number;
    status: 'critical' | 'low' | 'warning' | 'ok';
}

export interface GeographicData {
    by_city: {
        city: string;
        orders_count: number;
        revenue: number;
        percentage: number;
    }[];
    total_revenue: number;
}

// ==================== NEW ANALYTICS TYPES ====================

export interface TopCustomer {
    order_email: string;
    order_fullname: string;
    orders_count: number;
    total_revenue: number;
    average_order_value: number;
    first_order_date: Date;
    last_order_date: Date;
}

export interface AverageItemsPerOrder {
    time_series: {
        date: Date | string;
        orders_count: number;
        total_items: number;
        average_items_per_order: number;
    }[];
    overall_average: number;
}

export interface RepeatPurchaseRate {
    total_customers: number;
    new_customers: number;
    returning_customers: number;
    new_customer_percentage: number;
    returning_customer_percentage: number;
}

export interface BrandPerformance {
    brand_id: string;
    brand_name: string;
    brand_image: string;
    orders_count: number;
    items_sold: number;
    products_sold: number;
    revenue: number;
    average_order_value: number;
}

export interface OrderValueDistribution {
    distribution: {
        price_range: 'under_500k' | '500k_1m' | '1m_5m' | '5m_plus';
        orders_count: number;
        revenue: number;
        revenue_percentage: number;
        orders_percentage: number;
    }[];
    total_revenue: number;
    total_orders: number;
}

export interface CustomerAcquisitionTrend {
    date: Date | string;
    new_customers: number;
}

export interface BestSellingByCategory {
    category: string;
    products: {
        product_id: string;
        product_name: string;
        product_image1: string;
        brand_name: string;
        total_sold: number;
        total_revenue: number;
        order_count: number;
    }[];
}
