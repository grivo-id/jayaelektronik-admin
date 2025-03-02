import { ChangePasswordPayload, CreateUserPayload, UpdateUserPayload } from '../schema/userSchema';
import { ApiResponse } from '../types/api';
import { UserProfile } from '../types/userProfile';
import { axiosInstance } from './base';

export const ApiGetAllUser = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<UserProfile[]>>('/users', { params });

    return response.data;
};

export const ApiCreateUser = async (payload: CreateUserPayload) => {
    const response = await axiosInstance.post<ApiResponse<UserProfile>>('/users', payload);

    return response.data;
};

export const ApiUpdateUser = async (id: string, payload: UpdateUserPayload) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(`/users/manage/${id}`, payload);

    return response.data;
};

export const ApiChangePassword = async (payload: ChangePasswordPayload) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>('/users/change-pass', payload);

    return response.data;
};

export const ApiDeleteUser = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<UserProfile>>(`/users/${id}`);

    return response.data;
};

export const ApiResetUserPassword = async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<UserProfile>>(`/users/reset-password/user/${id}`);

    return response.data;
};
