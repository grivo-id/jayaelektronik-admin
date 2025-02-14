import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { Toast } from '../../types/announcer';
import { useGetAllToastQuery, useCreateToast, useUpdateToast, useDeleteToast } from '../../services/toastService';
import { CreateToastPayload, getCreateToastSchema } from '../../schema/toastSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllToast } from '../../api/toastApi';
import formatDate from '../../utils/formatDate';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/store';

const ToastAnnouncer = () => {
    const user = useStore((state) => state.user);

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

    const { data: { data: toastData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllToastQuery(queryParams);
    const { mutate: createToast, isPending: createToastPending } = useCreateToast();
    const { mutate: updateToast, isPending: updateToastPending } = useUpdateToast();
    const { mutate: deleteToast, isPending: deleteToastPending } = useDeleteToast();

    const createToastSchema = useMemo(() => getCreateToastSchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateToastPayload>({
        resolver: zodResolver(createToastSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    useEffect(() => {
        dispatch(setPageTitle('Toast Announcer'));
    }, []);

    const [addToastModal, setAddToastModal] = useState<boolean>(false);
    const [selectedToast, setSelectedToast] = useState<Toast | null>(null);

    const onSubmit = (data: CreateToastPayload) => {
        const localDate = new Date(data.toast_expired_date);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

        const payload = {
            ...data,
            user_id: user?.user_id,
            toast_expired_date: utcDate.toISOString(),
        };

        if (selectedToast) {
            updateToast(
                {
                    id: selectedToast.toast_id,
                    payload,
                },
                {
                    onSuccess: () => {
                        setAddToastModal(false);
                        reset();
                        setSelectedToast(null);
                    },
                }
            );
        } else {
            createToast(payload, {
                onSuccess: () => {
                    setAddToastModal(false);
                    reset();
                    setQueryParams({ ...queryParams, page: 1 });
                },
            });
        }
    };

    const editToast = (toast: Toast) => {
        setSelectedToast(toast);
        setValue('toast_title', toast.toast_title);
        setValue('toast_message', toast.toast_message);
        const date = new Date(toast.toast_expired_date);
        const formattedDate = date.toISOString().slice(0, 16);
        setValue('toast_expired_date', formattedDate);
        setAddToastModal(true);
    };

    const deleteToastItem = (toast: Toast) => {
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
                deleteToast(toast.toast_id, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Toast has been deleted.',
                            padding: '2em',
                            customClass: {
                                popup: 'sweet-alerts',
                            },
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Something went wrong.',
                            padding: '2em',
                            customClass: {
                                popup: 'sweet-alerts',
                            },
                        });
                    },
                });
            }
        });
    };

    const closeModal = () => {
        setAddToastModal(false);
        reset();
        setSelectedToast(null);
    };

    const isLoading = createToastPending || updateToastPending || deleteToastPending;

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
                queryKey: ['blog-categories', nextPageParams],
                queryFn: () => ApiGetAllToast(nextPageParams),
            });
        }
    }, [queryParams, toastData, isPlaceholderData, queryClient]);

    return (
        <div>
            <MainHeader
                title="Toast Announcer"
                subtitle="Manage and view all toast announcements"
                addText="Add New"
                onAdd={() => {
                    reset();
                    setAddToastModal(true);
                }}
                onSearchChange={handleSearchChange}
                search={search}
            />
            <>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-2/10">Title</th>
                                    <th className="w-4/10">Message</th>
                                    <th className="w-2/10">Expired Date</th>
                                    <th className="w-1/10">Created Date</th>
                                    <th className="w-1/10 text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={5} />
                            ) : toastData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No toast announcements</p>
                                                <p className="text-sm text-gray-400">Please add a new announcement by clicking the "Add New" button above</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {toastData.map((toast: Toast) => {
                                        return (
                                            <tr key={toast.toast_id}>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{toast.toast_title}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{toast.toast_message}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {(() => {
                                                        const date = new Date(toast.toast_expired_date);
                                                        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000 - 2 * 60 * 60 * 1000);
                                                        return formatDate(localDate.toISOString());
                                                    })()}
                                                </td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(toast.toast_created_date)}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Tooltip text="Edit Toast" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editToast(toast)} disabled={deleteToastPending}>
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Delete Toast" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteToastItem(toast)} disabled={deleteToastPending}>
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

            <Dialog as="div" open={addToastModal} onClose={closeModal} className="relative z-50">
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
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{selectedToast ? 'Edit Toast' : 'Add Toast'}</div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-5">
                                        <label htmlFor="toast_title" className="flex items-center">
                                            Title
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="toast_title"
                                            type="text"
                                            placeholder="Enter Toast Title"
                                            className={`form-input ${errors.toast_title ? 'error' : ''}`}
                                            {...register('toast_title')}
                                        />
                                        {errors.toast_title && <span className="text-danger text-sm mt-1">{errors.toast_title.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="toast_message" className="flex items-center">
                                            Message
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <textarea
                                            id="toast_message"
                                            placeholder="Enter Toast Message"
                                            className={`form-textarea ${errors.toast_message ? 'error' : ''}`}
                                            {...register('toast_message')}
                                            rows={3}
                                        ></textarea>
                                        {errors.toast_message && <span className="text-danger text-sm mt-1">{errors.toast_message.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="toast_expired_date" className="flex items-center">
                                            Expired Date
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input id="toast_expired_date" type="datetime-local" className={`form-input ${errors.toast_expired_date ? 'error' : ''}`} {...register('toast_expired_date')} />
                                        {errors.toast_expired_date && <span className="text-danger text-sm mt-1">{errors.toast_expired_date.message}</span>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={isLoading}>
                                            {isLoading ? (selectedToast ? 'Updating...' : 'Adding...') : selectedToast ? 'Update' : 'Add'}
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

export default ToastAnnouncer;
