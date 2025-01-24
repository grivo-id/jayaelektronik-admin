import { ApiResponse } from '../types/api';
import { UserProfile } from '../types/userProfile';
import { axiosInstance } from './base';
import { UpdateUserProfilePayload } from '../schema/userSchema';

export const ApiGetUserProfile = async () => {
    const response = await axiosInstance.get<ApiResponse<UserProfile>>('/users/profile');
    return response.data;
};

export const ApiUpdateUserProfile = async (id: string, payload: UpdateUserProfilePayload) => {
    const response = await axiosInstance.patch<ApiResponse<UserProfile>>(`/users/${id}`, payload);
    return response.data;
};
