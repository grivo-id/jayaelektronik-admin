import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSearch from '../../components/Icon/IconSearch';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useGetAllBlogQuery } from '../../services/blogService';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { QUILL_EDITOR_SANITIZATION_CONFIG } from '../../constants/quill-sanitize';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllBlog } from '../../api/blogsApi';
import { SkeletonLoadingGrid } from '../../components';

const Blog = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState({
        limit: 9,
        page: 1,
        search: '',
        sort: 'desc',
    });

    useEffect(() => {
        dispatch(setPageTitle('Blog '));
    });

    const { data: { data: blogData = [], pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllBlogQuery(queryParams);

    const handlePageChange = (newPage: number) => {
        setQueryParams({ ...queryParams, page: newPage });
    };

    useEffect(() => {
        const nextPage = (pagination?.currentPage ?? 1) + 1;

        if (!isPlaceholderData && pagination?.hasNextPage) {
            const nextPageParams = {
                ...queryParams,
                page: nextPage,
            };

            queryClient.prefetchQuery({
                queryKey: ['blogs', nextPageParams],
                queryFn: () => ApiGetAllBlog(nextPageParams),
            });
        }
    }, [queryParams, blogData, isPlaceholderData, queryClient]);

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Blog</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => navigate('/blog/create')}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add New
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" placeholder="Search..." value={''} onChange={() => {}} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {isFetching ? (
                    <SkeletonLoadingGrid />
                ) : (
                    blogData.map((blog) => (
                        <div key={blog.blog_id} className="panel h-full">
                            <div className="flex flex-col h-full">
                                <div className="relative w-full h-48 mb-4">
                                    <img
                                        src={blog.blog_banner_image}
                                        alt={blog.blog_title}
                                        className="w-full h-full object-cover rounded-t-md"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/assets/images/placeholder-blog.png';
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col flex-1 pt-0">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h5 className="text-lg font-bold line-clamp-1 flex-1 mr-4">{blog.blog_title}</h5>
                                            <span className="badge bg-primary/10 text-primary rounded-full whitespace-nowrap">{blog.blog_category_name}</span>
                                        </div>
                                        <div className="mb-4">
                                            <div
                                                className="text-white-dark line-clamp-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(blog.blog_desc, QUILL_EDITOR_SANITIZATION_CONFIG),
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {blog.blog_keywords.map((keyword) => (
                                                <span key={keyword.blog_keyword_id} className="badge badge-outline-primary text-xs">
                                                    {keyword.blog_keyword_name}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-sm flex items-center justify-between mb-4">
                                            <div className="font-semibold text-primary">{blog.user_name}</div>
                                            <div className="text-white-dark text-xs">
                                                {new Date(blog.blog_created_date).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-auto pt-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
                                        <button type="button" className="btn btn-outline-info btn-sm">
                                            Detail
                                        </button>
                                        <button type="button" className="btn btn-outline-primary btn-sm">
                                            <IconPencil className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="btn btn-outline-danger btn-sm">
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Pagination activePage={queryParams.page} itemsCountPerPage={queryParams.limit} totalItemsCount={pagination?.totalData || 0} pageRangeDisplayed={5} onChange={handlePageChange} />
        </div>
    );
};

export default Blog;
