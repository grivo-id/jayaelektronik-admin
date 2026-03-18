import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ApiGetLoyaltyConfig,
    ApiUpdateLoyaltyConfig,
    ApiGetLoyaltyStats,
    ApiGetAllCustomers,
    ApiCreateCustomerLoyalty,
    ApiGetCustomerDetail,
    ApiAdjustCustomerPoints,
    ApiGetCustomerPointHistory,
    ApiGetAllTiers,
    ApiCreateTier,
    ApiUpdateTier,
    ApiGetAllBonuses,
    ApiCreateBonus,
    ApiUpdateBonus,
    ApiDeleteBonus,
    GetCustomersPayload,
} from '../api/loyaltyApi';

// ==================== LOYALTY CONFIG ====================

export const useGetLoyaltyConfig = () => {
    return useQuery({
        queryKey: ['loyaltyConfig'],
        queryFn: () => ApiGetLoyaltyConfig(),
        select: (response) => response.data,
    });
};

export const useUpdateLoyaltyConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { point_conversion_rate?: number; is_active?: boolean; birthday_bonus_points?: number }) => ApiUpdateLoyaltyConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyConfig'] });
            queryClient.invalidateQueries({ queryKey: ['loyaltyStats'] });
        },
    });
};

// ==================== LOYALTY STATS ====================

export const useGetLoyaltyStats = () => {
    return useQuery({
        queryKey: ['loyaltyStats'],
        queryFn: () => ApiGetLoyaltyStats(),
        select: (response) => response.data,
        refetchInterval: 60000, // Refetch every minute
    });
};

// ==================== CUSTOMERS ====================

export const useGetAllCustomers = (params: Record<string, any>, body?: GetCustomersPayload) => {
    return useQuery({
        queryKey: ['loyaltyCustomers', params, body],
        queryFn: () => ApiGetAllCustomers(params, body),
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

export const useGetCustomerDetail = (userId: string) => {
    return useQuery({
        queryKey: ['loyaltyCustomer', userId],
        queryFn: () => ApiGetCustomerDetail(userId),
        select: (response) => response.data,
        enabled: !!userId,
    });
};

export const useCreateCustomerLoyalty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { user_id: string; tier_id: string }) => ApiCreateCustomerLoyalty(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyCustomers'] });
        },
    });
};
export const useAdjustCustomerPoints = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { customer_loyalty_id: string; points_amount: number; reason: string }) => ApiAdjustCustomerPoints(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyCustomers'] });
            queryClient.invalidateQueries({ queryKey: ['loyaltyCustomer'] });
            queryClient.invalidateQueries({ queryKey: ['loyaltyPointHistory'] });
            queryClient.invalidateQueries({ queryKey: ['loyaltyStats'] });
        },
    });
};

export const useGetCustomerPointHistory = (userId: string, params: Record<string, any>) => {
    return useQuery({
        queryKey: ['loyaltyPointHistory', userId, params],
        queryFn: () => ApiGetCustomerPointHistory(userId, params),
        select: (response) => {
            const { data, pagination } = response;
            return {
                data,
                pagination,
            };
        },
        enabled: !!userId,
        placeholderData: keepPreviousData,
    });
};

// ==================== TIERS ====================

export const useGetAllTiers = () => {
    return useQuery({
        queryKey: ['loyaltyTiers'],
        queryFn: () => ApiGetAllTiers(),
        select: (response) => response.data,
    });
};

export const useCreateTier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { tier_name: string; tier_order: number; min_lifetime_spending: number; max_lifetime_spending: number | null; point_multiplier: number; has_free_shipping: boolean }) =>
            ApiCreateTier(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyTiers'] });
        },
    });
};
export const useUpdateTier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tierId, data }: { tierId: string; data: any }) => ApiUpdateTier(tierId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyTiers'] });
        },
    });
};

// ==================== BONUSES ====================

export const useGetAllBonuses = () => {
    return useQuery({
        queryKey: ['loyaltyBonuses'],
        queryFn: () => ApiGetAllBonuses(),
        select: (response) => response.data,
    });
};

export const useCreateBonus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => ApiCreateBonus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyBonuses'] });
        },
    });
};

export const useUpdateBonus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bonusId, data }: { bonusId: string; data: any }) => ApiUpdateBonus(bonusId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyBonuses'] });
        },
    });
};

export const useDeleteBonus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bonusId: string) => ApiDeleteBonus(bonusId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyaltyBonuses'] });
        },
    });
};
