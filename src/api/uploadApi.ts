import { ApiResponse, UploadResponse } from '../types/api';
import { axiosInstance } from './base';

export const ApiUploadImageBlog = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<UploadResponse>>(`/upload-image/blog`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const ApiUploadImageBrand = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<UploadResponse>>(`/upload-image/brand`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
