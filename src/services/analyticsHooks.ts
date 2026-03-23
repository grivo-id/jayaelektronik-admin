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
    });
};

// Order Status Breakdown
export const useOrderStatusBreakdown = (params: DateRangeParams = {}) => {
    return useQuery<OrderStatusData>({
        queryKey: ['analytics-order-status', params],
        queryFn: () => ApiGetOrderStatusBreakdown(params),
        refetchOnWindowFocus: false,
    });
};

// Revenue Comparison
export const useRevenueComparison = (params: DateRangeParams) => {
    return useQuery<RevenueComparisonData>({
        queryKey: ['analytics-revenue-comparison', params],
        queryFn: () => ApiGetRevenueComparison(params),
        enabled: !!params.start_date && !!params.end_date,
        refetchOnWindowFocus: false,
    });
};

// Top Selling Products
export const useTopSellingProducts = (params: TopProductsParams = {}) => {
    return useQuery<TopSellingProduct[]>({
        queryKey: ['analytics-top-products', params],
        queryFn: () => ApiGetTopSellingProducts(params),
        refetchOnWindowFocus: false,
    });
};

// Category Performance
export const useCategoryPerformance = (params: DateRangeParams = {}) => {
    return useQuery<CategoryPerformance[]>({
        queryKey: ['analytics-category-performance', params],
        queryFn: () => ApiGetCategoryPerformance(params),
        refetchOnWindowFocus: false,
    });
};

// Customer Tier Distribution
export const useCustomerTierDistribution = () => {
    return useQuery<CustomerTierDistribution>({
        queryKey: ['analytics-tier-distribution'],
        queryFn: () => ApiGetCustomerTierDistribution(),
        refetchOnWindowFocus: false,
    });
};

// Loyalty Points Activity
export const useLoyaltyPointsActivity = (params: DateRangeParams = {}) => {
    return useQuery<LoyaltyPointsActivity[]>({
        queryKey: ['analytics-points-activity', params],
        queryFn: () => ApiGetLoyaltyPointsActivity(params),
        refetchOnWindowFocus: false,
    });
};

// Coupon Usage Analytics
export const useCouponUsageAnalytics = (params: DateRangeParams = {}) => {
    return useQuery<CouponUsage[]>({
        queryKey: ['analytics-coupon-usage', params],
        queryFn: () => ApiGetCouponUsageAnalytics(params),
        refetchOnWindowFocus: false,
    });
};

// Low Stock Products
export const useLowStockProducts = (params: LowStockParams = {}) => {
    return useQuery<LowStockProduct[]>({
        queryKey: ['analytics-low-stock', params],
        queryFn: () => ApiGetLowStockProducts(params),
        refetchOnWindowFocus: false,
    });
};

// Geographic Distribution
export const useGeographicDistribution = (params: DateRangeParams = {}) => {
    return useQuery<GeographicData>({
        queryKey: ['analytics-geographic', params],
        queryFn: () => ApiGetGeographicDistribution(params),
        refetchOnWindowFocus: false,
    });
};

// ==================== NEW ANALYTICS HOOKS ====================

// Top Customers by Revenue
export const useTopCustomersByRevenue = (params: TopCustomersParams = {}) => {
    return useQuery<TopCustomer[]>({
        queryKey: ['analytics-top-customers', params],
        queryFn: () => ApiGetTopCustomersByRevenue(params),
        refetchOnWindowFocus: false,
    });
};

// Average Items per Order
export const useAverageItemsPerOrder = (params: AverageItemsParams = {}) => {
    return useQuery<AverageItemsPerOrder>({
        queryKey: ['analytics-average-items', params],
        queryFn: () => ApiGetAverageItemsPerOrder(params),
        refetchOnWindowFocus: false,
    });
};

// Repeat Purchase Rate
export const useRepeatPurchaseRate = (params: DateRangeParams = {}) => {
    return useQuery<RepeatPurchaseRate>({
        queryKey: ['analytics-repeat-purchase', params],
        queryFn: () => ApiGetRepeatPurchaseRate(params),
        refetchOnWindowFocus: false,
    });
};

// Brand Performance
export const useBrandPerformance = (params: DateRangeParams = {}) => {
    return useQuery<BrandPerformance[]>({
        queryKey: ['analytics-brand-performance', params],
        queryFn: () => ApiGetBrandPerformance(params),
        refetchOnWindowFocus: false,
    });
};

// Order Value Distribution
export const useOrderValueDistribution = (params: DateRangeParams = {}) => {
    return useQuery<OrderValueDistribution>({
        queryKey: ['analytics-order-value-distribution', params],
        queryFn: () => ApiGetOrderValueDistribution(params),
        refetchOnWindowFocus: false,
    });
};

// Customer Acquisition Trends
export const useCustomerAcquisitionTrends = (params: AcquisitionParams = {}) => {
    return useQuery<CustomerAcquisitionTrend[]>({
        queryKey: ['analytics-acquisition-trends', params],
        queryFn: () => ApiGetCustomerAcquisitionTrends(params),
        refetchOnWindowFocus: false,
    });
};

// Best Selling by Category
export const useBestSellingByCategory = (params: BestSellingByCategoryParams = {}) => {
    return useQuery<BestSellingByCategory[]>({
        queryKey: ['analytics-best-selling-category', params],
        queryFn: () => ApiGetBestSellingByCategory(params),
        refetchOnWindowFocus: false,
    });
};
