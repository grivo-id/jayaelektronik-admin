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

    const { data: product, isLoading } = useGetProductByIdQuery(id as string);
    const { data: categories } = useGetAllProductCategory({});
    const { data: brands } = useGetAllBrandQuery({ page: 1, limit: 1000 });
    const { data: tags } = useGetAllProductTag({ page: 1, limit: 1000 });
    const updateProduct = useUpdateProductMutation();

    const UpdateProductSchema = useMemo(() => getUpdateProductSchema(), []);

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
    const discountPercentage = watch('product_promo_discount_percentage');

    useEffect(() => {
        dispatch(setPageTitle('Edit Product'));
    }, []);

    useEffect(() => {
        if (!isDiscount) {
            setValue('product_promo_discount_percentage', 0);
            setValue('product_promo_final_price', productPrice || 0);
            setValue('product_promo_expired_date', null);
        }
    }, [isDiscount]);

    useEffect(() => {
        if (isDiscount && productPrice && discountPercentage) {
            const finalPrice = productPrice - (productPrice * discountPercentage) / 100;
            setValue('product_promo_final_price', finalPrice);
        }
    }, [isDiscount, productPrice, discountPercentage]);

    useEffect(() => {
        if (product) {
            // Set form values
            setValue('product_name', product.product_name);
            setValue('product_code', product.product_code);
            setValue('product_price', product.product_price);
            setValue('product_item_sold', product.product_item_sold);
            setValue('product_desc', product.product_desc);
            setValue('product_is_available', product.product_is_available);
            setValue('product_is_show', product.product_is_show);
            setValue('product_is_bestseller', product.product_is_bestseller);
            setValue('product_is_new_arrival', product.product_is_new_arrival);
            setValue('brand_id', product.brand_id);
            setValue('product_category_id', product.product_category_id);
            setValue('product_subcategory_id', product.product_subcategory_id);
            setValue('product_tag_names', product.product_tags?.map((tag) => tag.product_tag_name) || []);

            // Set promo values
            if (product.product_promo) {
                setValue('product_promo_is_best_deal', product.product_promo.product_promo_is_best_deal);
                setValue('product_promo_is_discount', product.product_promo.product_promo_is_discount);
                setValue('product_promo_discount_percentage', product.product_promo.product_promo_discount_percentage);
                setValue('product_promo_final_price', product.product_promo.product_promo_final_price);
                setValue('product_promo_expired_date', product.product_promo.product_promo_expired_date || null);
            }

            // Set image values
            setValue('product_image1', product.product_image1);
            setValue('product_image2', product.product_image2);
            setValue('product_image3', product.product_image3);

            // Set selected category for filtering subcategories
            setSelectedCategory(product.product_category_id);

            // Set image previews
            setImagePreview({
                image1: product.product_image1,
                image2: product.product_image2,
                image3: product.product_image3,
            });
        }
    }, [product]);

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

        try {
            await updateProduct.mutateAsync({
                id,
                payload: {
                    ...data,
                    product_promo_expired_date: data.product_promo_expired_date || null,
                },
            });
            navigate('/admin/manage-product');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pt-5">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl">Edit Product</h2>
                <button type="button" className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Product Information</h5>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label htmlFor="product_name">Product Name</label>
                            <input id="product_name" type="text" className="form-input" {...register('product_name')} />
                            {errors.product_name && <span className="text-danger">{errors.product_name.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="product_code">Product Code</label>
                            <input id="product_code" type="text" className="form-input" {...register('product_code')} />
                            {errors.product_code && <span className="text-danger">{errors.product_code.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="product_price">Price</label>
                            <Controller
                                name="product_price"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex">
                                        <div className="bg-[#eee] flex justify-center items-center rounded-l-md  px-3 font-semibold border border-r-0  border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                            Rp
                                        </div>
                                        <NumberFormat
                                            {...field}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            id="product_price"
                                            className="form-input rounded-l-none"
                                            placeholder="Masukkan harga"
                                            onValueChange={(values) => {
                                                const numericValue = values.value.replace(/\./g, '').replace(',', '.');
                                                field.onChange(Number(numericValue));
                                            }}
                                        />
                                    </div>
                                )}
                            />
                            {errors.product_price && <span className="text-danger">{errors.product_price.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="product_desc">Description</label>
                            <textarea id="product_desc" className="form-textarea" {...register('product_desc')} />
                            {errors.product_desc && <span className="text-danger">{errors.product_desc.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="product_is_available">Available</label>
                                <select id="product_is_available" className="form-select" {...register('product_is_available')}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product_is_show">Show in Store</label>
                                <select id="product_is_show" className="form-select" {...register('product_is_show')}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="product_is_bestseller">Bestseller</label>
                                <select id="product_is_bestseller" className="form-select" {...register('product_is_bestseller')}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product_is_new_arrival">New Arrival</label>
                                <select id="product_is_new_arrival" className="form-select" {...register('product_is_new_arrival')}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
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
                                        src={imagePreview[`image${num}` as keyof typeof imagePreview] || '/assets/images/placeholder.jpg'}
                                        alt={`Product Image ${num}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, `image${num}` as keyof typeof selectedImages)}
                                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold hover:file:bg-primary/90"
                                />
                                {showImageActions[`image${num}` as keyof typeof showImageActions] && (
                                    <div className="flex gap-2">
                                        <button type="button" className="btn btn-sm btn-primary" onClick={() => handleImageConfirm(`image${num}` as keyof typeof selectedImages)}>
                                            Confirm
                                        </button>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleImageCancel(`image${num}` as keyof typeof selectedImages)}>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel">
                    <div className="mb-5">
                        <h5 className="font-semibold text-lg mb-4">Product Promotion</h5>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="product_promo_is_discount">Discount</label>
                                    <select
                                        id="product_promo_is_discount"
                                        {...register('product_promo_is_discount', {
                                            setValueAs: (value) => value === 'true',
                                        })}
                                        className="form-select"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="product_promo_is_best_deal">Best Deal</label>
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
                                                value={!isDiscount ? 0 : value}
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
                                        render={({ field: { value } }) => (
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
                                    className={!isDiscount ? 'form-input bg-gray-100 dark:bg-gray-700' : 'form-input'}
                                    disabled={!isDiscount}
                                    {...register('product_promo_expired_date')}
                                />
                                {errors.product_promo_expired_date && <span className="text-danger">{errors.product_promo_expired_date.message}</span>}
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
                            <label htmlFor="brand_id">Brand</label>
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
                            <label htmlFor="product_category_id">Category</label>
                            <select
                                id="product_category_id"
                                className="form-select"
                                {...register('product_category_id')}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setValue('product_subcategory_id', ''); // Reset sub category when category changes
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
                            <label htmlFor="product_subcategory_id">Sub Category</label>
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

                <div className="flex gap-4 justify-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductDetail;
