import { LoginFormData } from '../schema/loginSchema';
import { LoginResponse } from '../types/api';
import { axiosInstance } from './base';

export const ApiLogin = async (payload: LoginFormData) => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login/admin', payload);
    return response.data;
};
