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

export const ApiDeleteImage = async (fileName: string) => {
    const response = await axiosInstance.delete<ApiResponse<UploadResponse>>(`/upload-image/blog`, {
        data: {
            fileName,
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

export const ApiUploadImageProduct = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<UploadResponse>>(`/upload-image/product`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const ApiDeleteImageProduct = async (fileName: string) => {
    const response = await axiosInstance.delete<ApiResponse<UploadResponse>>(`/upload-image/product`, {
        data: {
            fileName,
        },
    });
    return response.data;
};

export const ApiUploadImageBannerPopup = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<UploadResponse>>(`/upload-image/banner-popup`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const ApiDeleteImageBannerPopup = async (fileName: string) => {
    const response = await axiosInstance.delete<ApiResponse<UploadResponse>>(`/upload-image/banner-popup`, {
        data: {
            fileName,
        },
    });
    return response.data;
};
