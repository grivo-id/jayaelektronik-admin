'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { MainHeader } from '../../components';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import IconChevronDown from '../../components/Icon/IconChevronDown';
import IconMinus from '../../components/Icon/IconMinus';
import IconX from '../../components/Icon/IconX';
import {
    useGetAllProductCategory,
    useCreateProductCategory,
    useUpdateProductCategory,
    useDeleteProductCategory,
    useCreateProductSubCategory,
    useDeleteProductSubCategory,
    useUpdateProductSubCategory,
} from '../../services/productCategoryService';
import { ProductCategory, ProductSubCategory } from '../../types/productCategories';
import { CreateProductCategoryPayload, getCreateProductCategorySchema } from '../../schema/productCategorySchema';
import { CreateProductSubCategoryPayload, getCreateProductSubCategorySchema } from '../../schema/productSubCategorySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Loader } from '../../components';

interface CategoryItemProps {
    category: ProductCategory | ProductSubCategory;
    onEditCategory?: (category: ProductCategory) => void;
    onDeleteCategory?: (id: string) => void;
    onEditSubCategory?: (subCategory: ProductSubCategory) => void;
    onDeleteSubCategory?: (subCategory: ProductSubCategory) => void;
    isSubCategory?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    onEditCategory = () => {},
    onDeleteCategory = () => {},
    onEditSubCategory = () => {},
    onDeleteSubCategory = () => {},
    isSubCategory = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="mb-3">
            <div className="flex items-center">
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-primary p-1">
                    {isExpanded ? <IconMinus className="w-5 h-5" /> : <IconChevronDown className="w-5 h-5" />}
                </button>
                <div className="flex items-center mx-3">
                    <button
                        className="btn btn-outline-primary p-2 mr-2"
                        onClick={() => (isSubCategory && onEditSubCategory ? onEditSubCategory(category as ProductSubCategory) : onEditCategory && onEditCategory(category as ProductCategory))}
                    >
                        <IconPencil className="w-5 h-5" />
                    </button>
                    <button
                        className="btn btn-outline-danger p-2"
                        onClick={() => (isSubCategory && onDeleteSubCategory ? onDeleteSubCategory(category as ProductSubCategory) : onDeleteCategory && onDeleteCategory(category.id))}
                    >
                        <IconTrash className="w-5 h-5" />
                    </button>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-lg">{category.name}</span>
            </div>
            {isExpanded && !isSubCategory && (category as ProductCategory)?.children && (category as ProductCategory).children?.length > 0 && (
                <div className="ml-3 mt-3 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                    {(category as ProductCategory).children.map((child) => (
                        <CategoryItem key={child.id} category={child} onEditSubCategory={onEditSubCategory} onDeleteSubCategory={onDeleteSubCategory} isSubCategory />
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductCategoriesTree = () => {
    const dispatch = useDispatch();
    const queryParams = {
        limit: 1000,
        page: 1,
        search: '',
        sort: 'desc',
    };

    const { data: { data: productCategoriesData } = { data: [], pagination: {} }, isFetching } = useGetAllProductCategory(queryParams);
    const { mutate: createProductCategory, isPending: createProductCategoryPending } = useCreateProductCategory();
    const { mutate: updateProductCategory, isPending: updateProductCategoryPending } = useUpdateProductCategory();
    const { mutate: deleteProductCategory, isPending: deleteProductCategoryPending } = useDeleteProductCategory();
    const { mutate: createProductSubCategory, isPending: createProductSubCategoryPending } = useCreateProductSubCategory();
    const { mutate: updateProductSubCategory, isPending: updateProductSubCategoryPending } = useUpdateProductSubCategory();
    const { mutate: deleteProductSubCategory, isPending: deleteProductSubCategoryPending } = useDeleteProductSubCategory();

    const [showLoader, setShowLoader] = useState<boolean>(false);

    const isLoading =
        createProductCategoryPending ||
        updateProductCategoryPending ||
        deleteProductCategoryPending ||
        createProductSubCategoryPending ||
        updateProductSubCategoryPending ||
        deleteProductSubCategoryPending;

    const [formType, setFormType] = useState<'category' | 'subcategory' | null>(null);
    const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ProductSubCategory | null>(null);

    const createProductCategorySchema = useMemo(() => getCreateProductCategorySchema(), []);
    const createProductSubCategorySchema = useMemo(() => getCreateProductSubCategorySchema(), []);

    const {
        register: registerCategory,
        handleSubmit: handleSubmitCategory,
        formState: { errors: errorsCategory },
        reset: resetCategory,
    } = useForm<CreateProductCategoryPayload>({
        resolver: zodResolver(createProductCategorySchema),
        mode: 'onBlur',
    });

    const {
        register: registerSubCategory,
        handleSubmit: handleSubmitSubCategory,
        formState: { errors: errorsSubCategory },
        reset: resetSubCategory,
    } = useForm<CreateProductSubCategoryPayload>({
        resolver: zodResolver(createProductSubCategorySchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        dispatch(setPageTitle('Product Categories'));
    }, []);

    const onSubmitCategory = (data: CreateProductCategoryPayload) => {
        if (selectedCategory) {
            updateProductCategory(
                {
                    id: (selectedCategory as ProductCategory).id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setAddCategoryModal(false);
                        resetCategory();
                        setSelectedCategory(null);
                        setFormType(null);
                    },
                }
            );
        } else {
            createProductCategory(data, {
                onSuccess: () => {
                    setAddCategoryModal(false);
                    resetCategory();
                    setFormType(null);
                },
            });
        }
    };

    const onSubmitSubCategory = (data: CreateProductSubCategoryPayload) => {
        if (selectedCategory) {
            updateProductSubCategory(
                {
                    id: (selectedCategory as ProductSubCategory).id,
                    payload: data,
                },
                {
                    onSuccess: () => {
                        setAddCategoryModal(false);
                        resetSubCategory();
                        setSelectedCategory(null);
                        setFormType(null);
                    },
                }
            );
        } else {
            createProductSubCategory(data, {
                onSuccess: () => {
                    setAddCategoryModal(false);
                    resetSubCategory();
                    setSelectedCategory(null);
                    setFormType(null);
                },
            });
        }
    };

    const handleEditCategory = (category: ProductCategory) => {
        setSelectedCategory(category);
        setFormType('category');
        resetCategory();

        registerCategory('product_category_name', { value: category.name });
        registerCategory('product_category_desc', { value: category.desc });
        setAddCategoryModal(true);
    };

    const handleEditSubCategory = (subCategory: ProductSubCategory) => {
        setSelectedCategory(subCategory);
        setFormType('subcategory');
        resetSubCategory();
        registerSubCategory('product_category_id', { value: subCategory.parent_id });
        registerSubCategory('product_subcategory_name', { value: subCategory.name });
        setAddCategoryModal(true);
    };

    const handleDeleteCategory = (categoryId: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Deleted data cannot be recovered!',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            padding: '2em',
            customClass: {
                popup: 'sweet-alerts',
            },
        }).then((result) => {
            if (result.value) {
                setShowLoader(true);
                deleteProductCategory(categoryId, {
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

    const handleDeleteSubCategory = (subCategory: ProductSubCategory) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Deleted data cannot be recovered!',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            padding: '2em',
            customClass: {
                popup: 'sweet-alerts',
            },
        }).then((result) => {
            if (result.value) {
                setShowLoader(true);
                deleteProductSubCategory(subCategory.id, {
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
        setFormType(null);
        resetCategory();
        resetSubCategory();
        setSelectedCategory(null);
    };

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <MainHeader
                title="Manage Product Categories"
                subtitle="Organize and oversee product and sub-categories to organize your product"
                addText="Add New"
                onAdd={() => setAddCategoryModal(true)}
                onSearchChange={() => {}}
                search={''}
            />

            <Dialog as="div" open={addCategoryModal} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-[black]/60" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button type="button" onClick={closeModal} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {formType === null ? 'Choose Type' : formType === 'category' ? 'Add Category' : 'Add Subcategory'}
                            </div>
                            <div className="p-5">
                                {formType === null && !selectedCategory ? (
                                    <div className="flex flex-col gap-4">
                                        <button type="button" className="btn btn-primary w-full" onClick={() => setFormType('category')}>
                                            Add Category
                                        </button>
                                        <button type="button" className="btn btn-info w-full" onClick={() => setFormType('subcategory')}>
                                            Add Subcategory
                                        </button>
                                    </div>
                                ) : formType === 'category' ? (
                                    <form onSubmit={handleSubmitCategory(onSubmitCategory)} className="space-y-5">
                                        <div className="mb-5">
                                            <label htmlFor="name" className="flex items-center">
                                                Category Name
                                                <span className="text-danger text-base">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                className={`form-input ${errorsCategory.product_category_name ? 'error' : ''}`}
                                                placeholder="Enter Category Name"
                                                {...registerCategory('product_category_name')}
                                            />
                                            {errorsCategory.product_category_name && <span className="text-danger text-sm mt-1">{errorsCategory.product_category_name.message}</span>}
                                        </div>
                                        <div>
                                            <label htmlFor="desc">Description</label>
                                            <textarea id="desc" className="form-textarea" placeholder="Enter Category Description" {...registerCategory('product_category_desc')} />
                                            {errorsCategory.product_category_desc && <span className="text-danger">{errorsCategory.product_category_desc.message}</span>}
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
                                ) : (
                                    <form onSubmit={handleSubmitSubCategory(onSubmitSubCategory)} className="space-y-5">
                                        <div className="mb-5">
                                            <label htmlFor="product_category_id" className="flex items-center">
                                                Category
                                                <span className="text-danger text-base">*</span>
                                            </label>
                                            <select
                                                id="product_category_id"
                                                className={`form-select ${errorsSubCategory.product_category_id ? 'error' : ''}`}
                                                {...registerSubCategory('product_category_id')}
                                            >
                                                <option value="">Choose a Category</option>
                                                {productCategoriesData?.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errorsSubCategory.product_category_id && <span className="text-danger text-sm mt-1">{errorsSubCategory.product_category_id.message}</span>}
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="subcategory_name" className="flex items-center">
                                                Sub Category Name
                                                <span className="text-danger text-base">*</span>
                                            </label>
                                            <input
                                                id="subcategory_name"
                                                type="text"
                                                className={`form-input ${errorsSubCategory.product_subcategory_name ? 'error' : ''}`}
                                                placeholder="Enter Sub Category Name"
                                                {...registerSubCategory('product_subcategory_name')}
                                            />
                                            {errorsSubCategory.product_subcategory_name && <span className="text-danger text-sm mt-1">{errorsSubCategory.product_subcategory_name.message}</span>}
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
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            {showLoader && <Loader />}

            <div className="panel mt-6">
                {productCategoriesData.map((category: ProductCategory) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onEditSubCategory={handleEditSubCategory}
                        onDeleteSubCategory={handleDeleteSubCategory}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCategoriesTree;
