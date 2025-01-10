import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSearch from '../../components/Icon/IconSearch';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useGetAllBlogQuery } from '../../services/blogService';
import Pagination from '../../components/Pagination';

const Blog = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Blog'));
    });

    const { data: blogData = [], isPending } = useGetAllBlogQuery();

    if (isPending) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Blog</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div className="relative">
                            <input type="text" placeholder="Cari Blog..." className="form-input py-2 ltr:pr-8 rtl:pl-8" />
                            <button type="button" className="absolute inset-y-0 my-auto flex items-center ltr:right-2 rtl:left-2 text-dark">
                                <IconSearch className="w-5 h-5" />
                            </button>
                        </div>
                        <button type="button" className="btn btn-primary gap-2">
                            <IconUserPlus className="w-5 h-5 shrink-0" />
                            Tambah Blog
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {blogData.map((blog) => (
                    <div key={blog.blog_id} className="panel">
                        <div className="flex flex-col p-4">
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-xl font-bold line-clamp-1">{blog.blog_title}</h5>
                                </div>
                                <p className="text-white-dark line-clamp-3 mb-4">{blog.blog_desc}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="badge bg-primary/10 text-primary rounded-full">{blog.blog_category_name}</span>
                                </div>
                                <div className="text-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-dark font-bold">{blog.user_name}</div>
                                        <div className="text-white-dark">
                                            {new Date(blog.blog_created_date).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-auto">
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
                ))}
            </div>
            <Pagination />
        </div>
    );
};

export default Blog;
