import { LoginResponse } from '../types/api';
import { LoginRequest } from '../types/auth';
import { axiosInstance } from './base';

export const ApiLogin = async (payload: LoginRequest) => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);
    return response.data;
};
