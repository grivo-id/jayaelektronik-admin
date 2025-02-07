import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateCoupon, ApiDeleteCoupon, ApiGetAllCoupon, ApiUpdateCoupon } from '../api/coupon';
import { CreateCouponPayload } from '../schema/couponSchema';

export const useGetAllCouponQuery = (params: any) => {
    return useQuery({
        queryKey: ['coupons', params],
        queryFn: () => ApiGetAllCoupon(params),
        placeholderData: keepPreviousData,
    });
};

export const useCreateCoupon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCouponPayload) => ApiCreateCoupon(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
    });
};

export const useUpdateCoupon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateCouponPayload }) => ApiUpdateCoupon(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
    });
};

export const useDeleteCoupon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteCoupon(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
    });
};
