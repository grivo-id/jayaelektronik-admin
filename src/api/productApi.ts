import { CreateProductPayload } from '../schema/productSchema';
import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';

export const ApiGetAllProduct = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/products', { params });

    return response.data;
};

export const ApiGetProductById = async (productId: string) => {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products`, {
        params: { product_id: productId },
    });

    return response.data;
};

export const ApiCreateProduct = async (payload: CreateProductPayload) => {
    const response = await axiosInstance.post<ApiResponse<Product>>('/products', payload);
    return response.data;
};
