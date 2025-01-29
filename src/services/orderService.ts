import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiGetAllOrder, ApiGetOrderById, ApiUpdateOrderCompletion, ApiUpdateOrderUserVerified } from '../api/orderApi';

export const useGetAllOrderQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['orders', params],
        queryFn: () => ApiGetAllOrder(params),
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

export const useToggleComplete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiUpdateOrderCompletion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useToggleVerified = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiUpdateOrderUserVerified(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useGetOrderByIdQuery = (orderId: string) => {
    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: () => ApiGetOrderById(orderId),
        select: (response) => response.data,
    });
};
