import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useSearchParams } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import {
    useSalesAnalytics,
    useOrderStatusBreakdown,
    useRevenueComparison,
    useTopSellingProducts,
    useCategoryPerformance,
    useCustomerTierDistribution,
    useLoyaltyPointsActivity,
    useCouponUsageAnalytics,
    useTopCustomersByRevenue,
    useAverageItemsPerOrder,
    useRepeatPurchaseRate,
    useBrandPerformance,
    useOrderValueDistribution,
    useCustomerAcquisitionTrends,
    useBestSellingByCategory,
} from '../../services/analyticsHooks';
import formatToRupiah from '../../utils/formatToRupiah';
import formatChartAxis from '../../utils/formatChartAxis';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import IconTrendingDown from '../../components/Icon/IconTrendingDown';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconBox from '../../components/Icon/IconBox';
import IconBarChart from '../../components/Icon/IconBarChart';
import IconUsers from '../../components/Icon/IconUsers';
import DateRangeFilter from '../../components/DateRangeFilter';
import ChartLoader from '../../components/ChartLoader';
import Skeleton from 'react-loading-skeleton';
import AnalyticsTooltip from '../../components/AnalyticsTooltip';

const Analytics = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    // Initialize state from URL params
    const urlRange = searchParams.get('range') as any;
    const urlStart = searchParams.get('start');
    const urlEnd = searchParams.get('end');

    const [dateRange, setDateRange] = useState<any>(urlRange || 'today');
    const [customStart, setCustomStart] = useState<string>(urlStart || '');
    const [customEnd, setCustomEnd] = useState<string>(urlEnd || '');

    // Calculate date range based on selection
    const { startDate, endDate } = useMemo(() => {
        const now = new Date();
        let start: Date;
        let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        switch (dateRange) {
            case 'today':
                start = new Date(now);
                start.setHours(0, 0, 0, 0);
                break;
            case 'week':
                start = new Date(now);
                start.setDate(now.getDate() - 7);
                start.setHours(0, 0, 0, 0);
                break;
            case '30d':
                start = new Date(now);
                start.setDate(now.getDate() - 30);
                start.setHours(0, 0, 0, 0);
                break;
            case '90d':
                start = new Date(now);
                start.setDate(now.getDate() - 90);
                start.setHours(0, 0, 0, 0);
                break;
            case '1y':
                start = new Date(now);
                start.setFullYear(now.getFullYear() - 1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'custom':
                // Parse date string manually to create local Date (not UTC)
                if (customStart) {
                    const [sy, sm, sd] = customStart.split('-').map(Number);
                    start = new Date(sy, sm - 1, sd, 0, 0, 0);
                } else {
                    start = new Date();
                    start.setHours(0, 0, 0, 0);
                }
                if (customEnd) {
                    const [ey, em, ed] = customEnd.split('-').map(Number);
                    end = new Date(ey, em - 1, ed, 23, 59, 59, 999);
                }
                break;
            default:
                start = new Date();
                start.setHours(0, 0, 0, 0);
        }

        // Format Date to YYYY-MM-DD string using LOCAL date (not UTC)
        const formatLocalDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatLocalDate(start),
            endDate: formatLocalDate(end),
        };
    }, [dateRange, customStart, customEnd]);

    useEffect(() => {
        dispatch(setPageTitle('Analytics Dashboard'));
    }, [dispatch]);

    // Sync state from URL params on mount (when URL has custom dates but range is not set correctly)
    useEffect(() => {
        if (urlStart && urlEnd && urlRange !== 'custom') {
            setDateRange('custom');
            setCustomStart(urlStart);
            setCustomEnd(urlEnd);
        }
    }, []);

    // Update URL params when date range changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (dateRange === 'custom' && customStart && customEnd) {
            params.set('range', 'custom');
            params.set('start', customStart);
            params.set('end', customEnd);
        } else if (dateRange && dateRange !== 'custom') {
            params.set('range', dateRange);
            params.delete('start');
            params.delete('end');
        }

        setSearchParams(params);
    }, [dateRange, customStart, customEnd, searchParams, setSearchParams]);

    // API calls
    const { data: salesData, isLoading: salesLoading, isError: salesError } = useSalesAnalytics({
        start_date: startDate,
        end_date: endDate,
        group_by: 'daily',
    });

    const { data: orderStatusData, isLoading: statusLoading, isError: statusError } = useOrderStatusBreakdown({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: revenueComparison } = useRevenueComparison({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: topProducts } = useTopSellingProducts({
        start_date: startDate,
        end_date: endDate,
        limit: 5,
    });

    const { data: categoryPerformance, isLoading: categoryLoading } = useCategoryPerformance({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: tierData, isLoading: tierLoading } = useCustomerTierDistribution();

    const { data: pointsActivity, isLoading: pointsLoading } = useLoyaltyPointsActivity({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: couponUsage } = useCouponUsageAnalytics({
        start_date: startDate,
        end_date: endDate,
    });

    // New analytics API calls
    const { data: topCustomers, isLoading: topCustomersLoading } = useTopCustomersByRevenue({
        start_date: startDate,
        end_date: endDate,
        limit: 5,
    });

    const { data: averageItemsData, isLoading: averageItemsLoading } = useAverageItemsPerOrder({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: repeatPurchaseData, isLoading: repeatPurchaseLoading } = useRepeatPurchaseRate({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: brandPerformance, isLoading: brandLoading } = useBrandPerformance({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: orderValueDistribution, isLoading: orderValueLoading } = useOrderValueDistribution({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: acquisitionTrends, isLoading: acquisitionLoading } = useCustomerAcquisitionTrends({
        start_date: startDate,
        end_date: endDate,
        group_by: 'monthly',
    });

    const { data: bestSellingByCategory, isLoading: bestSellingLoading } = useBestSellingByCategory({
        start_date: startDate,
        end_date: endDate,
        top_n: 3,
    });

    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Tooltip style configuration for charts - works in both light and dark mode
    const tooltipStyle = useMemo(() => ({
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        border: isDark ? 'none' : '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        color: isDark ? '#ffffff' : '#1f2937',
    }), [isDark]);

    const tooltipLabelStyle = useMemo(() => ({
        color: isDark ? '#9ca3af' : '#6b7280',
    }), [isDark]);

    // Format percentage
    const formatPercent = (value: number) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const formatPriceRange = (range: string) => {
        const map: Record<string, string> = {
            '1m_5m': '1jt - 5jt',
            '500k_1m': '500rb - 1jt',
            '5m_plus': '5jt+',
            under_500k: 'di bawah 500rb',
        };
        return map[range] ?? range.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-6">
            {/* Header with Date Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sales performance and insights</p>
                </div>
                <DateRangeFilter
                    value={dateRange}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(newValue, start, end) => {
                        setDateRange(newValue);
                        if (newValue === 'custom') {
                            setCustomStart(start || '');
                            setCustomEnd(end || '');
                        } else {
                            setCustomStart('');
                            setCustomEnd('');
                        }
                    }}
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="panel border-l-4 border-l-blue-500 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <div className="group relative inline-block">
                            <IconInfoCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-help transition-colors" />
                            <div className="absolute right-0 bottom-full mb-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 w-56">
                                <div className="bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                                    <p>Total revenue from all orders in the selected period, including growth compared to previous period.</p>
                                    <div className="absolute top-full right-3 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            {salesLoading ? (
                                <Skeleton width={120} height={32} />
                            ) : salesError ? (
                                <p className="text-2xl font-bold text-gray-400">N/A</p>
                            ) : (
                                <p className="text-2xl font-bold">{formatToRupiah(salesData?.summary?.total_revenue || 0)}</p>
                            )}
                            {!salesLoading && !salesError && revenueComparison?.growth.revenue !== undefined && (
                                <div className={`flex items-center mt-2 text-sm ${revenueComparison.growth.revenue >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {revenueComparison.growth.revenue >= 0 ? <IconTrendingUp className="w-4 h-4 mr-1" /> : <IconTrendingDown className="w-4 h-4 mr-1" />}
                                    {formatPercent(revenueComparison.growth.revenue)}
                                </div>
                            )}
                        </div>
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center">
                            <IconDollarSignCircle className="w-7 h-7 text-blue-500" duotone={true} />
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="panel border-l-4 border-l-green-500 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <div className="group relative inline-block">
                            <IconInfoCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-help transition-colors" />
                            <div className="absolute right-0 bottom-full mb-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 w-56">
                                <div className="bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                                    <p>Total number of orders placed in the selected period with growth trend.</p>
                                    <div className="absolute top-full right-3 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            {salesLoading ? (
                                <Skeleton width={120} height={32} />
                            ) : salesError ? (
                                <p className="text-2xl font-bold text-gray-400">N/A</p>
                            ) : (
                                <p className="text-2xl font-bold">{salesData?.summary?.total_orders?.toLocaleString() || 0}</p>
                            )}
                            {!salesLoading && !salesError && revenueComparison?.growth.orders !== undefined && (
                                <div className={`flex items-center mt-2 text-sm ${revenueComparison.growth.orders >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {revenueComparison.growth.orders >= 0 ? <IconTrendingUp className="w-4 h-4 mr-1" /> : <IconTrendingDown className="w-4 h-4 mr-1" />}
                                    {formatPercent(revenueComparison.growth.orders)}
                                </div>
                            )}
                        </div>
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center">
                            <IconBox className="w-7 h-7 text-green-500" duotone={true} />
                        </div>
                    </div>
                </div>

                {/* AOV Card */}
                <div className="panel border-l-4 border-l-purple-500 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Avg. Order Value</p>
                        <div className="group relative inline-block">
                            <IconInfoCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-help transition-colors" />
                            <div className="absolute right-0 bottom-full mb-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 w-56">
                                <div className="bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                                    <p>Average revenue per order. Higher AOV indicates customers are spending more per transaction.</p>
                                    <div className="absolute top-full right-3 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            {salesLoading ? (
                                <Skeleton width={120} height={32} />
                            ) : salesError ? (
                                <p className="text-2xl font-bold text-gray-400">N/A</p>
                            ) : (
                                <p className="text-2xl font-bold">{formatToRupiah(salesData?.summary?.average_order_value || 0)}</p>
                            )}
                            {!salesLoading && !salesError && revenueComparison?.growth.aov !== undefined && (
                                <div className={`flex items-center mt-2 text-sm ${revenueComparison.growth.aov >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {revenueComparison.growth.aov >= 0 ? <IconTrendingUp className="w-4 h-4 mr-1" /> : <IconTrendingDown className="w-4 h-4 mr-1" />}
                                    {formatPercent(revenueComparison.growth.aov)}
                                </div>
                            )}
                        </div>
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center">
                            <IconBarChart className="w-7 h-7 text-purple-500" duotone={true} />
                        </div>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="panel border-l-4 border-l-orange-500 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Unique Customers</p>
                        <div className="group relative inline-block">
                            <IconInfoCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-help transition-colors" />
                            <div className="absolute right-0 bottom-full mb-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 w-56">
                                <div className="bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                                    <p>Count of unique customers who made purchases in the selected period.</p>
                                    <div className="absolute top-full right-3 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            {salesLoading ? (
                                <Skeleton width={120} height={32} />
                            ) : salesError ? (
                                <p className="text-2xl font-bold text-gray-400">N/A</p>
                            ) : (
                                <p className="text-2xl font-bold">{salesData?.summary?.unique_customers?.toLocaleString() || 0}</p>
                            )}
                        </div>
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center">
                            <IconUsers className="w-7 h-7 text-orange-500" duotone={true} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1: Sales Trend & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="panel p-6 lg:col-span-2">
                    <AnalyticsTooltip
                        title="Revenue Trend"
                        description="Daily revenue over the selected time period. Shows the total sales generated each day, helping identify patterns, peak sales days, and seasonal trends."
                    />
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData?.time_series || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }}
                                />
                                <YAxis tickFormatter={formatChartAxis} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    labelStyle={tooltipLabelStyle}
                                    labelFormatter={(label) => {
                                        const date = new Date(label);
                                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }}
                                    formatter={(value: any) => formatToRupiah(value)}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="panel p-6">
                    <AnalyticsTooltip
                        title="Order Status"
                        description="Breakdown of orders by completion status. Shows the ratio of completed vs pending orders, giving insight into order fulfillment efficiency."
                    />
                    {statusLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Skeleton height={200} width={200} />
                        </div>
                    ) : statusError || !orderStatusData?.by_status ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <p>No data available</p>
                        </div>
                    ) : (
                        <>
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={
                                                orderStatusData?.by_status?.map((item) => ({
                                                    name: item.status === 'completed' ? 'Completed' : 'Pending',
                                                    value: item.orders_count,
                                                    percentage: item.percentage,
                                                })) || []
                                            }
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }: any) => `${name}: ${percentage.toFixed(1)}%`}
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#f59e0b" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {orderStatusData?.by_status?.map((item) => (
                                    <div key={item.status} className="flex justify-between items-center text-sm">
                                        <span className="capitalize">{item.status}</span>
                                        <span className="font-semibold">{item.orders_count} orders</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Charts Row 2: Top Products & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Top Selling Products" description="Best-performing products by quantity sold in the selected period. Helps identify popular items and inventory trends." />
                    <div className="space-y-4">
                        {topProducts?.map((product, index) => (
                            <div key={product.product_id} className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600">{index + 1}</div>
                                <img src={product.product_image1} alt={product.product_name} className="w-12 h-12 object-cover rounded" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{product.product_name}</p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{product.total_sold} sold</p>
                                    <p className="text-xs text-gray-500">{formatToRupiah(product.total_revenue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Performance */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Category Performance" description="Revenue breakdown by product category. Identifies which categories are driving sales and which may need attention." />
                    <ChartLoader loading={categoryLoading} height={256}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryPerformance || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                                    <YAxis tickFormatter={formatChartAxis} />
                                    <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value: any) => formatToRupiah(value)} />
                                    <Bar dataKey="revenue" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartLoader>
                </div>
            </div>

            {/* Charts Row 3: Customer Tier & Loyalty Points */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Tier Distribution */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Customer Tiers" description="Distribution of customers across loyalty tiers. Shows how many customers are in each tier (Bronze, Silver, Gold, etc.)." />
                    <ChartLoader loading={tierLoading} height={200}>
                        <div className="space-y-4">
                            {tierData?.tiers?.map((tier) => (
                                <div key={tier.tier_id}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{tier.tier_name}</span>
                                        <span className="text-sm text-gray-500">{tier.customer_count} customers</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${tier.percentage}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{tier.percentage.toFixed(1)}% of customers</p>
                                </div>
                            ))}
                        </div>
                    </ChartLoader>
                </div>

                {/* Loyalty Points Activity */}
                <div className="panel p-6">
                    <AnalyticsTooltip
                        title="Loyalty Points"
                        description="Track points earned by customers vs points redeemed. Shows the effectiveness of your loyalty program and customer engagement."
                    />
                    <ChartLoader loading={pointsLoading} height={200}>
                        <div className="space-y-4">
                            {pointsActivity?.map((activity) => (
                                <div key={activity.transaction_type} className="flex items-center justify-between">
                                    <span className="capitalize">{activity.transaction_type}</span>
                                    <div className="text-right">
                                        {activity.transaction_type === 'EARN' ? (
                                            <span className="text-success font-semibold">+{activity.positive_points?.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-danger font-semibold">-{activity.negative_points?.toLocaleString()}</span>
                                        )}
                                        <p className="text-xs text-gray-500">{activity.transaction_count} transactions</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500">
                                Redemption Rate:{' '}
                                <span className="font-semibold">
                                    {pointsActivity && pointsActivity.length > 1 ? (
                                        <>
                                            {pointsActivity[1]?.negative_points && pointsActivity[0]?.positive_points ? (
                                                <span className="text-orange-500">{((pointsActivity[1].negative_points / pointsActivity[0].positive_points) * 100).toFixed(1)}%</span>
                                            ) : (
                                                '0%'
                                            )}
                                        </>
                                    ) : (
                                        'N/A'
                                    )}
                                </span>
                            </div>
                        </div>
                    </ChartLoader>
                </div>

                {/* Coupon Usage */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Top Coupons" description="Most frequently used coupon codes and their impact on revenue. Helps evaluate promotional campaign effectiveness." />
                    <div className="space-y-3">
                        {couponUsage?.slice(0, 5).map((coupon) => (
                            <div key={coupon.coupon_code} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">{coupon.coupon_code}</span>
                                    <span className="badge bg-info/10 text-info">{coupon.usage_count}x</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{coupon.coupon_percentage}% off</span>
                                    <span>{formatToRupiah(coupon.total_revenue_with_coupon)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ==================== NEW ANALYTICS WIDGETS ==================== */}

            {/* Row: Top Customers & Repeat Purchase Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Customers */}
                <div className="panel p-6">
                    <AnalyticsTooltip
                        title="Top Customers by Revenue"
                        description="Your highest-spending customers ranked by total revenue. Helps identify VIP customers for targeted retention strategies."
                    />
                    <ChartLoader loading={topCustomersLoading} height={300}>
                        <div className="space-y-3">
                            {topCustomers?.slice(0, 5).map((customer: any, index: number) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{customer.order_fullname || customer.order_email}</p>
                                        <p className="text-xs text-gray-500">{customer.orders_count} orders</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary">{formatToRupiah(customer.total_revenue)}</p>
                                        <p className="text-xs text-gray-500">Avg: {formatToRupiah(customer.average_order_value)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartLoader>
                </div>

                {/* Repeat Purchase Rate */}
                <div className="panel p-6">
                    <AnalyticsTooltip
                        title="Customer Retention"
                        description="Ratio of new vs returning customers. Higher returning customer percentage indicates strong customer loyalty and satisfaction."
                    />
                    <ChartLoader loading={repeatPurchaseLoading} height={250}>
                        {repeatPurchaseData ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">New Customers</span>
                                    <span className="font-bold text-blue-500">
                                        {repeatPurchaseData.new_customers} ({repeatPurchaseData.new_customer_percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${repeatPurchaseData.new_customer_percentage}%` }} />
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Returning Customers</span>
                                    <span className="font-bold text-green-500">
                                        {repeatPurchaseData.returning_customers} ({repeatPurchaseData.returning_customer_percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${repeatPurchaseData.returning_customer_percentage}%` }} />
                                </div>
                                <p className="text-sm text-center mt-2">Total: {repeatPurchaseData.total_customers} customers</p>
                            </div>
                        ) : null}
                    </ChartLoader>
                </div>
            </div>

            {/* Row: Average Items per Order & Order Value Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Items per Order */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Average Items per Order" description="Average number of items customers purchase per order. Tracks shopping basket size trends over time." />
                    <ChartLoader loading={averageItemsLoading} height={300}>
                        {averageItemsData ? (
                            <div>
                                <p className="text-4xl font-bold text-center mb-4">
                                    {averageItemsData.overall_average.toFixed(1)} <span className="text-lg text-gray-500">items</span>
                                </p>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={averageItemsData.time_series}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                            <YAxis />
                                            <Tooltip
                                                contentStyle={tooltipStyle}
                                                labelStyle={tooltipLabelStyle}
                                                labelFormatter={(label) => {
                                                    const date = new Date(label);
                                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                }}
                                                formatter={(value: any, name: any) => {
                                                    if (name === 'average_items_per_order') {
                                                        return Number(value).toFixed(1) + ' items';
                                                    }
                                                    return value;
                                                }}
                                            />
                                            <Line type="monotone" dataKey="average_items_per_order" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : null}
                    </ChartLoader>
                </div>

                {/* Order Value Distribution */}
                <div className="panel p-6">
                    <AnalyticsTooltip
                        title="Order Value Distribution"
                        description="Breakdown of orders by value ranges (under 500k, 500k-1M, 1M-5M, 5M+). Helps understand customer spending patterns."
                    />
                    <ChartLoader loading={orderValueLoading} height={300}>
                        {orderValueDistribution ? (
                            <div>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={orderValueDistribution.distribution}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="price_range"
                                                tickFormatter={(val) => {
                                                    const labels = { under_500k: '< 500 Rb', '500k_1m': '500 Rb - 1 JT', '1m_5m': '1 - 5 JT', '5m_plus': '> 5 JT' };
                                                    return labels[val as keyof typeof labels] || val;
                                                }}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => {
                                                    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} M`;
                                                    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} JT`;
                                                    return `${(value / 1000).toFixed(0)} Rb`;
                                                }}
                                            />
                                            <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value: any) => formatToRupiah(value)} />
                                            <Bar dataKey="revenue" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                    {orderValueDistribution.distribution.map((item: any) => (
                                        <div key={item.price_range} className="flex justify-between">
                                            <span className="capitalize text-gray-500">{formatPriceRange(item.price_range)}</span>
                                            <span className="font-semibold">{item.orders_count} orders</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </ChartLoader>
                </div>
            </div>

            {/* Row: Brand Performance & Customer Acquisition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brand Performance */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Brand Performance" description="Revenue comparison across different brands. Identifies top-performing brands and those that may need marketing support." />
                    <ChartLoader loading={brandLoading} height={256}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={brandPerformance} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={formatChartAxis} />
                                    <YAxis dataKey="brand_name" type="category" width={100} />
                                    <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value: any) => formatToRupiah(value)} />
                                    <Bar dataKey="revenue" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartLoader>
                </div>

                {/* Customer Acquisition Trends */}
                <div className="panel p-6">
                    <AnalyticsTooltip title="Customer Acquisition" description="Number of new customers joining over time. Shows the effectiveness of marketing campaigns and business growth." />
                    <ChartLoader loading={acquisitionLoading} height={256}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={acquisitionTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })} />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={tooltipLabelStyle}
                                        labelFormatter={(label) => {
                                            const date = new Date(label);
                                            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                                        }}
                                        formatter={(value: any, name: any) => {
                                            if (name === 'new_customers') {
                                                return Number(value).toLocaleString() + ' customers';
                                            }
                                            return value;
                                        }}
                                    />
                                    <Line type="monotone" dataKey="new_customers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartLoader>
                </div>
            </div>

            {/* Best Selling by Category */}
            {bestSellingByCategory && bestSellingByCategory.length > 0 && (
                <div className="panel p-6">
                    <AnalyticsTooltip
                        title="Best Selling Products by Category"
                        description="Top performing products within each product category. Helps identify category-specific bestsellers for targeted promotions."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestSellingByCategory.map((category: any) => (
                            <div key={category.category} className="border rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-primary">{category.category}</h4>
                                <div className="space-y-2">
                                    {category.products.map((product: any) => (
                                        <div key={product.product_id} className="flex items-center gap-2 text-sm">
                                            <img src={product.product_image1} alt={product.product_name} className="w-10 h-10 object-cover rounded" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{product.product_name}</p>
                                                <p className="text-xs text-gray-500">{product.total_sold} sold</p>
                                            </div>
                                            <p className="font-semibold text-xs">{formatToRupiah(product.total_revenue)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
