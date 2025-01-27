import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { Brand } from '../../types/brandsType';
import { useGetAllBrandQuery, useCreateBrand, useUpdateBrand, useDeleteBrand, useToggleVisibility } from '../../services/brandsService';
import { CreateBrandPayload, getCreateBrandSchema } from '../../schema/brandsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllBrand } from '../../api/brandsApi';
import { ApiUploadImageBrand } from '../../api/uploadApi';
import IconCheck from '../../components/Icon/IconChecks';
import formatDate from '../../utils/formatDate';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';

const BlogCategories = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState({
        limit: 10,
        page: 1,
        search: '',
        sort: 'desc',
    });

    const { data: { data: brandsData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllBrandQuery(queryParams);
    const { mutate: createBrand, isPending: createBrandPending } = useCreateBrand();
    const { mutate: updateBrand, isPending: updateBrandPending } = useUpdateBrand();
    const { mutate: deleteBrand, isPending: deleteBrandPending } = useDeleteBrand();
    const { mutate: toggleVisibility } = useToggleVisibility();

    const createBrandSchema = useMemo(() => getCreateBrandSchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateBrandPayload>({
        resolver: zodResolver(createBrandSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Blog Categories'));
    }, []);

    const [addBrandModal, setAddBrandModal] = useState<boolean>(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [search, setSearch] = useState<string>('');

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
            const response = await ApiUploadImageBrand(selectedImage);
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
        setImagePreview(null);
        setShowImageActions(false);
        setUploadedImageUrl(null);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const onSubmit = (data: CreateBrandPayload) => {
        if (selectedBrand) {
            updateBrand(
                {
                    id: selectedBrand.brand_id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setAddBrandModal(false);
                        reset();
                        setSelectedBrand(null);
                    },
                }
            );
        } else {
            if (!uploadedImageUrl) {
                alert('Please upload an image first');
                return;
            }

            const payload = { ...data, brand_image: uploadedImageUrl };

            createBrand(payload, {
                onSuccess: () => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setUploadedImageUrl(null);
                    setShowImageActions(false);
                    reset();
                    setAddBrandModal(false);
                    setQueryParams({ ...queryParams, page: 1 });
                },
            });
        }
    };

    const editBrandAction = (brand: Brand) => {
        setSelectedBrand(brand);
        setValue('brand_name', brand.brand_name);
        setAddBrandModal(true);
    };

    const deleteBrandAction = (brand: Brand) => {
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
                deleteBrand(brand.brand_id, {
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

    const handleToggleVisibility = (brandId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'hide' : 'show';
        Swal.fire({
            icon: 'warning',
            title: `Are you sure?`,
            text: `This brand will be ${action}n from the website`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                setShowLoader(true);
                toggleVisibility(brandId, {
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
        setAddBrandModal(false);
        reset();
        setSelectedBrand(null);
    };

    const isLoading = createBrandPending || updateBrandPending || deleteBrandPending;

    const handlePageChange = (newPage: number) => {
        setQueryParams({ ...queryParams, page: newPage });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setQueryParams({ ...queryParams, search: e.target.value });
    };

    useEffect(() => {
        const nextPage = (pagination?.currentPage ?? 1) + 1;

        if (!isPlaceholderData && pagination?.hasNextPage) {
            const nextPageParams = {
                ...queryParams,
                page: nextPage,
            };

            queryClient.prefetchQuery({
                queryKey: ['brands', nextPageParams],
                queryFn: () => ApiGetAllBrand(nextPageParams),
            });
        }
    }, [queryParams, brandsData, isPlaceholderData, queryClient]);

    return (
        <div>
            <MainHeader
                title="Brands"
                subtitle="Manage and view all registered product brands"
                addText="Add New"
                onAdd={() => {
                    reset();
                    setAddBrandModal(true);
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
                                    <th className="w-2/10">Name</th>
                                    <th className="w-3/10">Brand Image</th>
                                    <th className="w-2/10">Visibility</th>
                                    <th className="w-2/10">Created Date</th>
                                    <th className="w-1/10 text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={5} />
                            ) : brandsData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No brands found</p>
                                                <p className="text-sm text-gray-400">Please add a new brand by clicking the "Add New" button above</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {brandsData.map((brand: Brand) => {
                                        return (
                                            <tr key={brand.brand_id}>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{brand.brand_name}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                    <div className="w-20 h-20 overflow-hidden rounded-md">
                                                        <img
                                                            src={brand.brand_image}
                                                            alt={brand.brand_name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/assets/images/placeholder-blog.png';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id={`custom_switch_checkbox_${brand.brand_id}`}
                                                            checked={brand.brand_is_show}
                                                            onChange={() => handleToggleVisibility(brand.brand_id, brand.brand_is_show)}
                                                        />
                                                        <label
                                                            htmlFor={`custom_switch_checkbox_${brand.brand_id}`}
                                                            className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                                            title={brand.brand_is_show ? 'Visible' : 'Not Visible'}
                                                        ></label>
                                                    </label>
                                                </td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(brand.brand_created_date)}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Tooltip text="Edit Brand" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editBrandAction(brand)} disabled={updateBrandPending}>
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Delete Brand" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteBrandAction(brand)} disabled={deleteBrandPending}>
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
                <Pagination activePage={queryParams.page} itemsCountPerPage={queryParams.limit} totalItemsCount={pagination?.totalData || 0} pageRangeDisplayed={5} onChange={handlePageChange} />
            </>

            {showLoader && <Loader />}

            <Dialog as="div" open={addBrandModal} onClose={closeModal} className="relative z-50">
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
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{selectedBrand ? 'Edit Brand' : 'Add Brand'}</div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-5">
                                        <label htmlFor="brand_name" className="flex items-center">
                                            Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input id="brand_name" type="text" placeholder="Enter Brand Name" className={`form-input ${errors.brand_name ? 'error' : ''}`} {...register('brand_name')} />
                                        {errors.brand_name && <label className="text-danger">{errors.brand_name.message}</label>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="brand_image" className="flex items-center">
                                            Brand Image
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                id="brand_image"
                                                className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                disabled={uploadedImageUrl !== null || isUploading}
                                            />
                                            {imagePreview && (
                                                <div className="relative mt-4 inline-block">
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
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            disabled={isLoading}
                                            aria-label={isLoading ? (selectedBrand ? 'Updating' : 'Adding') : selectedBrand ? 'Update' : 'Add'}
                                        >
                                            {isLoading && (
                                                <i
                                                    className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></i>
                                            )}
                                            {isLoading ? (selectedBrand ? 'Updating...' : 'Adding...') : selectedBrand ? 'Update' : 'Add'}
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

export default BlogCategories;
