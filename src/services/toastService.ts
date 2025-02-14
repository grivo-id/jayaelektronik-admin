import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateToast, ApiDeleteToast, ApiGetAllToast, ApiGetToastById, ApiUpdateToast } from '../api/toastApi';
import { CreateToastPayload } from '../schema/toastSchema';

export const useGetAllToastQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['toasts', params],
        queryFn: () => ApiGetAllToast(params),
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

export const useGetToastByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['toasts', id],
        queryFn: () => ApiGetToastById(id),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useCreateToast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateToastPayload) => ApiCreateToast(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toasts'] });
        },
    });
};

export const useUpdateToast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateToastPayload }) => ApiUpdateToast(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toasts'] });
        },
    });
};

export const useDeleteToast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteToast(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toasts'] });
        },
    });
};
