import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { useGetAllBlogCategoryQuery } from '../../services/blogCategoryService';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBlogPayload, createBlogSchema } from '../../schema/blogsSchema';
import { useNavigate, useParams } from 'react-router-dom';
import IconX from '../../components/Icon/IconX';
import IconCheck from '../../components/Icon/IconChecks';
import { useGetAllBlogKeyword } from '../../services/blogKeywordsService';
import { MultipleSelect, SingleSelect } from '../../components';
import { ApiDeleteImage, ApiUploadImageBlog } from '../../api/uploadApi';
import { useGetBlogByIdQuery, useUpdateBlog } from '../../services/blogService';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';

const BlogDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const params = {
        page: 1,
        limit: 1000,
    };

    useEffect(() => {
        dispatch(setPageTitle('Detail Blog'));
    });

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<CreateBlogPayload>({
        resolver: zodResolver(createBlogSchema),
    });

    const { data: { data: categories } = { data: [], pagination: {} }, isFetching: isFetchingCategories } = useGetAllBlogCategoryQuery(params);
    const { data: { data: keywords } = { data: [], pagination: {} }, isFetching: isFetchingKeywords } = useGetAllBlogKeyword(params);
    const { data: blogData, isFetching: isFetchingBlog } = useGetBlogByIdQuery(id as string);
    const { mutate: updateBlog, isPending } = useUpdateBlog();

    const isLoading = isFetchingCategories || isFetchingKeywords || isFetchingBlog;

    const [editorContent, setEditorContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showImageActions, setShowImageActions] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [imageName, setImageName] = useState('');

    useEffect(() => {
        if (blogData?.data && !isLoading) {
            const blog = blogData.data;
            setValue('blog_title', blog.blog_title);
            setValue('blog_category_id', blog.blog_category_id);
            setValue(
                'blogKeywordNames',
                blog.blog_keywords.map((kw) => kw.blog_keyword_name)
            );
            setValue('blog_desc', blog.blog_desc);
            setEditorContent(blog.blog_desc);
            setUploadedImageUrl(blog.blog_banner_image);
            setImagePreview(blog.blog_banner_image);
            setImageName(blog.blog_banner_image.split('/').pop() as string);
        }
    }, [blogData, setValue, isLoading]);

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
            const response = await ApiUploadImageBlog(selectedImage);
            setUploadedImageUrl(response.data.fileUrl);
            setShowImageActions(false);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
            setIsImageChanged(true);
        }
    };

    const handleImageCancel = () => {
        setSelectedImage(null);
        setImagePreview(blogData?.data?.blog_banner_image || null);
        setShowImageActions(false);
        setUploadedImageUrl(blogData?.data?.blog_banner_image || null);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const onSubmit = (data: CreateBlogPayload) => {
        if (!uploadedImageUrl) {
            alert('Silakan upload gambar terlebih dahulu!');
            return;
        }

        const payload = { ...data, blog_desc: editorContent, blog_banner_image: uploadedImageUrl };

        updateBlog(
            {
                id: id as string,
                payload,
            },
            {
                onSuccess: () => {
                    if (isImageChanged) {
                        ApiDeleteImage(imageName);
                    }
                    navigate('/admin/manage-blog');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="animate-pulse">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-40 w-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="animate-pulse">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <button className="btn btn-primary p-2 rounded-full" onClick={() => navigate(-1)}>
                        <IconArrowBackward className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Blog</h1>
                        <p className="text-sm text-gray-600">Edit and update your existing blog post</p>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label htmlFor="blog_title" className="flex items-center">
                        Blog Title
                        <span className="text-danger">*</span>
                    </label>
                    <input id="blog_title" type="text" className="form-input" placeholder="Enter Blog Title" {...register('blog_title')} />
                    {errors.blog_title && <span className="text-danger">{errors.blog_title.message}</span>}
                </div>

                <div>
                    <SingleSelect
                        name="blog_category_id"
                        control={control}
                        options={categories.map((category) => ({
                            value: category.blog_category_id,
                            label: category.blog_category_name,
                        }))}
                        label="Blog Category"
                        placeholder="Choose Blog Category"
                        error={errors.blog_category_id?.message}
                        isFetching={false}
                    />
                </div>

                <MultipleSelect
                    name="blogKeywordNames"
                    control={control}
                    options={keywords.map((keyword) => ({
                        value: keyword.blog_keyword_name,
                        label: keyword.blog_keyword_name,
                    }))}
                    label="Keywords"
                    placeholder="Choose Keywords"
                    error={errors.blogKeywordNames?.message}
                    isFetching={false}
                />

                <div>
                    <label htmlFor="blog_banner_image" className="flex items-center">
                        Blog Banner Image
                        <span className="text-danger">*</span>
                    </label>
                    <input
                        type="file"
                        id="blog_banner_image"
                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                        accept="image/*"
                        onChange={handleImageChange}
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

                <div>
                    <label className="flex items-center">
                        Blog Description <span className="text-danger">*</span>
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={editorContent}
                        onChange={(content) => {
                            setEditorContent(content);
                            setValue('blog_desc', content);
                        }}
                        className="h-[200px] mb-10"
                    />
                    {errors.blog_desc && <span className="text-danger">{errors.blog_desc.message}</span>}
                </div>
                <button type="submit" disabled={isPending} className="btn btn-primary !mt-16">
                    {isPending && (
                        <i
                            className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle shrink-0"
                            role="status"
                            aria-hidden="true"
                        ></i>
                    )}
                    {isPending ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default BlogDetail;
