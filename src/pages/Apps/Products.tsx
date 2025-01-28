import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainHeader, Pagination, SkeletonLoadingTable, Tooltip } from '../../components';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllProduct } from '../../api/productApi';
import { useDeleteProductMutation, useGetAllProductQuery } from '../../services/productService';
import formatDate from '../../utils/formatDate';
import formatRupiah from '../../utils/formatToRupiah';
import { Badge } from '../../components/Badge';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import Swal from 'sweetalert2';

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const [queryParams, setQueryParams] = useState({
        limit: 10,
        page: Number(searchParams.get('page')) || 1,
        search: searchParams.get('search') || '',
        sort: 'desc',
    });

    const { data: { data: productData, pagination } = { data: [], pagination: {} }, isFetching, isPlaceholderData } = useGetAllProductQuery(queryParams);
    const { mutate: mutateDeleteProduct } = useDeleteProductMutation();

    useEffect(() => {
        dispatch(setPageTitle('Products Management'));
    }, []);

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
                queryKey: ['products', nextPageParams],
                queryFn: () => ApiGetAllProduct(nextPageParams),
            });
        }
    }, [queryParams, productData, isPlaceholderData, queryClient]);

    const handleDeleteProduct = (productId: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'This product will be permanently deleted',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            padding: '2em',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the product.',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    },
                });
                mutateDeleteProduct(productId, {
                    onSuccess: () => {
                        Swal.fire('Success', 'Product has been deleted', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Failed to delete product', 'error');
                    },
                });
            }
        });
    };
    return (
        <div>
            <MainHeader
                title="Products Management"
                subtitle="Manage and view all products"
                onSearchChange={handleSearchChange}
                search={search}
                onAdd={() => navigate('/admin/manage-product/create')}
                addText="Add New"
            />
            <>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Info</th>
                                    <th>Price & Promo</th>
                                    <th>Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            {isFetching ? (
                                <SkeletonLoadingTable rows={11} columns={5} />
                            ) : productData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <p className="text-lg font-semibold text-gray-500">No products found</p>
                                                <p className="text-sm text-gray-400">No products registered yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {productData.map((product) => {
                                        const hasPromo = product.product_promo !== null && (product.product_promo.product_promo_is_discount || product.product_promo.product_promo_is_best_deal);

                                        return (
                                            <tr key={product.product_code}>
                                                <td className="whitespace-nowrap">
                                                    <div className="w-20 h-20">
                                                        <img
                                                            src={product.product_image1}
                                                            alt={product.product_name}
                                                            className="w-full h-full object-contain rounded-lg border"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = '/assets/images/placeholder.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <div className="flex flex-col gap-3">
                                                        <div>
                                                            <h3 className="font-semibold text-base text-primary">{product.product_name}</h3>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <span>{product.product_code}</span>
                                                                <span>•</span>
                                                                <span>{product.brand_name}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{product.product_category_name}</span>
                                                            <span className="text-xs text-gray-500">{product.product_subcategory_name}</span>
                                                        </div>

                                                        {product.product_tags && product.product_tags.length > 0 && product.product_tags[0].product_tag_name && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {product.product_tags.map((tag, idx) => (
                                                                    <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                                        {tag.product_tag_name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex flex-col">
                                                            {hasPromo ? (
                                                                <>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-success font-semibold">{formatRupiah(product.product_promo.product_promo_final_price)}</span>
                                                                        {product.product_promo.product_promo_is_discount && (
                                                                            <Badge color="warning">-{product.product_promo.product_promo_discount_percentage}%</Badge>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs line-through text-gray-500">{formatRupiah(product.product_price)}</span>
                                                                </>
                                                            ) : (
                                                                <span className="font-semibold">{formatRupiah(product.product_price)}</span>
                                                            )}
                                                        </div>

                                                        {hasPromo && (
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    {product.product_promo.product_promo_is_best_deal && <Badge color="primary">Best Deal</Badge>}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{product.product_item_sold} Sold</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium min-w-[100px]">Availability:</span>
                                                                <Badge color={product.product_is_available ? 'success' : 'danger'}>{product.product_is_available ? 'Yes' : 'No'}</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium min-w-[100px]">Visibility:</span>
                                                                <Badge color={product.product_is_show ? 'success' : 'danger'}>{product.product_is_show ? 'Yes' : 'No'}</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium min-w-[100px]">Bestseller:</span>
                                                                <Badge color={product.product_is_bestseller ? 'success' : 'danger'}>{product.product_is_bestseller ? 'Yes' : 'No'}</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium min-w-[100px]">New Arrival:</span>
                                                                <Badge color={product.product_is_new_arrival ? 'success' : 'danger'}>{product.product_is_new_arrival ? 'Yes' : 'No'}</Badge>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium min-w-[100px]">Best Deal:</span>
                                                                    <Badge color={product.product_promo?.product_promo_is_best_deal ? 'success' : 'danger'}>
                                                                        {product.product_promo?.product_promo_is_best_deal ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {product.product_promo?.product_promo_expired_date && (
                                                                    <div className="flex items-center gap-2  mt-1">
                                                                        <span className="text-xs text-gray-500">Expired: {formatDate(product.product_promo.product_promo_expired_date)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col text-xs text-gray-500">
                                                            <span>Created: {formatDate(product.product_created_date)}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    <div className="flex gap-2 items-center justify-center">
                                                        <Tooltip text="Edit Product" position="top">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary p-2"
                                                                onClick={() => navigate(`/admin/manage-product/${product.product_id}`)}
                                                            >
                                                                <IconPencil className="w-4 h-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text="Delete Product" position="top">
                                                            <button type="button" className="btn btn-sm btn-outline-danger p-2" onClick={() => handleDeleteProduct(product.product_id)}>
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
        </div>
    );
};

export default Products;
