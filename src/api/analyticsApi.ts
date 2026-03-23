import { axiosInstance } from './base';

// ==================== SALES ANALYTICS ====================

export interface SalesAnalyticsParams {
    start_date?: string;
    end_date?: string;
    group_by?: 'daily' | 'weekly' | 'monthly';
}

export const ApiGetSalesAnalytics = async (params: SalesAnalyticsParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/sales', { params });
    return response.data.data;
};

// ==================== ORDER STATUS BREAKDOWN ====================

export interface DateRangeParams {
    start_date?: string;
    end_date?: string;
}

export const ApiGetOrderStatusBreakdown = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/orders/status', { params });
    return response.data.data;
};

// ==================== REVENUE COMPARISON ====================

export const ApiGetRevenueComparison = async (params: DateRangeParams) => {
    const response = await axiosInstance.get('/admin/analytics/revenue/comparison', { params });
    return response.data.data;
};

// ==================== TOP SELLING PRODUCTS ====================

export interface TopProductsParams extends DateRangeParams {
    limit?: number;
    category_id?: string;
}

export const ApiGetTopSellingProducts = async (params: TopProductsParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/products/top-selling', { params });
    return response.data.data;
};

// ==================== CATEGORY PERFORMANCE ====================

export const ApiGetCategoryPerformance = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/categories/performance', { params });
    return response.data.data;
};

// ==================== CUSTOMER TIER DISTRIBUTION ====================

export const ApiGetCustomerTierDistribution = async () => {
    const response = await axiosInstance.get('/admin/analytics/customers/tier-distribution');
    return response.data.data;
};

// ==================== LOYALTY POINTS ACTIVITY ====================

export const ApiGetLoyaltyPointsActivity = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/loyalty/points-activity', { params });
    return response.data.data;
};

// ==================== COUPON USAGE ANALYTICS ====================

export const ApiGetCouponUsageAnalytics = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/coupons/usage', { params });
    return response.data.data;
};

// ==================== LOW STOCK PRODUCTS ====================

export interface LowStockParams {
    limit?: number;
}

export const ApiGetLowStockProducts = async (params: LowStockParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/products/low-stock', { params });
    return response.data.data;
};

// ==================== GEOGRAPHIC DISTRIBUTION ====================

export const ApiGetGeographicDistribution = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/sales/geographic', { params });
    return response.data.data;
};

// ==================== NEW ANALYTICS APIS ====================

// Top Customers by Revenue
export interface TopCustomersParams extends DateRangeParams {
    limit?: number;
}

export const ApiGetTopCustomersByRevenue = async (params: TopCustomersParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/customers/top-revenue', { params });
    return response.data.data;
};

// Average Items per Order
export interface AverageItemsParams extends DateRangeParams {
    group_by?: 'daily' | 'weekly' | 'monthly';
}

export const ApiGetAverageItemsPerOrder = async (params: AverageItemsParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/orders/average-items', { params });
    return response.data.data;
};

// Repeat Purchase Rate
export const ApiGetRepeatPurchaseRate = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/customers/repeat-purchase-rate', { params });
    return response.data.data;
};

// Brand Performance
export const ApiGetBrandPerformance = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/brands/performance', { params });
    return response.data.data;
};

// Order Value Distribution
export const ApiGetOrderValueDistribution = async (params: DateRangeParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/orders/value-distribution', { params });
    return response.data.data;
};

// Customer Acquisition Trends
export interface AcquisitionParams extends DateRangeParams {
    group_by?: 'daily' | 'weekly' | 'monthly';
}

export const ApiGetCustomerAcquisitionTrends = async (params: AcquisitionParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/customers/acquisition-trends', { params });
    return response.data.data;
};

// Best Selling by Category
export interface BestSellingByCategoryParams extends DateRangeParams {
    top_n?: number;
}

export const ApiGetBestSellingByCategory = async (params: BestSellingByCategoryParams = {}) => {
    const response = await axiosInstance.get('/admin/analytics/categories/best-selling', { params });
    return response.data.data;
};
