import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import { BlogKeyword } from '../../types/blogKeywordsType';
import { useGetAllBlogKeyword, useCreateBlogKeyword, useUpdateBlogKeyword, useDeleteBlogKeyword } from '../../services/blogKeywordsService';
import { CreateBlogKeywordPayload, getCreateBlogKeywordSchema } from '../../schema/blogKeywordsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MainHeader, Loader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllBlogKeyword } from '../../api/blogKeywordsApi';
import formatDate from '../../utils/formatDate';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useSearchParams } from 'react-router-dom';

const BlogKeywords = () => {
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

    const { data: { data: blogKeywordsData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllBlogKeyword(queryParams);
    const { mutate: createBlogKeyword, isPending: createBlogKeywordPending } = useCreateBlogKeyword();
    const { mutate: updateBlogKeyword, isPending: updateBlogKeywordPending } = useUpdateBlogKeyword();
    const { mutate: deleteBlogKeyword, isPending: deleteBlogKeywordPending } = useDeleteBlogKeyword();

    const createBlogKeywordSchema = useMemo(() => getCreateBlogKeywordSchema(), []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateBlogKeywordPayload>({
        resolver: zodResolver(createBlogKeywordSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setPageTitle('Blog Keywords'));
    }, []);

    const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<BlogKeyword | null>(null);

    const onSubmit = (data: CreateBlogKeywordPayload) => {
        if (selectedCategory) {
            updateBlogKeyword(
                {
                    id: selectedCategory.blog_keyword_id,
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
            createBlogKeyword(data, {
                onSuccess: () => {
                    setAddCategoryModal(false);
                    reset();
                    setQueryParams({ ...queryParams, page: 1 });
                },
            });
        }
    };

    const editCategory = (keyword: BlogKeyword) => {
        setSelectedCategory(keyword);
        setValue('blog_keyword_name', keyword.blog_keyword_name);
        setAddCategoryModal(true);
    };

    const deleteCategory = (keyword: BlogKeyword) => {
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
                deleteBlogKeyword(keyword.blog_keyword_id, {
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

    const isLoading = createBlogKeywordPending || updateBlogKeywordPending || deleteBlogKeywordPending;

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
                queryKey: ['blog-keywords', nextPageParams],
                queryFn: () => ApiGetAllBlogKeyword(nextPageParams),
            });
        }
    }, [queryParams, blogKeywordsData, isPlaceholderData, queryClient]);

    return (
        <div>
            <MainHeader
                title="Blog Keywords"
                subtitle="Manage and view all registered blog keywords"
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
                                    <th className="w-2/10">Created Date</th>
                                    <th className="w-1/10 text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={3} />
                            ) : blogKeywordsData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No blog keywords</p>
                                                <p className="text-sm text-gray-400">Please add a new blog keyword by clicking the "Add New" button above</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {blogKeywordsData.map((keyword: BlogKeyword) => {
                                        return (
                                            <tr key={keyword.blog_keyword_id}>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{keyword.blog_keyword_name}</td>
                                                <td className="whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(keyword.blog_keyword_created_date)}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Tooltip text="Edit Keyword" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editCategory(keyword)} disabled={deleteBlogKeywordPending}>
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Delete Keyword" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(keyword)} disabled={deleteBlogKeywordPending}>
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
                                {selectedCategory ? 'Edit Keyword' : 'Add Keyword'}
                            </div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-5">
                                        <label htmlFor="blog_keyword_name" className="flex items-center">
                                            Name
                                            <span className="text-danger text-base">*</span>
                                        </label>
                                        <input
                                            id="blog_keyword_name"
                                            type="text"
                                            placeholder="Enter Keyword Name"
                                            className={`form-input ${errors.blog_keyword_name ? 'error' : ''}`}
                                            {...register('blog_keyword_name')}
                                        />
                                        {errors.blog_keyword_name && <span className="text-danger">{errors.blog_keyword_name.message}</span>}
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

export default BlogKeywords;
