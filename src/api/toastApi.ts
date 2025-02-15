import { ApiResponse } from '../types/api';
import { Toast } from '../types/announcer';
import { axiosInstance } from './base';
import { CreateToastPayload } from '../schema/toastSchema';

export const ApiGetAllToast = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<Toast[]>>('/toast-announcers', { params });

    return response.data;
};

export const ApiGetToastById = async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Toast>>(`/toast-announcers/${id}`);

    return response.data;
};

export const ApiCreateToast = async (payload: CreateToastPayload) => {
    const response = await axiosInstance.post<ApiResponse<Toast>>('/toast-announcers', payload);

    return response.data;
};

export const ApiUpdateToast = async (id: string, payload: CreateToastPayload) => {
    const response = await axiosInstance.put<ApiResponse<Toast>>(`/toast-announcers/${id}`, payload);

    return response.data;
};

export const ApiDeleteToast = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<Toast>>(`/toast-announcers/${id}`);

    return response.data;
};
