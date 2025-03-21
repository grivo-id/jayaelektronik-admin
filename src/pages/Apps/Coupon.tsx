import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { Coupon } from '../../types/coupon';
import { useGetAllCouponQuery, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '../../services/couponService';
import { CreateCouponPayload, getCreateCouponSchema } from '../../schema/couponSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllCoupon } from '../../api/coupon';
import formatDate from '../../utils/formatDate';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useSearchParams } from 'react-router-dom';
import { NumericFormat as NumberFormat } from 'react-number-format';
import formatToRupiah from '../../utils/formatToRupiah';

const Coupons = () => {
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

    const { data: { data: couponsData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllCouponQuery(queryParams);
    const { mutate: createCoupon, isPending: createCouponPending } = useCreateCoupon();
    const { mutate: updateCoupon, isPending: updateCouponPending } = useUpdateCoupon();
    const { mutate: deleteCoupon, isPending: deleteCouponPending } = useDeleteCoupon();

    const createCouponSchema = useMemo(() => getCreateCouponSchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
        watch,
    } = useForm<CreateCouponPayload>({
        resolver: zodResolver(createCouponSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Coupons'));
    }, []);

    const [addCouponModal, setAddCouponModal] = useState<boolean>(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const onSubmit = (data: CreateCouponPayload) => {
        if (selectedCoupon) {
            updateCoupon(
                {
                    id: selectedCoupon.coupon_discount_id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setAddCouponModal(false);
                        reset();
                        setSelectedCoupon(null);
                    },
                }
            );
        } else {
            createCoupon(data, {
                onSuccess: () => {
                    setAddCouponModal(false);
                    reset();
                    setQueryParams({ ...queryParams, page: 1 });
                },
            });
        }
    };

    const editCoupon = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setValue('coupon_code', coupon.coupon_code);
        setValue('coupon_percentage', coupon.coupon_percentage);
        setValue('coupon_min_product_qty', coupon.coupon_min_product_qty);
        setValue('coupon_min_transaction', coupon.coupon_min_transaction);
        setValue('coupon_max_discount', coupon.coupon_max_discount);
        setValue('coupon_expired_date', coupon.coupon_expired_date);
        setValue('coupon_max_used', coupon.coupon_max_used);
        setAddCouponModal(true);
    };

    console.log(watch());

    const deleteCouponHandler = (coupon: Coupon) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: {
                popup: 'sweet-alerts',
            },
        }).then((result) => {
            if (result.value) {
                setShowLoader(true);
                deleteCoupon(coupon.coupon_discount_id, {
                    onSuccess: () => {
                        setShowLoader(false);
                    },
                    onError: () => {
                        setShowLoader(false);
                    },
                });
            }
        });
    };

    const closeModal = () => {
        setAddCouponModal(false);
        reset();
        setSelectedCoupon(null);
    };

    const isLoading = createCouponPending || updateCouponPending || deleteCouponPending;

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
                queryKey: ['coupons', nextPageParams],
                queryFn: () => ApiGetAllCoupon(nextPageParams),
            });
        }
    }, [queryParams, couponsData, isPlaceholderData, queryClient]);

    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const upperCaseValue = e.target.value.toUpperCase();
        setValue('coupon_code', upperCaseValue);
    };

    return (
        <div>
            <MainHeader
                title="Coupons"
                subtitle="Manage and view all registered coupons"
                addText="Add New"
                onAdd={() => {
                    reset();
                    setAddCouponModal(true);
                }}
                onSearchChange={handleSearchChange}
                search={search}
            />
            <>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th className="w-1/12">Code</th>
                                    <th className="w-1/12">Percentage</th>
                                    <th className="w-1/12">Min. Product Qty</th>
                                    <th className="w-2/12">Min. Transaction</th>
                                    <th className="w-2/12">Max Discount</th>
                                    <th className="w-2/12">Expired Date</th>
                                    <th className="w-1/12">Used</th>
                                    <th className="w-1/12">Max Used</th>
                                    <th className="w-1/12">Completed Used</th>
                                    <th className="w-2/12">Created Date</th>
                                    <th className="w-1/12">Created By</th>
                                    <th className="w-1/12 text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={12} />
                            ) : couponsData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={12} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No coupons</p>
                                                <p className="text-sm text-gray-400">Please add a new coupon by clicking the "Add New" button above</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {couponsData.map((coupon: Coupon) => {
                                        return (
                                            <tr key={coupon.coupon_discount_id}>
                                                <td>{coupon.coupon_code}</td>
                                                <td>{coupon.coupon_percentage}%</td>
                                                <td>{coupon.coupon_min_product_qty}</td>
                                                <td>{formatToRupiah(coupon.coupon_min_transaction)}</td>
                                                <td>{formatToRupiah(coupon.coupon_max_discount)}</td>
                                                <td className={`${new Date(coupon.coupon_expired_date) < new Date() ? 'text-danger' : ''}`}>{formatDate(coupon.coupon_expired_date)}</td>
                                                <td>{coupon.coupon_used}</td>
                                                <td>{coupon.coupon_max_used}</td>
                                                <td>{coupon.coupon_completed_used}</td>
                                                <td>{formatDate(coupon.coupon_created_date)}</td>
                                                <td>{coupon.created_by}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Tooltip text="Edit Coupon" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editCoupon(coupon)} disabled={deleteCouponPending}>
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Delete Coupon" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCouponHandler(coupon)} disabled={deleteCouponPending}>
                                                                <IconTrash className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                    </div>
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

            {showLoader && <Loader />}

            <Dialog as="div" open={addCouponModal} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-[black]/60" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                disabled={isLoading}
                            >
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{selectedCoupon ? 'Edit Coupon' : 'Add Coupon'}</div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_code" className="flex items-center">
                                            Code
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="coupon_code"
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            className={`form-input ${errors.coupon_code ? 'error' : ''}`}
                                            {...register('coupon_code')}
                                            onChange={(e) => {
                                                register('coupon_code').onChange(e);
                                                handleCouponCodeChange(e);
                                            }}
                                        />
                                        {errors.coupon_code && <span className="text-danger text-sm mt-1">{errors.coupon_code.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_percentage" className="flex items-center">
                                            Percentage
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="coupon_percentage"
                                            type="number"
                                            placeholder="Enter Coupon Percentage"
                                            className={`form-input ${errors.coupon_percentage ? 'error' : ''}`}
                                            {...register('coupon_percentage', { valueAsNumber: true })}
                                        />
                                        {errors.coupon_percentage && <span className="text-danger text-sm mt-1">{errors.coupon_percentage.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_min_product_qty" className="flex items-center">
                                            Minimum Product Quantity
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="coupon_min_product_qty"
                                            type="number"
                                            placeholder="Enter Minimum Product Quantity"
                                            className={`form-input ${errors.coupon_min_product_qty ? 'error' : ''}`}
                                            {...register('coupon_min_product_qty', { valueAsNumber: true })}
                                        />
                                        {errors.coupon_min_product_qty && <span className="text-danger text-sm mt-1">{errors.coupon_min_product_qty.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_min_transaction" className="flex items-center">
                                            Minimum Transaction
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <div className="flex">
                                            <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                Rp
                                            </div>
                                            <Controller
                                                name="coupon_min_transaction"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <NumberFormat
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        id="coupon_min_transaction"
                                                        className="form-input rounded-l-none"
                                                        placeholder="Enter Minimum Transaction"
                                                        value={value}
                                                        onValueChange={(values) => {
                                                            const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                                            onChange(Number(numericValue));
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors.coupon_min_transaction && <span className="text-danger text-sm mt-1">{errors.coupon_min_transaction.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_max_discount" className="flex items-center">
                                            Maximum Discount
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <div className="flex">
                                            <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                Rp
                                            </div>
                                            <Controller
                                                name="coupon_max_discount"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <NumberFormat
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        id="coupon_max_discount"
                                                        className="form-input rounded-l-none"
                                                        placeholder="Enter Maximum Discount"
                                                        value={value}
                                                        onValueChange={(values) => {
                                                            const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                                            onChange(Number(numericValue));
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors.coupon_max_discount && <span className="text-danger text-sm mt-1">{errors.coupon_max_discount.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_expired_date" className="flex items-center">
                                            Expiry Date
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <Controller
                                            name="coupon_expired_date"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    id="coupon_expired_date"
                                                    type="datetime-local"
                                                    className={`form-input ${errors.coupon_expired_date ? 'error' : ''}`}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const date = new Date(e.target.value);
                                                        field.onChange(date.toISOString());
                                                    }}
                                                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                                />
                                            )}
                                        />
                                        {errors.coupon_expired_date && <span className="text-danger text-sm mt-1">{errors.coupon_expired_date.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="coupon_max_used" className="flex items-center">
                                            Maximum Usage
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="coupon_max_used"
                                            type="number"
                                            placeholder="Enter Maximum Usage"
                                            className={`form-input ${errors.coupon_max_used ? 'error' : ''}`}
                                            {...register('coupon_max_used', { valueAsNumber: true })}
                                        />
                                        {errors.coupon_max_used && <span className="text-danger text-sm mt-1">{errors.coupon_max_used.message}</span>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            disabled={isLoading}
                                            aria-label={isLoading ? (selectedCoupon ? 'Updating' : 'Adding') : selectedCoupon ? 'Update' : 'Add'}
                                        >
                                            {isLoading && (
                                                <i
                                                    className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></i>
                                            )}
                                            {isLoading ? (selectedCoupon ? 'Updating...' : 'Adding...') : selectedCoupon ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Coupons;
