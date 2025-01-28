import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateProduct, ApiGetAllProduct, ApiGetProductById } from '../api/productApi';
import { CreateProductPayload } from '../schema/productSchema';
import { useNavigate } from 'react-router-dom';

export const useGetAllProductQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => ApiGetAllProduct(params),
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
        queryKey: ['product', productId],
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
