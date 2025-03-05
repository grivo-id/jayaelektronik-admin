import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateBannerPopup, ApiDeleteBannerPopup, ApiGetAllBannerPopup, ApiToggleBannerPopupVisibility, ApiUpdateBannerPopup } from '../api/bannerPopupApi';
import { CreateBannerPopupPayload } from '../schema/bannerPopupSchema';

export const useGetAllBannerPopupQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['banner-popups', params],
        queryFn: () => ApiGetAllBannerPopup(params),
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

export const useCreateBannerPopup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBannerPopupPayload) => ApiCreateBannerPopup(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner-popups'] });
        },
    });
};

export const useUpdateBannerPopup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateBannerPopupPayload }) => ApiUpdateBannerPopup(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner-popups'] });
        },
    });
};

export const useDeleteBannerPopup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteBannerPopup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner-popups'] });
        },
    });
};

export const useToggleBannerPopupVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isShow }: { id: string; isShow: boolean }) => ApiToggleBannerPopupVisibility(id, isShow),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner-popups'] });
        },
    });
};
