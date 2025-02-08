import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../../services/productService';
import { useGetAllProductCategory } from '../../services/productCategoryService';
import { useGetAllBrandQuery } from '../../services/brandsService';
import { useGetAllProductTag } from '../../services/productTagService';
import { MultipleSelect } from '../../components';
import { NumericFormat as NumberFormat } from 'react-number-format';
import { getUpdateProductSchema, UpdateProductPayload } from '../../schema/productSchema';
import { ApiUploadImageProduct } from '../../api/uploadApi';
import IconChecks from '../../components/Icon/IconChecks';
import IconX from '../../components/Icon/IconX';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { SkeletonProductDetail } from '../../components';
import formatDate from '../../utils/formatDate';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedImages, setSelectedImages] = useState<{
        image1: File | null;
        image2: File | null;
        image3: File | null;
    }>({
        image1: null,
        image2: null,
        image3: null,
    });
    const [imagePreview, setImagePreview] = useState<{
        image1: string | null;
        image2: string | null;
        image3: string | null;
    }>({
        image1: null,
        image2: null,
        image3: null,
    });
    const [showImageActions, setShowImageActions] = useState<{
        image1: boolean;
        image2: boolean;
        image3: boolean;
    }>({
        image1: false,
        image2: false,
        image3: false,
    });
    const [isUploading, setIsUploading] = useState<{
        image1: boolean;
        image2: boolean;
        image3: boolean;
    }>({
        image1: false,
        image2: false,
        image3: false,
    });
    const [uploadedImages, setUploadedImages] = useState<{
        image1: boolean;
        image2: boolean;
        image3: boolean;
    }>({
        image1: false,
        image2: false,
        image3: false,
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [editorContent, setEditorContent] = useState('');

    const { data: product, isFetching } = useGetProductByIdQuery(id as string);
    const { data: categories } = useGetAllProductCategory({});
    const { data: brands } = useGetAllBrandQuery({ page: 1, limit: 1000 });
    const { data: tags } = useGetAllProductTag({ page: 1, limit: 1000 });
    const { mutate: updateProduct, isPending: isUpdatePending } = useUpdateProductMutation();

    const UpdateProductSchema = useMemo(() => getUpdateProductSchema(), []);
    const [productStatus, setProductStatus] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm<UpdateProductPayload>({
        resolver: zodResolver(UpdateProductSchema),
    });

    const productPrice = watch('product_price');
    const isDiscount = watch('product_promo_is_discount');
    const isBestDeal = watch('product_promo_is_best_deal');
    const discountPercentage = watch('product_promo_discount_percentage');

    useEffect(() => {
        dispatch(setPageTitle('Edit Product'));
    }, []);

    useEffect(() => {
        if (isDiscount && productPrice && discountPercentage) {
            const finalPrice = productPrice - (productPrice * discountPercentage) / 100;
            setValue('product_promo_final_price', finalPrice);
        }
    }, [isDiscount, productPrice, discountPercentage]);

    useEffect(() => {
        if (product && !isFetching) {
            setValue('product_name', product.product_name);
            setValue('product_desc', product.product_desc);
            setValue('product_code', product.product_code);
            setEditorContent(product.product_desc);
            setValue('product_price', product.product_price);
            setValue('product_item_sold', product.product_item_sold);
            setValue('product_is_available', product.product_is_available);
            setValue('product_is_show', product.product_is_show);
            setValue('product_is_bestseller', product.product_is_bestseller);
            setValue('product_is_new_arrival', product.product_is_new_arrival);
            setValue('brand_id', product.brand_id);
            setValue('product_category_id', product.product_category_id);
            setValue('product_subcategory_id', product.product_subcategory_id);
            setValue('product_tag_names', product.product_tags?.map((tag) => tag.product_tag_name) || []);

            if (product.product_promo) {
                setValue('product_promo_is_best_deal', product.product_promo.product_promo_is_best_deal);
                setValue('product_promo_is_discount', product.product_promo.product_promo_is_discount);
                setValue('product_promo_final_price', product.product_promo.product_promo_final_price);
                setValue('product_promo_discount_percentage', product.product_promo.product_promo_discount_percentage);
                setValue('product_promo_expired_date', product.product_promo.product_promo_expired_date || null);
            }

            if (product.product_is_bestseller) {
                setProductStatus('bestseller');
            } else if (product.product_is_new_arrival) {
                setProductStatus('new_arrival');
            }

            setValue('product_image1', product.product_image1);
            setValue('product_image2', product.product_image2);
            setValue('product_image3', product.product_image3);

            setSelectedCategory(product.product_category_id);

            setImagePreview({
                image1: product.product_image1,
                image2: product.product_image2,
                image3: product.product_image3,
            });
        }
    }, [product, setValue, isFetching]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image1' | 'image2' | 'image3') => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImages((prev) => ({ ...prev, [imageKey]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview((prev) => ({
                    ...prev,
                    [imageKey]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
            setShowImageActions((prev) => ({ ...prev, [imageKey]: true }));
        }
    };

    const handleImageConfirm = async (imageKey: 'image1' | 'image2' | 'image3') => {
        const selectedImage = selectedImages[imageKey];
        if (!selectedImage) return;

        setIsUploading((prev) => ({ ...prev, [imageKey]: true }));
        try {
            const response = await ApiUploadImageProduct(selectedImage);
            setValue(`product_${imageKey}`, response.data.fileUrl);
            setShowImageActions((prev) => ({ ...prev, [imageKey]: false }));
            setUploadedImages((prev) => ({ ...prev, [imageKey]: true }));
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading((prev) => ({ ...prev, [imageKey]: false }));
        }
    };

    const handleImageCancel = (imageKey: 'image1' | 'image2' | 'image3') => {
        setSelectedImages((prev) => ({ ...prev, [imageKey]: null }));
        setImagePreview((prev) => ({
            ...prev,
            [imageKey]: product?.[`product_${imageKey}`] || null,
        }));
        setShowImageActions((prev) => ({ ...prev, [imageKey]: false }));
    };

    const onSubmit = async (data: UpdateProductPayload) => {
        if (!id) return;

        const payload = {
            ...data,
            product_desc: editorContent,
            product_image1: uploadedImages.image1 ? data.product_image1 : product?.product_image1,
            product_image2: uploadedImages.image2 ? data.product_image2 : product?.product_image2,
            product_image3: uploadedImages.image3 ? data.product_image3 : product?.product_image3,
            product_promo_expired_date: data.product_promo_is_best_deal ? data.product_promo_expired_date : null,
        };

        updateProduct({
            id,
            payload,
        });
    };

    const handleProductStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        setProductStatus(status);

        if (status === 'bestseller') {
            setValue('product_is_bestseller', true);
            setValue('product_is_new_arrival', false);
        } else if (status === 'new_arrival') {
            setValue('product_is_bestseller', false);
            setValue('product_is_new_arrival', true);
        }
    };

    if (isFetching) {
        return <SkeletonProductDetail />;
    }

    return (
        <div className="pt-5">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <button className="btn btn-primary p-2 rounded-full" onClick={() => navigate(-1)}>
                        <IconArrowBackward className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Product Detail</h1>
                        <p className="text-sm text-gray-600">Details for product #{product?.product_id}</p>
                    </div>
                </div>
            </div>

            <div className="panel mb-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Created by:</span>
                            <span className="font-medium">{product?.created_by || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Created at:</span>
                            <span className="font-medium">{product?.product_created_date ? formatDate(product?.product_created_date) : '-'}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Last updated by:</span>
                            <span className="font-medium">{product?.updated_by || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Last updated at:</span>
                            <span className="font-medium">{product?.product_updated_at ? formatDate(product?.product_updated_at) : '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Product Information</h5>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label htmlFor="product_name">
                                Product Name <span className="text-danger">*</span>
                            </label>
                            <input id="product_name" type="text" className="form-input" {...register('product_name')} />
                            {errors.product_name && <span className="text-danger">{errors.product_name.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="product_code">
                                Product Code <span className="text-danger">*</span>
                            </label>
                            <input id="product_code" type="text" className="form-input" {...register('product_code')} />
                            {errors.product_code && <span className="text-danger">{errors.product_code.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="product_price">
                                Price <span className="text-danger">*</span>
                            </label>
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    Rp
                                </div>
                                <Controller
                                    name="product_price"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <NumberFormat
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            id="product_price"
                                            className="form-input rounded-l-none"
                                            placeholder="Enter price"
                                            value={value}
                                            onValueChange={(values) => {
                                                const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                                onChange(Number(numericValue));
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {errors.product_price && <span className="text-danger">{errors.product_price.message}</span>}
                        </div>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="product_promo_is_discount">
                                        Discount <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="product_promo_is_discount"
                                        {...register('product_promo_is_discount', {
                                            setValueAs: (value) => {
                                                if (typeof value === 'boolean') return value;
                                                return value === 'true';
                                            },
                                        })}
                                        className="form-select"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="product_promo_is_best_deal">
                                        Best Deal <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="product_promo_is_best_deal"
                                        {...register('product_promo_is_best_deal', {
                                            setValueAs: (value) => {
                                                if (typeof value === 'boolean') return value;
                                                return value === 'true';
                                            },
                                        })}
                                        className="form-select"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="product_promo_discount_percentage">Discount Percentage (%)</label>
                                    <Controller
                                        control={control}
                                        name="product_promo_discount_percentage"
                                        render={({ field: { onChange, value } }) => (
                                            <NumberFormat
                                                id="product_promo_discount_percentage"
                                                className={!isDiscount ? 'form-input bg-gray-100 dark:bg-gray-700' : 'form-input'}
                                                disabled={!isDiscount}
                                                value={value}
                                                onValueChange={(values) => {
                                                    onChange(Number(values.value));
                                                }}
                                                allowNegative={false}
                                                decimalScale={0}
                                                placeholder="Enter discount percentage"
                                            />
                                        )}
                                    />
                                    {errors.product_promo_discount_percentage && <span className="text-danger">{errors.product_promo_discount_percentage.message}</span>}
                                </div>

                                <div>
                                    <label htmlFor="product_promo_final_price">Final Price</label>
                                    <Controller
                                        control={control}
                                        name="product_promo_final_price"
                                        render={({ field: { onChange, value } }) => (
                                            <div className="flex">
                                                <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp
                                                </div>
                                                <NumberFormat
                                                    id="product_promo_final_price"
                                                    className="form-input rounded-l-none bg-gray-100 dark:bg-gray-700"
                                                    value={value}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    disabled
                                                    onValueChange={(values) => {
                                                        const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                                        onChange(Number(numericValue));
                                                    }}
                                                    allowNegative={false}
                                                    decimalScale={0}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="product_promo_expired_date">Expired Date</label>
                                <input
                                    type="datetime-local"
                                    id="product_promo_expired_date"
                                    className={!isBestDeal ? 'form-input bg-gray-100 dark:bg-gray-700' : 'form-input'}
                                    disabled={!isBestDeal}
                                    {...register('product_promo_expired_date')}
                                />
                                {errors.product_promo_expired_date && <span className="text-danger">{errors.product_promo_expired_date.message}</span>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="product_item_sold">
                                Items Sold <span className="text-danger">*</span>
                            </label>
                            <Controller
                                control={control}
                                name="product_item_sold"
                                render={({ field: { onChange, value } }) => (
                                    <NumberFormat
                                        id="product_item_sold"
                                        className="form-input"
                                        value={value}
                                        onValueChange={(values) => {
                                            onChange(Number(values.value));
                                        }}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                    />
                                )}
                            />
                            {errors.product_item_sold && <span className="text-danger">{errors.product_item_sold.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="product_is_available">
                                    Stock Available <span className="text-danger">*</span>
                                </label>
                                <select
                                    id="product_is_available"
                                    {...register('product_is_available', {
                                        setValueAs: (value) => {
                                            if (typeof value === 'boolean') return value;
                                            return value === 'true';
                                        },
                                    })}
                                    className="form-select"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product_is_show">
                                    Show in Store <span className="text-danger">*</span>
                                </label>
                                <select
                                    id="product_is_show"
                                    {...register('product_is_show', {
                                        setValueAs: (value) => {
                                            if (typeof value === 'boolean') return value;
                                            return value === 'true';
                                        },
                                    })}
                                    className="form-select"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="product_status">
                                    Event <span className="text-danger">*</span>
                                </label>
                                <select id="product_status" className="form-select" value={productStatus} onChange={handleProductStatusChange}>
                                    <option value="bestseller">Best Seller</option>
                                    <option value="new_arrival">New Arrival</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="mb-5">
                        <h5 className="font-semibold text-lg mb-4">Product Tags</h5>
                        <div className="mb-4">
                            <MultipleSelect
                                name="product_tag_names"
                                control={control}
                                options={
                                    tags?.data.map((tag) => ({
                                        value: tag.product_tag_name,
                                        label: tag.product_tag_name,
                                    })) || []
                                }
                                label="Product Tags"
                                placeholder="Pilih atau ketik tag baru"
                                error={errors.product_tag_names?.message}
                            />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Category & Brand</h5>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="brand_id">
                                Brand <span className="text-danger">*</span>
                            </label>
                            <select id="brand_id" className="form-select" {...register('brand_id')}>
                                <option value="">Select Brand</option>
                                {brands?.data.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id} selected={brand.brand_id === product?.brand_id}>
                                        {brand.brand_name}
                                    </option>
                                ))}
                            </select>
                            {errors.brand_id && <span className="text-danger">{errors.brand_id.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="product_category_id">
                                Category <span className="text-danger">*</span>
                            </label>
                            <select
                                id="product_category_id"
                                className="form-select"
                                {...register('product_category_id')}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setValue('product_subcategory_id', '');
                                }}
                            >
                                <option value="">Select Category</option>
                                {categories?.data.map((category) => (
                                    <option key={category.id} value={category.id} selected={category.id === product?.product_category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.product_category_id && <span className="text-danger">{errors.product_category_id.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="product_subcategory_id">
                                Sub Category <span className="text-danger">*</span>
                            </label>
                            <select id="product_subcategory_id" className="form-select" {...register('product_subcategory_id')}>
                                <option value="">Select Sub Category</option>
                                {categories?.data
                                    .find((category) => category.id === selectedCategory)
                                    ?.children?.map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id} selected={subcategory.id === product?.product_subcategory_id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                            </select>
                            {errors.product_subcategory_id && <span className="text-danger">{errors.product_subcategory_id.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Product Images</h5>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex flex-col gap-4">
                                <div className="w-full aspect-square relative border rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview[`image${num}` as keyof typeof imagePreview] || '/assets/images/file-preview.svg'}
                                        alt={`Product Image ${num}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {num === 1 && <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Thumbnail*</div>}
                                    {showImageActions[`image${num}` as keyof typeof showImageActions] && (
                                        <div className="absolute top-2 right-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleImageConfirm(`image${num}` as keyof typeof showImageActions)}
                                                disabled={isUploading[`image${num}` as keyof typeof isUploading]}
                                                className="btn btn-success p-2 !rounded-full"
                                            >
                                                <IconChecks className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleImageCancel(`image${num}` as keyof typeof showImageActions)}
                                                disabled={isUploading[`image${num}` as keyof typeof isUploading]}
                                                className="btn btn-danger p-2 !rounded-full"
                                            >
                                                <IconX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    {isUploading[`image${num}` as keyof typeof isUploading] && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name={`product_image${num}`}
                                    onChange={(e) => handleImageChange(e, `image${num}` as keyof typeof selectedImages)}
                                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold hover:file:bg-primary/90 disabled:bg-[#eee] disabled:cursor-not-allowed"
                                    disabled={uploadedImages[`image${num}` as keyof typeof uploadedImages]}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <label htmlFor="product_desc" className="font-semibold text-lg dark:text-white-light">
                            Product Description <span className="text-danger">*</span>
                        </label>
                    </div>
                    <div className="mb-10">
                        <ReactQuill
                            theme="snow"
                            value={editorContent}
                            onChange={(content) => {
                                setEditorContent(content);
                                setValue('product_desc', content);
                            }}
                            className="h-[200px] mb-10"
                        />
                    </div>
                    {errors.product_desc && <span className="text-danger">{errors.product_desc.message}</span>}
                </div>

                <div className="flex gap-4 justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)} disabled={isUpdatePending}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isUpdatePending}>
                        {isUpdatePending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductDetail;
