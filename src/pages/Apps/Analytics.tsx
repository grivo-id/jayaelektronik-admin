import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconBox from '../../components/Icon/IconBox';
import IconBarChart from '../../components/Icon/IconBarChart';
import IconUsers from '../../components/Icon/IconUsers';
import DateRangeFilter from '../../components/DateRangeFilter';
import Skeleton from 'react-loading-skeleton';

const Analytics = () => {
    const dispatch = useDispatch();
    const [dateRange, setDateRange] = useState<any>('30d');
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');

    // Calculate date range based on selection
    const { startDate, endDate } = useMemo(() => {
        const now = new Date();
        let start: Date;
        let end: Date = new Date(now.setHours(23, 59, 59, 999));

        switch (dateRange) {
            case '30d':
                start = new Date(now);
                start.setDate(now.getDate() - 30);
                break;
            case '90d':
                start = new Date(now);
                start.setDate(now.getDate() - 90);
                break;
            case '1y':
                start = new Date(now);
                start.setFullYear(now.getFullYear() - 1);
                break;
            case 'custom':
                start = customStart ? new Date(customStart) : new Date();
                start.setHours(0, 0, 0, 0);
                end = customEnd ? new Date(customEnd) : end;
                break;
            default:
                start = new Date();
                start.setDate(now.getDate() - 30);
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
        };
    }, [dateRange, customStart, customEnd]);

    useEffect(() => {
        dispatch(setPageTitle('Analytics Dashboard'));
    }, [dispatch]);

    // API calls
    const { data: salesData, isLoading: salesLoading } = useSalesAnalytics({
        start_date: startDate,
        end_date: endDate,
        group_by: 'daily',
    });

    const { data: orderStatusData, isLoading: statusLoading } = useOrderStatusBreakdown({
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

    const { data: categoryPerformance } = useCategoryPerformance({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: tierData } = useCustomerTierDistribution();

    const { data: pointsActivity } = useLoyaltyPointsActivity({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: couponUsage } = useCouponUsageAnalytics({
        start_date: startDate,
        end_date: endDate,
    });

    // New analytics API calls
    const { data: topCustomers } = useTopCustomersByRevenue({
        start_date: startDate,
        end_date: endDate,
        limit: 5,
    });

    const { data: averageItemsData } = useAverageItemsPerOrder({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: repeatPurchaseData } = useRepeatPurchaseRate({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: brandPerformance } = useBrandPerformance({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: orderValueDistribution } = useOrderValueDistribution({
        start_date: startDate,
        end_date: endDate,
    });

    const { data: acquisitionTrends } = useCustomerAcquisitionTrends({
        start_date: startDate,
        end_date: endDate,
        group_by: 'monthly',
    });

    const { data: bestSellingByCategory } = useBestSellingByCategory({
        start_date: startDate,
        end_date: endDate,
        top_n: 3,
    });

    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Format percentage
    const formatPercent = (value: number) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    // Render loading state
    if (salesLoading || statusLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="panel p-6">
                            <Skeleton height={80} />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="panel p-6">
                        <Skeleton height={300} />
                    </div>
                    <div className="panel p-6">
                        <Skeleton height={300} />
                    </div>
                </div>
            </div>
        );
    }

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
                        if (start) setCustomStart(start);
                        if (end) setCustomEnd(end);
                    }}
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="panel border-l-4 border-l-blue-500 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold">{formatToRupiah(salesData?.summary?.total_revenue || 0)}</p>
                            {revenueComparison?.growth.revenue !== undefined && (
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
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                            <p className="text-2xl font-bold">{salesData?.summary?.total_orders?.toLocaleString() || 0}</p>
                            {revenueComparison?.growth.orders !== undefined && (
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
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Avg. Order Value</p>
                            <p className="text-2xl font-bold">{formatToRupiah(salesData?.summary?.average_order_value || 0)}</p>
                            {revenueComparison?.growth.aov !== undefined && (
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
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Unique Customers</p>
                            <p className="text-2xl font-bold">{salesData?.summary?.unique_customers?.toLocaleString() || 0}</p>
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
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
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
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    labelFormatter={(label) => formatToRupiah(label)}
                                    formatter={(value: any) => formatToRupiah(value)}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Status</h3>
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
                </div>
            </div>

            {/* Charts Row 2: Top Products & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
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
                    <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryPerformance || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                                <YAxis tickFormatter={formatChartAxis} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value: any) => formatToRupiah(value)} />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 3: Customer Tier & Loyalty Points */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Tier Distribution */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Customer Tiers</h3>
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
                </div>

                {/* Loyalty Points Activity */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Loyalty Points</h3>
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
                </div>

                {/* Coupon Usage */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Coupons</h3>
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

            {/* Low Stock Alert */}
            {/* {lowStockProducts && lowStockProducts.length > 0 && (
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.978 11.11A9.009 9.009 0 0 0 12 14a9 9 0 0 009 9 9 0 0 009-9 9 0 0 00-9-9 9 0 0 00-9 9m0-9"
                            />
                        </svg>
                        Low Stock Alert
                    </h3>
                    <div className="space-y-3">
                        {lowStockProducts.slice(0, 5).map((product) => (
                            <div key={product.product_id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <img src={product.product_image1} alt={product.product_name} className="w-12 h-12 object-cover rounded" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{product.product_name}</p>
                                    <p className="text-xs text-gray-500">Sold {product.sold_last_30_days} in last 30 days</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${product.status === 'critical' ? 'text-danger' : product.status === 'low' ? 'text-orange-500' : 'text-warning'}`}>
                                        Stock: {product.product_stock}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* ==================== NEW ANALYTICS WIDGETS ==================== */}

            {/* Row: Top Customers & Repeat Purchase Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Customers */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Customers by Revenue</h3>
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
                </div>

                {/* Repeat Purchase Rate */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Customer Retention</h3>
                    {repeatPurchaseData && (
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
                    )}
                </div>
            </div>

            {/* Row: Average Items per Order & Order Value Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Items per Order */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Average Items per Order</h3>
                    {averageItemsData && (
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
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                        <Line type="monotone" dataKey="average_items_per_order" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Value Distribution */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Value Distribution</h3>
                    {orderValueDistribution && (
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
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value: any) => formatToRupiah(value)} />
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
                    )}
                </div>
            </div>

            {/* Row: Brand Performance & Customer Acquisition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brand Performance */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Brand Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={brandPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={formatChartAxis} />
                                <YAxis dataKey="brand_name" type="category" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value: any) => formatToRupiah(value)} />
                                <Bar dataKey="revenue" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Acquisition Trends */}
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={acquisitionTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })} />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="new_customers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Best Selling by Category */}
            {bestSellingByCategory && bestSellingByCategory.length > 0 && (
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold mb-4">Best Selling Products by Category</h3>
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
