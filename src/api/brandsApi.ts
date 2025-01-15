import { CreateBrandPayload } from '../schema/brandsSchema';
import { ApiResponse } from '../types/api';
import { Brand } from '../types/brandsType';
import { axiosInstance } from './base';

export const ApiGetAllBrand = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<Brand[]>>('/brands', { params });

    return response.data;
};

export const ApiCreateBrand = async (payload: CreateBrandPayload) => {
    const response = await axiosInstance.post<ApiResponse<Brand>>('/brands', payload);

    return response.data;
};

export const ApiUpdateBrand = async (id: string, payload: CreateBrandPayload) => {
    const response = await axiosInstance.patch<ApiResponse<Brand>>(`/brands/${id}`, payload);

    return response.data;
};

export const ApiDeleteBrand = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<Brand>>(`/brands/${id}`);

    return response.data;
};

export const ApiUpdateBrandVisibility = async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<Brand>>(`/brands/visibility/${id}`);

    return response.data;
};
