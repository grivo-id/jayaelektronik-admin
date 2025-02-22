import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDownloadOrder, useGetAllOrderQuery, useToggleComplete } from '../../services/orderService';
import { MainHeader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import formatDate from '../../utils/formatDate';
import { ApiGetAllOrder } from '../../api/orderApi';
import { Link } from 'react-router-dom';
import formatToRupiah from '../../utils/formatToRupiah';
import FilterSheet from '../../components/FilterSheet';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import IconDownload from '../../components/Icon/IconDownload';

const Orders = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(() => {
        const urlStartDate = searchParams.get('startDate');
        return urlStartDate ? new Date(urlStartDate) : null;
    });
    const [endDate, setEndDate] = useState<Date | null>(() => {
        const urlEndDate = searchParams.get('endDate');
        return urlEndDate ? new Date(urlEndDate) : null;
    });
    const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string } | null>(() => {
        const urlStatus = searchParams.get('order_is_completed');
        if (urlStatus) {
            return {
                value: urlStatus,
                label: urlStatus === 'true' ? 'Completed' : 'Pending',
            };
        }
        return null;
    });

    const statusOptions = [
        { value: 'true', label: 'Completed' },
        { value: 'false', label: 'Pending' },
    ];

    const [queryParams, setQueryParams] = useState({
        limit: 10,
        page: Number(searchParams.get('page')) || 1,
        search: searchParams.get('search') || '',
        sort: 'desc',
    });

    const [filterParams, setFilterParams] = useState<{
        startDate: string;
        endDate: string;
        order_is_completed?: string;
    }>({
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        order_is_completed: searchParams.get('order_is_completed') || undefined,
    });

    const { data: { data: ordersData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllOrderQuery(queryParams, filterParams);

    const { mutate: toggleComplete } = useToggleComplete();
    const { mutate: downloadOrder, isPending } = useDownloadOrder();

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

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value);
        setQueryParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
        setSearchParams((prev) => {
            prev.set('limit', String(newLimit));
            prev.set('page', '1');
            return prev;
        });
    };

    const handleStatusChange = (selected: { value: string; label: string } | null) => {
        setSelectedStatus(selected);
    };

    const handleApplyFilter = () => {
        const formatDateParam = (date: Date | null) => {
            if (!date) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const newFilterParams = {
            startDate: formatDateParam(startDate),
            endDate: formatDateParam(endDate),
            order_is_completed: selectedStatus?.value || undefined,
        };
        setFilterParams(newFilterParams);

        const searchParamsObj: Record<string, string> = {
            ...Object.fromEntries(searchParams),
            page: '1',
            startDate: newFilterParams.startDate,
            endDate: newFilterParams.endDate,
        };

        if (selectedStatus) {
            searchParamsObj.order_is_completed = selectedStatus.value;
        } else {
            delete searchParamsObj.order_is_completed;
        }

        setSearchParams(searchParamsObj);
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectedStatus(null);
        setFilterParams({
            startDate: '',
            endDate: '',
            order_is_completed: undefined,
        });
        const searchParamsObj = Object.fromEntries(searchParams);
        delete searchParamsObj.startDate;
        delete searchParamsObj.endDate;
        delete searchParamsObj.order_is_completed;
        setSearchParams(searchParamsObj);
    };

    const handleDownloadOrders = () => {
        const params = queryParams;
        const body = {
            startDate: filterParams.startDate,
            endDate: filterParams.endDate,
            order_is_completed: filterParams.order_is_completed,
        };

        Swal.fire({
            title: 'Downloading...',
            text: 'Please wait while we prepare your file.',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            },
        });

        downloadOrder(
            { params, body },
            {
                onSuccess: ({ data, filename }) => {
                    console.log('filename dari API:', filename);
                    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    Swal.close();
                },
                onError: () => {
                    Swal.fire('Error', 'Failed to download orders', 'error');
                },
            }
        );
    };

    return (
        <div>
            <MainHeader
                title="Orders"
                subtitle="Manage and view all orders"
                onSearchChange={handleSearchChange}
                search={search}
                onFilterClick={() => setIsFilterOpen(true)}
                addText="Download"
                onAdd={handleDownloadOrders}
                icon={<IconDownload className="ltr:mr-2 rtl:ml-2" />}
            />

            <FilterSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                tertiaryFilterOptions={statusOptions}
                tertiaryFilterPlaceholder="Filter by status"
                selectedTertiaryFilter={selectedStatus}
                onTertiaryFilterChange={handleStatusChange}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Start Date</label>
                        <Flatpickr
                            className="form-input"
                            value={startDate}
                            onChange={(date) => setStartDate(date[0])}
                            options={{
                                dateFormat: 'd/m/Y',
                                altInput: true,
                                altFormat: 'd/m/Y',
                                altInputClass: 'form-input',
                            }}
                            placeholder="Select start date"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">End Date</label>
                        <Flatpickr
                            className="form-input"
                            value={endDate}
                            onChange={(date) => setEndDate(date[0])}
                            options={{
                                dateFormat: 'd/m/Y',
                                altInput: true,
                                altFormat: 'd/m/Y',
                                altInputClass: 'form-input',
                                minDate: startDate,
                            }}
                            placeholder="Select end date"
                        />
                    </div>
                </div>
            </FilterSheet>

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
                                    <th className="min-w-[100px]">Coupon</th>
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
                                                    {order.coupon_detail ? (
                                                        <div className="flex flex-col gap-1">
                                                            <div className="font-semibold">{order.coupon_detail.coupon_code}</div>
                                                            <div className="text-xs text-gray-500">{order.coupon_detail.coupon_percentage}% off</div>
                                                            <div className="text-xs text-gray-500">Max: {formatToRupiah(order.coupon_detail.coupon_max_discount)}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )}
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
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mt-10">
                        <span className="text-sm">Show:</span>
                        <select className="form-select text-sm w-20" value={queryParams.limit} onChange={handleLimitChange}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="text-sm">entries</span>
                    </div>
                    <Pagination
                        activePage={Number(searchParams.get('page')) || 1}
                        itemsCountPerPage={queryParams.limit}
                        totalItemsCount={pagination?.totalData || 0}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </div>
            </>
        </div>
    );
};

export default Orders;
