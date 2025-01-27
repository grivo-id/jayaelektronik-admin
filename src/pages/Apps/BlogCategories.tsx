import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { BlogCategory } from '../../types/blogCategories';
import { useGetAllBlogCategoryQuery, useCreateBlogCategory, useUpdateBlogCategory, useDeleteBlogCategory } from '../../services/blogCategoryService';
import { CreateBlogCategoryPayload, getCreateBlogCategorySchema } from '../../schema/blogCategoriesShema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllBlogCategory } from '../../api/blogCategoryApi';
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

    const { data: { data: blogCategoriesData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllBlogCategoryQuery(queryParams);
    const { mutate: createBlogCategory, isPending: createBlogCategoryPending } = useCreateBlogCategory();
    const { mutate: updateBlogCategory, isPending: updateBlogCategoryPending } = useUpdateBlogCategory();
    const { mutate: deleteBlogCategory, isPending: deleteBlogCategoryPending } = useDeleteBlogCategory();

    const createBlogCategorySchema = useMemo(() => getCreateBlogCategorySchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateBlogCategoryPayload>({
        resolver: zodResolver(createBlogCategorySchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Blog Categories'));
    }, []);

    const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
    const [search, setSearch] = useState<string>('');

    const onSubmit = (data: CreateBlogCategoryPayload) => {
        if (selectedCategory) {
            updateBlogCategory(
                {
                    id: selectedCategory.blog_category_id,
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
            createBlogCategory(data, {
                onSuccess: () => {
                    setAddCategoryModal(false);
                    reset();
                    setQueryParams({ ...queryParams, page: 1 });
                },
            });
        }
    };

    const editCategory = (category: BlogCategory) => {
        setSelectedCategory(category);
        setValue('blog_category_name', category.blog_category_name);
        setValue('blog_category_desc', category.blog_category_desc);
        setAddCategoryModal(true);
    };

    const deleteCategory = (category: BlogCategory) => {
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
                deleteBlogCategory(category.blog_category_id, {
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

    const isLoading = createBlogCategoryPending || updateBlogCategoryPending || deleteBlogCategoryPending;

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
                queryKey: ['blog-categories', nextPageParams],
                queryFn: () => ApiGetAllBlogCategory(nextPageParams),
            });
        }
    }, [queryParams, blogCategoriesData, isPlaceholderData, queryClient]);

    return (
        <div>
            <MainHeader
                title="Blog Categories"
                subtitle="Manage and view all registered blog categories"
                addText="Add New"
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
                                    <th className="w-3/10">Description</th>
                                    <th className="w-2/10">Created Date</th>
                                    <th className="w-1/10 text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={4} />
                            ) : blogCategoriesData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No blog categories</p>
                                                <p className="text-sm text-gray-400">Please add a new blog category by clicking the "Add New" button above</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {blogCategoriesData.map((category: BlogCategory) => {
                                        return (
                                            <tr key={category.blog_category_id}>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{category.blog_category_name}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{category.blog_category_desc}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(category.blog_category_created_date)}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Tooltip text="Edit Category" position="top">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => editCategory(category)}
                                                                disabled={deleteBlogCategoryPending}
                                                            >
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Delete Category" position="top">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteCategory(category)}
                                                                disabled={deleteBlogCategoryPending}
                                                            >
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
                                        <label htmlFor="blog_category_name" className="flex items-center">
                                            Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="blog_category_name"
                                            type="text"
                                            placeholder="Enter Category Name"
                                            className={`form-input ${errors.blog_category_name ? 'error' : ''}`}
                                            {...register('blog_category_name')}
                                        />
                                        {errors.blog_category_name && <span className="text-danger text-sm mt-1">{errors.blog_category_name.message}</span>}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="blog_category_desc" className="flex items-center">
                                            Description
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <textarea
                                            id="blog_category_desc"
                                            placeholder="Enter Category Description"
                                            className={`form-textarea ${errors.blog_category_desc ? 'error' : ''}`}
                                            {...register('blog_category_desc')}
                                            rows={3}
                                        ></textarea>
                                        {errors.blog_category_desc && <span className="text-danger text-sm mt-1">{errors.blog_category_desc.message}</span>}
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={closeModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            disabled={isLoading}
                                            aria-label={isLoading ? (selectedCategory ? 'Updating' : 'Adding') : selectedCategory ? 'Update' : 'Add'}
                                        >
                                            {isLoading && (
                                                <i
                                                    className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></i>
                                            )}
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

export default BlogCategories;
