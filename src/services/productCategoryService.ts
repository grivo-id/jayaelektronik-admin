import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateProductCategoryPayload } from '../schema/productCategorySchema';
import { ApiCreateProductCategory, ApiDeleteProductCategory, ApiGetAllProductCategory, ApiUpdateProductCategory } from '../api/productCategoryApi';

export const useGetAllProductCategory = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['product-categories', params],
        queryFn: () => ApiGetAllProductCategory(params),
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

export const useCreateProductCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProductCategoryPayload) => ApiCreateProductCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useUpdateProductCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateProductCategoryPayload }) => ApiUpdateProductCategory(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useDeleteProductCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteProductCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};
