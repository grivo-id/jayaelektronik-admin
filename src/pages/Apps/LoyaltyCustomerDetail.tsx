import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetCustomerDetail, useGetCustomerPointHistory, useGetAllTiers, useAdjustCustomerPoints } from '../../services/loyaltyService';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import formatToRupiah from '../../utils/formatToRupiah';
import formatDate from '../../utils/formatDate';
import IconArrowLeft from '../../components/Icon/IconArrowLeft';
import IconAward from '../../components/Icon/IconAward';
import IconCoins from '../../components/Icon/IconCoins';
import IconHistory from '../../components/Icon/IconHistory';
import IconPlus from '../../components/Icon/IconPlus';
import IconMinus from '../../components/Icon/IconMinus';
import IconShoppingBag from '../../components/Icon/IconShoppingBag';
import IconX from '../../components/Icon/IconX';
import { Pagination } from '../../components';
import { useQuery } from '@tanstack/react-query';
import { ApiGetOrdersByEmail } from '../../api/orderApi';

const LoyaltyCustomerDetail = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { userId } = useParams<{ userId: string }>();
    const [historyPage, setHistoryPage] = useState(1);
    const [orderPage, setOrderPage] = useState(1);

    // Modal state
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
    const [adjustAmount, setAdjustAmount] = useState('');
    const [adjustReason, setAdjustReason] = useState('');
    const [amountError, setAmountError] = useState('');
    const [reasonError, setReasonError] = useState('');

    const { data: customer, isLoading: customerLoading } = useGetCustomerDetail(userId || '');
    const { data: tiersData } = useGetAllTiers();
    const { data: { data: historyData, pagination: pointPagination } = { data: [], pagination: {} }, isFetching: historyLoading } = useGetCustomerPointHistory(userId || '', {
        page: historyPage,
        limit: 10,
    });

    // Fetch customer's order history
    const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
        queryKey: ['customer-orders', userId, orderPage],
        queryFn: () => ApiGetOrdersByEmail({ email: customer?.profile?.user_email || '', page: orderPage, limit: 10 }),
        enabled: !!customer?.profile?.user_email,
    });
    const ordersData = ordersResponse?.data || [];
    const orderPagination = ordersResponse?.pagination;

    const { mutate: adjustPoints, isPending: isAdjusting } = useAdjustCustomerPoints();

    useEffect(() => {
        dispatch(setPageTitle('Customer Loyalty Detail'));
    }, [dispatch]);

    const openAdjustModal = (type: 'add' | 'deduct') => {
        setAdjustType(type);
        setAdjustAmount('');
        setAdjustReason('');
        setAmountError('');
        setReasonError('');
        setShowAdjustModal(true);
    };

    const closeAdjustModal = () => {
        setShowAdjustModal(false);
        setAdjustAmount('');
        setAdjustReason('');
        setAmountError('');
        setReasonError('');
    };

    const handleSubmitAdjust = () => {
        if (!adjustAmount || parseInt(adjustAmount) <= 0) {
            setAmountError('Please enter a valid amount');
            return;
        }
        if (!adjustReason.trim()) {
            setReasonError('Please enter a reason');
            return;
        }

        const pointsAmount = adjustType === 'add' ? parseInt(adjustAmount) : -parseInt(adjustAmount);

        adjustPoints(
            {
                customer_loyalty_id: customer?.profile?.customer_loyalty_id || '',
                points_amount: pointsAmount,
                reason: adjustReason,
            },
            {
                onSuccess: () => {
                    closeAdjustModal();
                },
                onError: (error: any) => {
                    console.error('Error adjusting points:', error);
                },
            },
        );
    };

    const getTransactionTypeBadge = (type: string) => {
        const types: Record<string, { class: string; label: string }> = {
            EARN: { class: 'bg-success/10 text-success', label: 'Earned' },
            REDEEM: { class: 'bg-warning/10 text-warning', label: 'Redeemed' },
            ADJUST: { class: 'bg-info/10 text-info', label: 'Adjusted' },
            EXPIRE: { class: 'bg-danger/10 text-danger', label: 'Expired' },
            BONUS: { class: 'bg-purple-500/10 text-purple-500', label: 'Bonus' },
            BIRTHDAY_BONUS: { class: 'bg-purple-500/10 text-purple-500', label: 'Birthday Bonus' },
        };
        return types[type] || { class: 'bg-gray-500/10 text-gray-500', label: type };
    };

    const getTierColor = (tierName: string | undefined) => {
        if (!tierName) return 'text-primary border-primary';
        const name = tierName.toLowerCase();
        if (name.includes('blue')) return 'text-blue-500 border-blue-500';
        if (name.includes('silver')) return 'text-gray-400 border-gray-400';
        if (name.includes('gold')) return 'text-yellow-500 border-yellow-500';
        if (name.includes('platinum')) return 'text-purple-500 border-purple-500';
        return 'text-primary border-primary';
    };

    if (customerLoading) {
        return <div className="panel p-4">Loading...</div>;
    }

    if (!customer) {
        return (
            <div className="panel p-4">
                <p className="text-gray-500">Customer not found</p>
            </div>
        );
    }

    const currentTier = tiersData?.find((t) => t.tier_id === customer.tier_id);
    const nextTier = tiersData?.find((t) => t.tier_order === (currentTier?.tier_order || 0) + 1);
    const progressToNextTier =
        nextTier && currentTier?.min_lifetime_spending
            ? (((customer.lifetime_spending || 0) - currentTier.min_lifetime_spending!) / (nextTier.min_lifetime_spending - currentTier.min_lifetime_spending!)) * 100
            : 100;

    // Safe number formatting helper
    const formatNumber = (num: number | undefined | null) => {
        return (num || 0).toLocaleString('id-ID');
    };

    return (
        <div>
            {/* Back Button */}
            <Link to="/admin/loyalty/customers" className="btn btn-outline-primary mb-4 inline-flex items-center gap-2">
                <IconArrowLeft className="w-4 h-4" />
                <span>Back to Customers</span>
            </Link>

            {/* Customer Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="panel">
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="font-medium">
                                {customer.profile.user_fname || ''} {customer.profile.user_lname || ''}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="font-medium">{customer.profile.user_email || '-'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Phone</div>
                            <div className="font-medium">{customer.profile.user_phone || '-'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Member Since</div>
                            <div className="font-medium">{formatDate(customer.profile.created_at)}</div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <IconAward className="w-5 h-5" />
                        Tier Status
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-full border-4 ${getTierColor(customer.profile.tier_name)} flex items-center justify-center`}>
                            <IconAward className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{customer.profile.tier_name || 'No Tier'}</div>
                            <div className="text-sm text-gray-500">Current Tier</div>
                        </div>
                    </div>
                    {nextTier && currentTier?.min_lifetime_spending !== undefined && (
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Progress to {nextTier.tier_name}</span>
                                <span>{Math.min(progressToNextTier, 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(progressToNextTier, 100)}%` }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {formatToRupiah(nextTier.min_lifetime_spending - (customer.lifetime_spending || 0))} more to reach {nextTier.tier_name}
                            </div>
                        </div>
                    )}
                </div>

                <div className="panel">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <IconCoins className="w-5 h-5" />
                        Points Summary
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Available Points</span>
                            <span className="text-2xl font-bold text-info">{formatNumber(customer.profile.total_points_available)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Total Earned</span>
                            <span className="font-semibold">{formatNumber(customer.profile.total_points)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Total Used</span>
                            <span className="font-semibold">{formatNumber(customer.profile.total_points_used)}</span>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Lifetime Spending</span>
                            <span className="font-semibold">{formatToRupiah(customer.profile.lifetime_spending || 0)}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="button" className="btn btn-success flex-1 flex items-center justify-center gap-2" onClick={() => openAdjustModal('add')}>
                            <IconPlus className="w-4 h-4" />
                            <span>Add Points</span>
                        </button>
                        <button type="button" className="btn btn-warning flex-1 flex items-center justify-center gap-2" onClick={() => openAdjustModal('deduct')}>
                            <IconMinus className="w-4 h-4" />
                            <span>Deduct</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Point Transaction History */}
            <div className="panel mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <IconHistory className="w-5 h-5" />
                    Point Transaction History
                </h3>
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Points</th>
                                <th>Balance After</th>
                                <th>Multiplier</th>
                            </tr>
                        </thead>
                        {historyLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            </tbody>
                        ) : !historyData || historyData.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        <p className="text-gray-500">No transactions found</p>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {historyData.map((transaction) => {
                                    const typeInfo = getTransactionTypeBadge(transaction.transaction_type);
                                    return (
                                        <tr key={transaction.point_transaction_id}>
                                            <td>{formatDate(transaction.created_at)}</td>
                                            <td>
                                                <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>
                                            </td>
                                            <td>
                                                <div>{transaction.transaction_reason}</div>
                                                {transaction.order_id && <div className="text-xs text-gray-500">Order: {transaction.order_id}</div>}
                                            </td>
                                            <td className={transaction.points_amount > 0 ? 'text-success' : 'text-danger'}>
                                                {transaction.points_amount > 0 ? '+' : ''}
                                                {formatNumber(transaction.points_amount)}
                                            </td>
                                            <td>{formatNumber(transaction.points_balance_after)}</td>
                                            <td>
                                                {transaction.multiplier_applied && transaction.multiplier_applied !== 1 ? (
                                                    <span className="badge bg-info/10 text-info">{transaction.multiplier_applied}x</span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                    </table>
                </div>

                {/* History Pagination */}
                {pointPagination && pointPagination.totalPages > 1 && (
                    <Pagination activePage={historyPage} itemsCountPerPage={10} totalItemsCount={pointPagination.totalData || 0} pageRangeDisplayed={5} onChange={setHistoryPage} />
                )}
            </div>

            {/* Order History */}
            <div className="panel">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <IconShoppingBag className="w-5 h-5" />
                    Order History
                </h3>
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Grand Total</th>
                                <th>Status</th>
                                <th>Points Earned</th>
                            </tr>
                        </thead>
                        {ordersLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            </tbody>
                        ) : !ordersData || ordersData.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        <p className="text-gray-500">No orders found</p>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {ordersData.map((order: any) => (
                                    <tr key={order.order_id}>
                                        <td>
                                            <Link to={`/admin/list-order-customer/${order.order_id}`} className="text-primary hover:underline">
                                                {order.order_id}
                                            </Link>
                                        </td>
                                        <td>{formatDate(order.order_created_date)}</td>
                                        <td>{formatToRupiah(order.order_grand_total)}</td>
                                        <td>
                                            {order.order_is_completed ? (
                                                <span className="badge bg-success/10 text-success">Completed</span>
                                            ) : (
                                                <span className="badge bg-warning/10 text-warning">Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            {order.points_earned ? (
                                                <span className="text-success font-semibold">+{formatNumber(order.points_earned)}</span>
                                            ) : (
                                                <span className="text-gray-400">-{formatNumber(order.points_earned)}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>

                {/* Order History Pagination */}
                {orderPagination && orderPagination.totalPages > 1 && (
                    <Pagination activePage={orderPage} itemsCountPerPage={10} totalItemsCount={orderPagination.totalData || 0} pageRangeDisplayed={5} onChange={setOrderPage} />
                )}
            </div>

            {/* Adjust Points Modal */}
            {showAdjustModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={closeAdjustModal}></div>
                    <div className="panel relative w-full max-w-md p-6 animate-fade-in">
                        {/* Close button */}
                        <button onClick={closeAdjustModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <IconX className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-semibold mb-4">{adjustType === 'add' ? 'Add' : 'Deduct'} Points</h3>

                        <div className="space-y-4">
                            {/* Customer Info */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Customer</div>
                                <div className="font-medium">{customer?.profile?.user_email || ''}</div>
                                <div className="mt-2 flex justify-between">
                                    <span className="text-sm text-gray-500">Current Balance:</span>
                                    <span className="font-bold text-info">{formatNumber(customer?.profile.total_points_available || 0)} pts</span>
                                </div>
                            </div>

                            {/* Points Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={adjustAmount}
                                    onChange={(e) => {
                                        setAdjustAmount(e.target.value);
                                        setAmountError('');
                                    }}
                                    className="form-input"
                                    placeholder="Enter amount"
                                />
                                {amountError && <p className="text-danger text-sm mt-1">{amountError}</p>}
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason *</label>
                                <textarea
                                    value={adjustReason}
                                    onChange={(e) => {
                                        setAdjustReason(e.target.value);
                                        setReasonError('');
                                    }}
                                    className="form-textarea"
                                    rows={3}
                                    placeholder="Enter reason for adjustment"
                                ></textarea>
                                {reasonError && <p className="text-danger text-sm mt-1">{reasonError}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSubmitAdjust}
                                    disabled={isAdjusting}
                                    className={`flex-1 ${adjustType === 'add' ? 'btn-success' : 'btn-warning'} ${isAdjusting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isAdjusting ? 'Processing...' : adjustType === 'add' ? 'Add Points' : 'Deduct Points'}
                                </button>
                                <button type="button" onClick={closeAdjustModal} className="btn btn-outline-secondary flex-1" disabled={isAdjusting}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyCustomerDetail;
