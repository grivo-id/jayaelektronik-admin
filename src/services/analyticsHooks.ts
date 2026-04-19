import { useQuery } from '@tanstack/react-query';
import {
    ApiGetSalesAnalytics,
    ApiGetOrderStatusBreakdown,
    ApiGetRevenueComparison,
    ApiGetTopSellingProducts,
    ApiGetCategoryPerformance,
    ApiGetCustomerTierDistribution,
    ApiGetLoyaltyPointsActivity,
    ApiGetCouponUsageAnalytics,
    ApiGetLowStockProducts,
    ApiGetGeographicDistribution,
    ApiGetTopCustomersByRevenue,
    ApiGetAverageItemsPerOrder,
    ApiGetRepeatPurchaseRate,
    ApiGetBrandPerformance,
    ApiGetOrderValueDistribution,
    ApiGetCustomerAcquisitionTrends,
    ApiGetBestSellingByCategory,
    SalesAnalyticsParams,
    DateRangeParams,
    TopProductsParams,
    LowStockParams,
    TopCustomersParams,
    AverageItemsParams,
    AcquisitionParams,
    BestSellingByCategoryParams,
} from '../api/analyticsApi';
import {
    SalesAnalyticsData,
    OrderStatusData,
    RevenueComparisonData,
    TopSellingProduct,
    CategoryPerformance,
    CustomerTierDistribution,
    LoyaltyPointsActivity,
    CouponUsage,
    LowStockProduct,
    GeographicData,
    TopCustomer,
    AverageItemsPerOrder,
    RepeatPurchaseRate,
    BrandPerformance,
    OrderValueDistribution,
    CustomerAcquisitionTrend,
    BestSellingByCategory,
} from '../types/analyticsType';

// Sales Analytics
export const useSalesAnalytics = (params: SalesAnalyticsParams = {}) => {
    return useQuery<SalesAnalyticsData>({
        queryKey: ['analytics-sales', params],
        queryFn: () => ApiGetSalesAnalytics(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        retryDelay: 1000,
    });
};

// Order Status Breakdown
export const useOrderStatusBreakdown = (params: DateRangeParams = {}) => {
    return useQuery<OrderStatusData>({
        queryKey: ['analytics-order-status', params],
        queryFn: () => ApiGetOrderStatusBreakdown(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Revenue Comparison
export const useRevenueComparison = (params: DateRangeParams) => {
    return useQuery<RevenueComparisonData>({
        queryKey: ['analytics-revenue-comparison', params],
        queryFn: () => ApiGetRevenueComparison(params),
        enabled: !!params.start_date && !!params.end_date,
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Top Selling Products
export const useTopSellingProducts = (params: TopProductsParams = {}) => {
    return useQuery<TopSellingProduct[]>({
        queryKey: ['analytics-top-products', params],
        queryFn: () => ApiGetTopSellingProducts(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Category Performance
export const useCategoryPerformance = (params: DateRangeParams = {}) => {
    return useQuery<CategoryPerformance[]>({
        queryKey: ['analytics-category-performance', params],
        queryFn: () => ApiGetCategoryPerformance(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Customer Tier Distribution
export const useCustomerTierDistribution = () => {
    return useQuery<CustomerTierDistribution>({
        queryKey: ['analytics-tier-distribution'],
        queryFn: () => ApiGetCustomerTierDistribution(),
        refetchOnWindowFocus: false,
        gcTime: 10 * 60 * 1000, // 10 minutes - changes less frequently
        retry: 1,
        retryDelay: 1000,
    });
};

// Loyalty Points Activity
export const useLoyaltyPointsActivity = (params: DateRangeParams = {}) => {
    return useQuery<LoyaltyPointsActivity[]>({
        queryKey: ['analytics-points-activity', params],
        queryFn: () => ApiGetLoyaltyPointsActivity(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Coupon Usage Analytics
export const useCouponUsageAnalytics = (params: DateRangeParams = {}) => {
    return useQuery<CouponUsage[]>({
        queryKey: ['analytics-coupon-usage', params],
        queryFn: () => ApiGetCouponUsageAnalytics(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Low Stock Products
export const useLowStockProducts = (params: LowStockParams = {}) => {
    return useQuery<LowStockProduct[]>({
        queryKey: ['analytics-low-stock', params],
        queryFn: () => ApiGetLowStockProducts(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Geographic Distribution
export const useGeographicDistribution = (params: DateRangeParams = {}) => {
    return useQuery<GeographicData>({
        queryKey: ['analytics-geographic', params],
        queryFn: () => ApiGetGeographicDistribution(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// ==================== NEW ANALYTICS HOOKS ====================

// Top Customers by Revenue
export const useTopCustomersByRevenue = (params: TopCustomersParams = {}) => {
    return useQuery<TopCustomer[]>({
        queryKey: ['analytics-top-customers', params],
        queryFn: () => ApiGetTopCustomersByRevenue(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Average Items per Order
export const useAverageItemsPerOrder = (params: AverageItemsParams = {}) => {
    return useQuery<AverageItemsPerOrder>({
        queryKey: ['analytics-average-items', params],
        queryFn: () => ApiGetAverageItemsPerOrder(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Repeat Purchase Rate
export const useRepeatPurchaseRate = (params: DateRangeParams = {}) => {
    return useQuery<RepeatPurchaseRate>({
        queryKey: ['analytics-repeat-purchase', params],
        queryFn: () => ApiGetRepeatPurchaseRate(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Brand Performance
export const useBrandPerformance = (params: DateRangeParams = {}) => {
    return useQuery<BrandPerformance[]>({
        queryKey: ['analytics-brand-performance', params],
        queryFn: () => ApiGetBrandPerformance(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Order Value Distribution
export const useOrderValueDistribution = (params: DateRangeParams = {}) => {
    return useQuery<OrderValueDistribution>({
        queryKey: ['analytics-order-value-distribution', params],
        queryFn: () => ApiGetOrderValueDistribution(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Customer Acquisition Trends
export const useCustomerAcquisitionTrends = (params: AcquisitionParams = {}) => {
    return useQuery<CustomerAcquisitionTrend[]>({
        queryKey: ['analytics-acquisition-trends', params],
        queryFn: () => ApiGetCustomerAcquisitionTrends(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};

// Best Selling by Category
export const useBestSellingByCategory = (params: BestSellingByCategoryParams = {}) => {
    return useQuery<BestSellingByCategory[]>({
        queryKey: ['analytics-best-selling-category', params],
        queryFn: () => ApiGetBestSellingByCategory(params),
        refetchOnWindowFocus: false,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
};
