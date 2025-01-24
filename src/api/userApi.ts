import { CreateUserPayload, UpdateUserPayload } from '../schema/userSchema';
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
