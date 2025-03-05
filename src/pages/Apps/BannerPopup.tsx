import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { BannerPopup } from '../../types/bannerType';
import { useGetAllBannerPopupQuery, useCreateBannerPopup, useUpdateBannerPopup, useDeleteBannerPopup, useToggleBannerPopupVisibility } from '../../services/bannerPopupService';
import { CreateBannerPopupPayload, getCreateBannerPopupSchema } from '../../schema/bannerPopupSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllBannerPopup } from '../../api/bannerPopupApi';
import { ApiUploadImageBannerPopup } from '../../api/uploadApi';
import IconCheck from '../../components/Icon/IconChecks';
import formatDate from '../../utils/formatDate';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useSearchParams } from 'react-router-dom';

const BannerPopupPage = () => {
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

    const { data: { data: bannerPopups, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllBannerPopupQuery(queryParams);
    const { mutate: createBannerPopup, isPending: createBannerPending } = useCreateBannerPopup();
    const { mutate: updateBannerPopup, isPending: updateBannerPending } = useUpdateBannerPopup();
    const { mutate: deleteBannerPopup, isPending: deleteBannerPending } = useDeleteBannerPopup();
    const { mutate: toggleVisibility } = useToggleBannerPopupVisibility();

    const createBannerSchema = useMemo(() => getCreateBannerPopupSchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateBannerPopupPayload>({
        resolver: zodResolver(createBannerSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Banner Popup'));
    }, []);

    const [addModal, setAddModal] = useState<boolean>(false);
    const [selectedBanner, setSelectedBanner] = useState<BannerPopup | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showImageActions, setShowImageActions] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setShowImageActions(true);
        }
    };

    const handleImageConfirm = async () => {
        if (!selectedImage) return;

        setIsUploading(true);
        try {
            const response = await ApiUploadImageBannerPopup(selectedImage);
            setUploadedImageUrl(response.data.fileUrl);
            setShowImageActions(false);
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageCancel = () => {
        setSelectedImage(null);
        setImagePreview(selectedBanner?.banner_popup_image || null);
        setShowImageActions(false);
        setUploadedImageUrl(selectedBanner?.banner_popup_image || null);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const onSubmit = (data: CreateBannerPopupPayload) => {
        if (selectedBanner) {
            const payload = {
                ...data,
                banner_popup_image: uploadedImageUrl || selectedBanner.banner_popup_image,
            };
            updateBannerPopup(
                {
                    id: selectedBanner.banner_popup_id,
                    payload: payload,
                },
                {
                    onSuccess: () => {
                        setAddModal(false);
                        reset();
                        setSelectedBanner(null);
                    },
                }
            );
        } else {
            if (!uploadedImageUrl) {
                alert('Please upload an image first');
                return;
            }

            const payload = { ...data, banner_popup_image: uploadedImageUrl };

            createBannerPopup(payload, {
                onSuccess: () => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setUploadedImageUrl(null);
                    setShowImageActions(false);
                    reset();
                    setAddModal(false);
                    setQueryParams({ ...queryParams, page: 1 });
                },
            });
        }
    };

    const editAction = (banner: BannerPopup) => {
        setSelectedBanner(banner);
        setValue('banner_popup_title', banner.banner_popup_title);
        setValue('banner_popup_expired_date', banner.banner_popup_expired_date.split('T')[0]);
        setValue('banner_popup_is_show', banner.banner_popup_is_show);
        setUploadedImageUrl(banner.banner_popup_image);
        setImagePreview(banner.banner_popup_image);
        setAddModal(true);
    };

    const deleteAction = (banner: BannerPopup) => {
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
                deleteBannerPopup(banner.banner_popup_id, {
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

    const handleToggleVisibility = (bannerId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'hide' : 'show';
        Swal.fire({
            icon: 'warning',
            title: `Are you sure?`,
            text: `This banner will be ${action}n from the website`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            padding: '2em',
            customClass: {
                popup: 'sweet-alerts',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setShowLoader(true);
                toggleVisibility(
                    {
                        id: bannerId,
                        isShow: !currentStatus,
                    },
                    {
                        onSuccess: () => {
                            setShowLoader(false);
                        },
                        onError: () => {
                            setShowLoader(false);
                        },
                    }
                );
            }
        });
    };

    const closeModal = () => {
        setAddModal(false);
        reset();
        setSelectedBanner(null);
        setUploadedImageUrl(null);
        setImagePreview(null);
        setSelectedImage(null);
        setShowImageActions(false);
    };

    const isLoading = createBannerPending || updateBannerPending || deleteBannerPending;

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
                queryKey: ['banner-popups', nextPageParams],
                queryFn: () => ApiGetAllBannerPopup(nextPageParams),
            });
        }
    }, [queryParams, bannerPopups, isPlaceholderData, queryClient]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold">Banner Popup</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your website's popup banner</p>
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        {bannerPopups?.length === 0 ? (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    reset();
                                    setSelectedBanner(null);
                                    setUploadedImageUrl(null);
                                    setImagePreview(null);
                                    setSelectedImage(null);
                                    setShowImageActions(false);
                                    setValue('banner_popup_is_show', true);
                                    setAddModal(true);
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5 ltr:mr-2 rtl:ml-2"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Create Banner
                            </button>
                        ) : (
                            <Tooltip text="Only 1 banner can be created" position="bottom">
                                <button type="button" className="btn btn-primary cursor-not-allowed opacity-60" disabled={true}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5 ltr:mr-2 rtl:ml-2"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Create Banner
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>

            <div className="flex-1 mt-5 panel p-0 border-0 overflow-hidden flex flex-col">
                {isFetching ? (
                    <div className="flex-1 flex items-center justify-center">
                        <SkeletonLoadingTable rows={1} columns={1} />
                    </div>
                ) : bannerPopups?.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-6 max-w-md text-center p-8">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">No Banner Popup Created</h2>
                            <p className="text-gray-500 dark:text-gray-400">Create a banner popup to display important announcements on your website</p>
                            <button
                                className="btn btn-primary mt-4 px-6"
                                onClick={() => {
                                    reset();
                                    setSelectedBanner(null);
                                    setUploadedImageUrl(null);
                                    setImagePreview(null);
                                    setSelectedImage(null);
                                    setShowImageActions(false);
                                    setValue('banner_popup_is_show', true);
                                    setAddModal(true);
                                }}
                            >
                                Create Banner
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col p-6">
                        {bannerPopups.map((banner: BannerPopup) => (
                            <div key={banner.banner_popup_id} className="flex-1 flex flex-col h-full">
                                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{banner.banner_popup_title}</h2>
                                            <div className="flex gap-3">
                                                <button type="button" className="btn btn-sm btn-outline-primary px-4" onClick={() => editAction(banner)}>
                                                    Edit
                                                </button>
                                                <button type="button" className="btn btn-sm btn-outline-danger px-4" onClick={() => deleteAction(banner)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Status</p>
                                                <div className="flex items-center gap-3">
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id={`custom_switch_checkbox_${banner.banner_popup_id}`}
                                                            checked={banner.banner_popup_is_show}
                                                            onChange={() => handleToggleVisibility(banner.banner_popup_id, banner.banner_popup_is_show)}
                                                        />
                                                        <label
                                                            htmlFor={`custom_switch_checkbox_${banner.banner_popup_id}`}
                                                            className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                                        ></label>
                                                    </label>
                                                    <span className={`text-sm font-medium ${banner.banner_popup_is_show ? 'text-success' : 'text-danger'}`}>
                                                        {banner.banner_popup_is_show ? 'Visible' : 'Hidden'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expired Date</p>
                                                <p className="text-base font-semibold">{formatDate(banner.banner_popup_expired_date)}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</p>
                                                <p className="text-base font-semibold">{formatDate(banner.banner_popup_created_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Banner Preview</h3>
                                    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="max-w-2xl max-h-[60vh] overflow-hidden">
                                            <img
                                                src={banner.banner_popup_image}
                                                alt={banner.banner_popup_title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/assets/images/placeholder-image.jpg';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showLoader && <Loader />}

            <Dialog as="div" open={addModal} onClose={closeModal} className="relative z-50">
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
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{selectedBanner ? 'Edit Banner' : 'Add Banner'}</div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-5">
                                        <label htmlFor="banner_popup_title" className="flex items-center">
                                            Title
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="banner_popup_title"
                                            type="text"
                                            className={`form-input ${errors.banner_popup_title ? 'error' : ''}`}
                                            placeholder="Enter banner title"
                                            {...register('banner_popup_title')}
                                        />
                                        {errors.banner_popup_title && <label className="text-danger">{errors.banner_popup_title.message}</label>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="banner_popup_image" className="flex items-center">
                                            Banner Image
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="banner_popup_image"
                                            type="file"
                                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <div className="mt-4">
                                            {imagePreview && (
                                                <div className="relative inline-block">
                                                    <img src={imagePreview} alt="Preview" className="max-w-[200px] rounded-lg" />
                                                    {showImageActions && (
                                                        <div className="absolute top-2 right-2 flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={handleImageConfirm}
                                                                className="p-2 bg-success text-white rounded-full hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={isUploading || !selectedImage}
                                                            >
                                                                <IconCheck className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleImageCancel}
                                                                className="p-2 bg-danger text-white rounded-full hover:bg-danger/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={isUploading}
                                                            >
                                                                <IconX className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {isUploading && <div className="mt-2 text-info">Uploading...</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="banner_popup_expired_date" className="flex items-center">
                                            Expired Date
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="banner_popup_expired_date"
                                            type="date"
                                            className={`form-input ${errors.banner_popup_expired_date ? 'error' : ''}`}
                                            {...register('banner_popup_expired_date')}
                                        />
                                        {errors.banner_popup_expired_date && <label className="text-danger">{errors.banner_popup_expired_date.message}</label>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="banner_popup_is_show" className="flex items-center">
                                            Display Status
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <select
                                            id="banner_popup_is_show"
                                            className={`form-select ${errors.banner_popup_is_show ? 'error' : ''}`}
                                            onChange={(e) => setValue('banner_popup_is_show', e.target.value === 'true')}
                                            value={watch('banner_popup_is_show') === false ? 'false' : 'true'}
                                        >
                                            <option value="true">Visible</option>
                                            <option value="false">Hidden</option>
                                        </select>
                                        {errors.banner_popup_is_show && <label className="text-danger">{errors.banner_popup_is_show.message}</label>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            disabled={isLoading}
                                            aria-label={isLoading ? (selectedBanner ? 'Updating' : 'Adding') : selectedBanner ? 'Update' : 'Add'}
                                        >
                                            {isLoading && (
                                                <i
                                                    className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></i>
                                            )}
                                            {isLoading ? (selectedBanner ? 'Updating...' : 'Adding...') : selectedBanner ? 'Update' : 'Add'}
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

export default BannerPopupPage;
