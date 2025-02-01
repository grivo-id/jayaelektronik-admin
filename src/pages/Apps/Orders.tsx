import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetAllOrderQuery, useToggleComplete } from '../../services/orderService';
import { MainHeader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import formatDate from '../../utils/formatDate';
import { ApiGetAllOrder } from '../../api/orderApi';
import { Link } from 'react-router-dom';
import formatToRupiah from '../../utils/formatToRupiah';

const Orders = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const [queryParams, setQueryParams] = useState({
        limit: 10,
        page: Number(searchParams.get('page')) || 1,
        search: searchParams.get('search') || '',
        sort: 'desc',
    });

    const { data: { data: ordersData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllOrderQuery(queryParams);
    const { mutate: toggleComplete } = useToggleComplete();

    useEffect(() => {
        dispatch(setPageTitle('Orders'));
    }, []);

    const handleToggleComplete = (orderId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'mark as incomplete' : 'mark as complete';
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: `This order will be ${action}d`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Processing...',
                    text: 'Please wait while we update the order status.',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    },
                });
                toggleComplete(orderId, {
                    onSuccess: () => {
                        Swal.fire('Success', `Order has been ${action}d`, 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Failed to update order status', 'error');
                    },
                });
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({
            ...Object.fromEntries(searchParams),
            page: newPage.toString(),
        });
        setQueryParams({ ...queryParams, page: newPage });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        setSearchParams({
            ...Object.fromEntries(searchParams),
            search: searchValue,
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setQueryParams({ ...queryParams, search, page: 1 });
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const nextPage = (pagination?.currentPage ?? 1) + 1;

        if (!isPlaceholderData && pagination?.hasNextPage) {
            const nextPageParams = {
                ...queryParams,
                page: nextPage,
            };

            queryClient.prefetchQuery({
                queryKey: ['orders', nextPageParams],
                queryFn: () => ApiGetAllOrder(nextPageParams),
            });
        }
    }, [queryParams, ordersData, isPlaceholderData, queryClient]);

    return (
        <div>
            <MainHeader title="Orders" subtitle="Manage and view all orders" onSearchChange={handleSearchChange} search={search} hideAddButton />
            <>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th className="min-w-[120px]">Order Date</th>
                                    <th>Products</th>
                                    <th>Address </th>
                                    <th className="min-w-[150px]">Total</th>
                                    <th className="min-w-[100px]">Status</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={8} noAction />
                            ) : ordersData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No orders found</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {ordersData.map((order) => {
                                        return (
                                            <tr key={order.order_id}>
                                                <td>
                                                    <Link to={`/admin/list-order-customer/${order.order_id}`} className="text-primary hover:underline font-semibold">
                                                        {order.order_id}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <div className="font-semibold">{order.order_user_name}</div>
                                                    <div className="text-gray-500">{order.order_email}</div>
                                                    <div>{order.order_phone}</div>
                                                </td>
                                                <td>{formatDate(order.order_created_date)}</td>

                                                <td>
                                                    <div className="space-y-1">
                                                        {order.products.map((product) => (
                                                            <div key={product.product_id} className="flex items-center gap-2">
                                                                <span className="font-semibold">{product.product_qty}x</span>
                                                                <span className="truncate max-w-xs">{product.product_name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-gray-500 truncate max-w-xs">{order.order_address}</div>
                                                </td>
                                                <td>
                                                    <div className="font-semibold">{formatToRupiah(order.order_grand_total)}</div>
                                                </td>
                                                <td>
                                                    <Tooltip text={order.order_is_completed ? 'Mark as Pending' : 'Mark as Complete'} position="top">
                                                        <label className="w-28 h-8 relative">
                                                            <input
                                                                type="checkbox"
                                                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                id={`complete_switch_${order.order_id}`}
                                                                checked={order.order_is_completed}
                                                                onChange={() => handleToggleComplete(order.order_id, order.order_is_completed)}
                                                            />
                                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-6 before:h-6 before:rounded-full peer-checked:before:left-[5.3rem] peer-checked:bg-primary before:transition-all before:duration-300">
                                                                <span className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold pointer-events-none">
                                                                    <span
                                                                        className={`transition-all duration-300 ${
                                                                            order.order_is_completed ? '' : 'invisible'
                                                                        } relative -right-2.4 text-gray-700 dark:text-white`}
                                                                    >
                                                                        Completed
                                                                    </span>
                                                                    <span
                                                                        className={`transition-all duration-300 ${
                                                                            order.order_is_completed ? 'invisible' : ''
                                                                        } relative -left-9 text-gray-700 dark:text-white`}
                                                                    >
                                                                        Pending
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </label>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
                <Pagination
                    activePage={Number(searchParams.get('page')) || 1}
                    itemsCountPerPage={queryParams.limit}
                    totalItemsCount={pagination?.totalData || 0}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
            </>
        </div>
    );
};

export default Orders;
