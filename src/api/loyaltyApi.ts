import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';
import { LoyaltyConfig, LoyaltyTier, CustomerLoyalty, PointTransaction, LoyaltyBonus, PointRedemption, TierVoucher, LoyaltyStats } from '../types/loyaltyType';

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

export const ApiGetCustomerDetail = async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<CustomerLoyalty>>(`/admin/loyalty/customers/${userId}`);
    return response.data;
};

export const ApiAdjustCustomerPoints = async (data: { user_id: string; points_amount: number; reason: string }) => {
    const response = await axiosInstance.post<ApiResponse<PointTransaction>>('/admin/loyalty/points/adjust', data);
    return response.data;
};

export const ApiCreateCustomerLoyalty = async (data: { user_id: string; tier_id: string }) => {
    const response = await axiosInstance.post<ApiResponse<CustomerLoyalty>>('/admin/loyalty/customers', data);
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
    has_free_shipping: boolean;
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
        has_free_shipping?: boolean;
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

// ==================== REDEMPTIONS ====================

export interface CreateRedemptionPayload {
    redemption_name: string;
    points_required: number;
    discount_amount: number;
    max_redemption_per_order: number;
}

export const ApiGetAllRedemptions = async () => {
    const response = await axiosInstance.get<ApiResponse<PointRedemption[]>>('/admin/loyalty/redemptions');
    return response.data;
};

export const ApiCreateRedemption = async (data: CreateRedemptionPayload) => {
    const response = await axiosInstance.post<ApiResponse<PointRedemption>>('/admin/loyalty/redemptions', data);
    return response.data;
};

export const ApiUpdateRedemption = async (redemptionId: string, data: Partial<CreateRedemptionPayload> & { is_active?: boolean }) => {
    const response = await axiosInstance.put<ApiResponse<PointRedemption>>(`/admin/loyalty/redemptions/${redemptionId}`, data);
    return response.data;
};

export const ApiDeleteRedemption = async (redemptionId: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/admin/loyalty/redemptions/${redemptionId}`);
    return response.data;
};

// ==================== VOUCHERS ====================

export interface CreateVoucherPayload {
    tier_id: string;
    voucher_code: string;
    voucher_name: string;
    voucher_type: 'PERCENTAGE' | 'FIXED';
    voucher_value: number;
    max_discount?: number;
    min_transaction?: number;
    usage_limit?: number;
    valid_from: string;
    valid_until?: string;
}

export const ApiGetAllVouchers = async () => {
    const response = await axiosInstance.get<ApiResponse<TierVoucher[]>>('/admin/loyalty/vouchers');
    return response.data;
};

export const ApiCreateVoucher = async (data: CreateVoucherPayload) => {
    const response = await axiosInstance.post<ApiResponse<TierVoucher>>('/admin/loyalty/vouchers', data);
    return response.data;
};

export const ApiUpdateVoucher = async (voucherId: string, data: Partial<CreateVoucherPayload> & { is_active?: boolean }) => {
    const response = await axiosInstance.put<ApiResponse<TierVoucher>>(`/admin/loyalty/vouchers/${voucherId}`, data);
    return response.data;
};

export const ApiDeleteVoucher = async (voucherId: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/admin/loyalty/vouchers/${voucherId}`);
    return response.data;
};
