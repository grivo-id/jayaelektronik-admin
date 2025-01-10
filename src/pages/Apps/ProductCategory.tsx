import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { ProductCategory } from '../../types/productCategories';
import { useGetAllProductCategory, useCreateProductCategory, useUpdateProductCategory, useDeleteProductCategory } from '../../services/productCategoryService';
import { CreateProductCategoryPayload, getCreateProductCategorySchema } from '../../schema/productCategorySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable } from '../../components';

const ProductCategories = () => {
    const dispatch = useDispatch();

    const [queryParams, setQueryParams] = useState({
        limit: 10,
        page: 1,
        search: '',
        sort: 'desc',
    });

    const { data: { data: productCategoriesData, pagination } = { data: [], pagination: {} }, isPending, refetch } = useGetAllProductCategory(queryParams);
    const { mutate: createProductCategory, isPending: createProductCategoryPending } = useCreateProductCategory();
    const { mutate: updateProductCategory, isPending: updateProductCategoryPending } = useUpdateProductCategory();
    const { mutate: deleteProductCategory, isPending: deleteProductCategoryPending } = useDeleteProductCategory();

    const createProductCategorySchema = useMemo(() => getCreateProductCategorySchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateProductCategoryPayload>({
        resolver: zodResolver(createProductCategorySchema),
        mode: 'onChange',
        reValidateMode: 'onBlur',
    });

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Product Categories'));
    }, []);

    useEffect(() => {
        refetch();
    }, [queryParams, refetch]);

    const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const [search, setSearch] = useState<string>('');

    const onSubmit = (data: CreateProductCategoryPayload) => {
        if (selectedCategory) {
            updateProductCategory(
                {
                    id: selectedCategory.product_category_id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setAddCategoryModal(false);
                        reset();
                        setSelectedCategory(null);
                    },
                }
            );
        } else {
            createProductCategory(data, {
                onSuccess: () => {
                    setAddCategoryModal(false);
                    reset();
                },
            });
        }
    };

    const editCategory = (category: ProductCategory) => {
        setSelectedCategory(category);
        setValue('product_category_name', category.product_category_name);
        setValue('product_category_desc', category.product_category_desc);
        setAddCategoryModal(true);
    };

    const deleteCategory = (category: ProductCategory) => {
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
                deleteProductCategory(category.product_category_id, {
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
        setAddCategoryModal(false);
        reset();
        setSelectedCategory(null);
    };

    const isLoading = createProductCategoryPending || updateProductCategoryPending || deleteProductCategoryPending;

    const handlePageChange = (newPage: number) => {
        setQueryParams({ ...queryParams, page: newPage });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setQueryParams({ ...queryParams, search: e.target.value });
    };

    return (
        <div>
            <MainHeader
                title="Product Categories"
                addText="Add Category"
                onAdd={() => {
                    reset();
                    setAddCategoryModal(true);
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
                                    <th className="w-3/10">Name</th>
                                    <th className="w-4/10">Description</th>
                                    <th className="w-2/10">Created Date</th>
                                    <th className="w-1/10 !text-center">Actions</th>
                                </tr>
                            </thead>
                            {isPending ? (
                                <SkeletonLoadingTable rows={10} columns={4} />
                            ) : (
                                <tbody>
                                    {productCategoriesData.map((category: ProductCategory) => {
                                        return (
                                            <tr key={category.product_category_id}>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{category.product_category_name}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{category.product_category_desc}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{new Date(category.product_category_created_date).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editCategory(category)} disabled={deleteProductCategoryPending}>
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => deleteCategory(category)}
                                                            disabled={deleteProductCategoryPending}
                                                        >
                                                            Delete
                                                        </button>
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

            <Dialog as="div" open={addCategoryModal} onClose={closeModal} className="relative z-50">
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
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {selectedCategory ? 'Edit Category' : 'Add Category'}
                            </div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-5">
                                        <label htmlFor="product_category_name">Name</label>
                                        <input id="product_category_name" type="text" placeholder="Enter Category Name" className="form-input" {...register('product_category_name')} />
                                        {errors.product_category_name && <span className="text-danger">{errors.product_category_name.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="product_category_desc">Description</label>
                                        <input id="product_category_desc" type="text" placeholder="Enter Category Description" className="form-input" {...register('product_category_desc')} />
                                        {errors.product_category_desc && <span className="text-danger">{errors.product_category_desc.message}</span>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={isLoading}>
                                            {isLoading ? (selectedCategory ? 'Updating...' : 'Adding...') : selectedCategory ? 'Update' : 'Add'}
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

export default ProductCategories;
