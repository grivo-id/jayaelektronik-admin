import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateProduct, ApiDeleteProduct, ApiDeleteProductBulk, ApiGetAllProduct, ApiGetProductById, ApiGetProductByIdForAdmin, ApiGetProductPromoTypes, ApiUpdateProduct } from '../api/productApi';
import { CreateProductPayload, UpdateProductPayload } from '../schema/productSchema';
import { useNavigate } from 'react-router-dom';

interface GetAllProductQueryBody {
    brand_slugs?: string[];
    sub_category_slugs?: string[];
}

export const useGetAllProductQuery = (params: Record<string, any>, body?: GetAllProductQueryBody) => {
    return useQuery({
        queryKey: ['products', params, body],
        queryFn: () => ApiGetAllProduct(params, body),
        select: (response) => {
            const { data, pagination } = response;
            return {
                data,
                pagination,
            };
        },
        placeholderData: keepPreviousData,
    });
};

export const useGetProductByIdQuery = (productId: string) => {
    return useQuery({
        queryKey: ['products', productId],
        queryFn: () => ApiGetProductById(productId),
        select: (response) => response.data,
    });
};

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (payload: CreateProductPayload) => ApiCreateProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate('/admin/manage-product');
        },
    });
};

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) => ApiUpdateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate(-1);
        },
    });
};

export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => ApiDeleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useDeleteProductBulkMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productIds: string[]) => ApiDeleteProductBulk(productIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useGetProductPromoTypes = () => {
    return useQuery({
        queryKey: ['product-promo-types'],
        queryFn: () => ApiGetProductPromoTypes(),
        select: (response) => response.data,
    });
};

export const useGetProductByIdForAdminQuery = (productId: string) => {
    return useQuery({
        queryKey: ['products', 'admin', productId],
        queryFn: () => ApiGetProductByIdForAdmin(productId),
        select: (response) => response.data,
    });
};
