import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';
import { LoyaltyConfig, LoyaltyTier, CustomerLoyalty, PointTransaction, LoyaltyBonus, LoyaltyStats } from '../types/loyaltyType';

// ==================== LOYALTY CONFIG ====================

export const ApiGetLoyaltyConfig = async () => {
    const response = await axiosInstance.get<ApiResponse<LoyaltyConfig>>('/admin/loyalty/config');
    return response.data;
};

export const ApiUpdateLoyaltyConfig = async (data: { point_conversion_rate?: number; is_active?: boolean; birthday_bonus_points?: number }) => {
    const response = await axiosInstance.put<ApiResponse<LoyaltyConfig>>('/admin/loyalty/config', data);
    return response.data;
};

// ==================== LOYALTY STATS ====================

export const ApiGetLoyaltyStats = async () => {
    const response = await axiosInstance.get<ApiResponse<LoyaltyStats>>('/admin/loyalty/stats');
    return response.data;
};

// ==================== CUSTOMERS ====================

export interface GetCustomersPayload {
    page?: number;
    limit?: number;
    search?: string;
    tier_id?: string;
}

export const ApiGetAllCustomers = async (params: Record<string, any>, body?: GetCustomersPayload) => {
    const allParams = {
        ...params,
        ...(body || {}),
    };

    // Filter out empty values
    const filteredParams = Object.fromEntries(Object.entries(allParams).filter(([_, value]) => value !== null && value !== undefined && value !== ''));

    const response = await axiosInstance.get<ApiResponse<CustomerLoyalty[]>>('/admin/loyalty/customers', { params: filteredParams });
    return response.data;
};

export interface UserNotInLoyalty {
    user_id: string;
    user_email: string;
    user_fname: string;
    user_lname: string;
    user_phone: string | null;
    role_code: string;
    role_name: string;
}

export const ApiGetUsersNotInLoyalty = async (params: { page?: number; limit?: number; search?: string }) => {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await axiosInstance.get<ApiResponse<UserNotInLoyalty[]>>('/admin/loyalty/users/not-in-loyalty', { params: filteredParams });
    return response.data;
};

export const ApiGetCustomerDetail = async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<CustomerLoyalty>>(`/admin/loyalty/customers/${userId}`);
    return response.data;
};

export const ApiAdjustCustomerPoints = async (data: { user_id?: string; customer_loyalty_id?: string; email?: string; points_amount: number; reason: string }) => {
    const response = await axiosInstance.post<ApiResponse<PointTransaction>>('/admin/loyalty/points/adjust', data);
    return response.data;
};

export const ApiCreateCustomerLoyalty = async (data: { user_id: string; tier_id: string }) => {
    const response = await axiosInstance.post<ApiResponse<CustomerLoyalty>>('/admin/loyalty/customers', data);
    return response.data;
};

export const ApiUpdateCustomerTier = async (data: { customer_loyalty_id: string; tier_id: string }) => {
    const response = await axiosInstance.put<ApiResponse<CustomerLoyalty>>('/admin/loyalty/customers/tier', data);
    return response.data;
};

export const ApiGetCustomerPointHistory = async (userId: string, params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<PointTransaction[]>>(`/admin/loyalty/customers/${userId}/history`, { params });
    return response.data;
};

// ==================== TIERS ====================

export const ApiGetAllTiers = async () => {
    const response = await axiosInstance.get<ApiResponse<LoyaltyTier[]>>('/admin/loyalty/tiers');
    return response.data;
};

export const ApiCreateTier = async (data: {
    tier_name: string;
    tier_order: number;
    min_lifetime_spending: number;
    max_lifetime_spending: number | null;
    point_multiplier: number;
    discount_enabled: boolean;
    discount_percentage: number;
}) => {
    const response = await axiosInstance.post<ApiResponse<LoyaltyTier>>('/admin/loyalty/tiers', data);
    return response.data;
};

export const ApiUpdateTier = async (
    tierId: string,
    data: {
        tier_name?: string;
        min_lifetime_spending?: number;
        max_lifetime_spending?: number | null;
        point_multiplier?: number;
        discount_enabled?: boolean;
        discount_percentage?: number;
    },
) => {
    const response = await axiosInstance.put<ApiResponse<LoyaltyTier>>(`/admin/loyalty/tiers/${tierId}`, data);
    return response.data;
};

// ==================== BONUSES ====================

export interface CreateBonusPayload {
    bonus_type: 'DOUBLE_POINT' | 'FLASH_BONUS' | 'BIRTHDAY_BONUS' | 'SPECIAL_EVENT';
    bonus_name: string;
    bonus_description?: string;
    bonus_multiplier?: number;
    bonus_fixed_points?: number;
    start_date: string;
    end_date?: string;
}

export const ApiGetAllBonuses = async () => {
    const response = await axiosInstance.get<ApiResponse<LoyaltyBonus[]>>('/admin/loyalty/bonuses');
    return response.data;
};

export const ApiCreateBonus = async (data: CreateBonusPayload) => {
    const response = await axiosInstance.post<ApiResponse<LoyaltyBonus>>('/admin/loyalty/bonuses', data);
    return response.data;
};

export const ApiUpdateBonus = async (bonusId: string, data: Partial<CreateBonusPayload> & { is_active?: boolean }) => {
    const response = await axiosInstance.put<ApiResponse<LoyaltyBonus>>(`/admin/loyalty/bonuses/${bonusId}`, data);
    return response.data;
};

export const ApiDeleteBonus = async (bonusId: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/admin/loyalty/bonuses/${bonusId}`);
    return response.data;
};
