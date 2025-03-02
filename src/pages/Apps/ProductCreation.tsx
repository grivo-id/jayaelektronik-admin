import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAllProductCategory } from '../../services/productCategoryService';
import { useGetAllBrandQuery } from '../../services/brandsService';
import { useGetAllProductTag } from '../../services/productTagService';
import { MultipleSelect } from '../../components';
import { NumericFormat as NumberFormat } from 'react-number-format';
import { useForm, Controller } from 'react-hook-form';
import { ApiUploadImageProduct } from '../../api/uploadApi';
import IconCheck from '../../components/Icon/IconChecks';
import IconX from '../../components/Icon/IconX';
import { CreateProductPayload, getCreateProductSchema } from '../../schema/productSchema';
import { useCreateProductMutation, useGetProductPromoTypes } from '../../services/productService';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PriceSection from '../../components/product/PriceSection';

const ProductCreation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productStatus, setProductStatus] = useState('none');

    const [previewImages, setPreviewImages] = useState({
        image1: '/assets/images/file-preview.svg',
        image2: '/assets/images/file-preview.svg',
        image3: '/assets/images/file-preview.svg',
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const [selectedImages, setSelectedImages] = useState<{
        image1: File | null;
        image2: File | null;
        image3: File | null;
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

    const [editorContent, setEditorContent] = useState('');

    const { mutate: createProduct, isPending: createProductPending } = useCreateProductMutation();
    const { data: categories } = useGetAllProductCategory({});
    const { data: brands } = useGetAllBrandQuery({ page: 1, limit: 1000 });
    const { data: tags } = useGetAllProductTag({ page: 1, limit: 1000 });
    const { data: promoTypes } = useGetProductPromoTypes();

    const [promoType, setPromoType] = useState('');

    const createProductSchema = useMemo(() => getCreateProductSchema(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm<CreateProductPayload>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            product_is_available: false,
            product_is_show: false,
            product_is_bestseller: false,
            product_is_new_arrival: false,
            product_tag_names: [],
            product_promo_is_best_deal: false,
            product_promo_is_discount: false,
            product_promo_discount_percentage: 0,
            product_promo_final_price: 0,
            product_promo_expired_date: null,
            product_promo_type: '',
        },
    });

    const handleProductStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        setProductStatus(status);

        if (status === 'bestseller') {
            setValue('product_is_bestseller', true);
            setValue('product_is_new_arrival', false);
        } else if (status === 'new_arrival') {
            setValue('product_is_bestseller', false);
            setValue('product_is_new_arrival', true);
        } else {
            setValue('product_is_bestseller', false);
            setValue('product_is_new_arrival', false);
        }
    };

    const productPrice = watch('product_price');
    const isDiscount = watch('product_promo_is_discount');
    const isBestDeal = watch('product_promo_is_best_deal');
    const discountPercentage = watch('product_promo_discount_percentage');

    useEffect(() => {
        dispatch(setPageTitle('Create Product'));
    }, []);

    useEffect(() => {
        if (isDiscount && productPrice && discountPercentage) {
            const finalPrice = productPrice - (productPrice * discountPercentage) / 100;
            setValue('product_promo_final_price', finalPrice);
        }
    }, [isDiscount, productPrice, discountPercentage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image1' | 'image2' | 'image3') => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImages((prev) => ({ ...prev, [imageKey]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages((prev) => ({
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
        setPreviewImages((prev) => ({
            ...prev,
            [imageKey]: '/assets/images/file-preview.svg',
        }));
        setShowImageActions((prev) => ({ ...prev, [imageKey]: false }));
        setValue(`product_${imageKey}`, null);
        setUploadedImages((prev) => ({ ...prev, [imageKey]: false }));

        const fileInput = document.querySelector(`input[name="product_${imageKey}"]`) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const onSubmit = async (data: CreateProductPayload) => {
        createProduct({ ...data, product_desc: editorContent });
    };

    const disabledInputClass = 'form-input bg-[#eee] cursor-not-allowed dark:bg-[#1b2e4b]';

    return (
        <div className="pt-5">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <button className="btn btn-primary p-2 rounded-full" onClick={() => navigate(-1)}>
                        <IconArrowBackward className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Product Creation</h1>
                        <p className="text-sm text-gray-600">Create a new product</p>
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
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input id="product_name" type="text" className="form-input" {...register('product_name')} />
                            {errors.product_name && <span className="text-danger">{errors.product_name.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="product_code">
                                Product Code <span className="text-red-500">*</span>
                            </label>
                            <input id="product_code" type="text" className="form-input" {...register('product_code')} />
                            {errors.product_code && <span className="text-danger">{errors.product_code.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="product_item_sold">
                                Items Sold <span className="text-red-500">*</span>
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
                                    Stock Available <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="product_is_available"
                                    {...register('product_is_available', {
                                        setValueAs: (value) => value === 'true',
                                    })}
                                    className="form-select"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product_is_show">
                                    Show in Store <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="product_is_show"
                                    {...register('product_is_show', {
                                        setValueAs: (value) => value === 'true',
                                    })}
                                    className="form-select"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="product_status">
                                    Event <span className="text-red-500">*</span>
                                </label>
                                <select id="product_status" className="form-select" value={productStatus} onChange={handleProductStatusChange}>
                                    <option value="none">None</option>
                                    <option value="bestseller">Best Seller</option>
                                    <option value="new_arrival">New Arrival</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product_promo_is_best_deal">
                                    Best Deal <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="product_promo_is_best_deal"
                                    {...register('product_promo_is_best_deal', {
                                        setValueAs: (value) => value === 'true',
                                    })}
                                    className="form-select"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Product Price</h5>
                    </div>

                    <PriceSection control={control} register={register} setValue={setValue} watch={watch} errors={errors} promoTypes={promoTypes} />
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Product Tags</h5>
                    </div>

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
                            placeholder="Choose or type new tag"
                            error={errors.product_tag_names?.message}
                        />
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Category & Brand</h5>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="brand_id">
                                Brand <span className="text-red-500">*</span>
                            </label>
                            <select id="brand_id" className="form-select" {...register('brand_id')}>
                                <option value="">Select Brand</option>
                                {brands?.data.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>
                                        {brand.brand_name}
                                    </option>
                                ))}
                            </select>
                            {errors.brand_id && <span className="text-danger">{errors.brand_id.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="product_category_id">
                                Category <span className="text-red-500">*</span>
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
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.product_category_id && <span className="text-danger">{errors.product_category_id.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="product_subcategory_id">
                                Sub Category <span className="text-red-500">*</span>
                            </label>
                            <select id="product_subcategory_id" className="form-select" {...register('product_subcategory_id')}>
                                <option value="">Select Sub Category</option>
                                {categories?.data
                                    .find((category) => category.id === selectedCategory)
                                    ?.children?.map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
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
                                    <img src={previewImages[`image${num}` as keyof typeof previewImages]} alt={`Product Image ${num}`} className="w-full h-full object-cover" />
                                    {num === 1 && <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Thumbnail*</div>}
                                    {showImageActions[`image${num}` as keyof typeof showImageActions] && (
                                        <div className="absolute top-2 right-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleImageConfirm(`image${num}` as keyof typeof showImageActions)}
                                                disabled={isUploading[`image${num}` as keyof typeof isUploading]}
                                                className="btn btn-success p-2 !rounded-full"
                                            >
                                                <IconCheck className="w-4 h-4" />
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
                                {errors[`product_image${num}` as keyof typeof errors] && <span className="text-danger">{errors[`product_image${num}` as keyof typeof errors]?.message}</span>}
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
                            className="h-[200px]"
                        />
                    </div>
                    {errors.product_desc && <span className="text-danger mt-1 inline-block">{errors.product_desc.message}</span>}
                </div>

                <div className="flex gap-4 justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)} disabled={createProductPending}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={createProductPending}>
                        {createProductPending ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductCreation;
