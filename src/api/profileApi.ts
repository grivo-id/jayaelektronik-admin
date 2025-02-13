import { ApiResponse } from '../types/api';
import { UserProfile } from '../types/userProfile';
import { axiosInstance } from './base';
import { UpdateUserProfilePayload } from '../schema/userSchema';

export const ApiGetUserProfile = async () => {
    const response = await axiosInstance.get<ApiResponse<UserProfile>>('/users/profile');
    return response.data;
};

export const ApiUpdateUserProfile = async (payload: UpdateUserProfilePayload) => {
    const response = await axiosInstance.patch<ApiResponse<UserProfile>>(`/users`, payload);
    return response.data;
};

export const ApiResetPasswordManager = async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<UserProfile>>(`/users/reset-password/${id}`);
    return response.data;
};
