import { CreateProductCategoryPayload } from '../schema/productCategorySchema';
import { ApiResponse } from '../types/api';
import { ProductCategory } from '../types/productCategories';
import { axiosInstance } from './base';

export const ApiGetAllProductCategory = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<ProductCategory[]>>('/product-categories/sub-categories', { params });

    return response.data;
};

export const ApiCreateProductCategory = async (payload: CreateProductCategoryPayload) => {
    const response = await axiosInstance.post<ApiResponse<ProductCategory>>('/product-categories', payload);

    return response.data;
};

export const ApiUpdateProductCategory = async (id: string, payload: CreateProductCategoryPayload) => {
    const response = await axiosInstance.put<ApiResponse<ProductCategory>>(`/product-categories/${id}`, payload);

    return response.data;
};

export const ApiDeleteProductCategory = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<ProductCategory>>(`/product-categories/${id}`);

    return response.data;
};
