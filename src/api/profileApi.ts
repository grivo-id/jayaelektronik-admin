import { ApiResponse } from '../types/api';
import { UserProfile } from '../types/userProfile';
import { axiosInstance } from './base';

export const ApiGetUserProfile = async () => {
    const response = await axiosInstance.get<ApiResponse<UserProfile>>('/users/profile');
    return response.data;
};
