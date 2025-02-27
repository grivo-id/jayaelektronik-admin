import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateProductTag, ApiDeleteProductTag, ApiGetAllProductTag, ApiUpdateProductTag } from '../api/productTagsApi';
import { CreateProductTagPayload } from '../schema/productTagsSchema';

export const useGetAllProductTag = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['product-tags', params],
        queryFn: () => ApiGetAllProductTag(params),
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

export const useCreateProductTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProductTagPayload) => ApiCreateProductTag(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-tags'] });
        },
    });
};

export const useUpdateProductTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateProductTagPayload }) => ApiUpdateProductTag(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-tags'] });
        },
    });
};

export const useDeleteProductTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteProductTag(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-tags'] });
        },
    });
};
