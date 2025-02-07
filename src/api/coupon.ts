import { CreateCouponPayload } from '../schema/couponSchema';
import { ApiResponse } from '../types/api';
import { Coupon } from '../types/coupon';
import { axiosInstance } from './base';

export const ApiGetAllCoupon = async (params?: Record<string, any>): Promise<ApiResponse<Coupon[]>> => {
    const response = await axiosInstance.get('/coupon-discounts', { params });
    return response.data;
};

export const ApiGetCouponById = async (id: string): Promise<ApiResponse<Coupon>> => {
    const response = await axiosInstance.get(`/coupon-discounts/${id}`);
    return response.data;
};

export const ApiCreateCoupon = async (payload: CreateCouponPayload): Promise<ApiResponse<Coupon>> => {
    const response = await axiosInstance.post('/coupon-discounts', payload);
    return response.data;
};

export const ApiUpdateCoupon = async (id: string, payload: CreateCouponPayload): Promise<ApiResponse<Coupon>> => {
    const response = await axiosInstance.patch(`/coupon-discounts/${id}`, payload);
    return response.data;
};

export const ApiDeleteCoupon = async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/coupon-discounts/${id}`);
    return response.data;
};
