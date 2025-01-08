import axios from 'axios';
import { LoginResponse } from '../types/api';
import { LoginRequest } from '../types/auth';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (payload: LoginRequest) => {
    const response = await axiosInstance.post<LoginResponse>('/v1/onboard/login', payload);
    return response.data;
};
