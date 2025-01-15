import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateBrand, ApiDeleteBrand, ApiGetAllBrand, ApiUpdateBrand, ApiUpdateBrandVisibility } from '../api/brandsApi';
import { CreateBrandPayload } from '../schema/brandsSchema';

export const useGetAllBrandQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['brands', params],
        queryFn: () => ApiGetAllBrand(params),
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

export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBrandPayload) => ApiCreateBrand(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateBrandPayload }) => ApiUpdateBrand(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteBrand(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};

export const useToggleVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiUpdateBrandVisibility(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};
