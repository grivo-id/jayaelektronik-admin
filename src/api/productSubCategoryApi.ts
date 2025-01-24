import { CreateProductSubCategoryPayload } from '../schema/productSubCategorySchema';
import { ApiResponse } from '../types/api';
import { ProductSubCategory } from '../types/productSubCategories';
import { axiosInstance } from './base';

export const ApiGetAllProductSubCategory = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<ProductSubCategory[]>>('/product-subcategories', { params });

    return response.data;
};

export const ApiCreateProductSubCategory = async (payload: CreateProductSubCategoryPayload) => {
    const response = await axiosInstance.post<ApiResponse<ProductSubCategory>>('/product-subcategories', payload);

    return response.data;
};

export const ApiUpdateProductSubCategory = async (id: string, payload: CreateProductSubCategoryPayload) => {
    const response = await axiosInstance.put<ApiResponse<ProductSubCategory>>(`/product-subcategories/${id}`, payload);

    return response.data;
};

export const ApiDeleteProductSubCategory = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<ProductSubCategory>>(`/product-subcategories/${id}`);

    return response.data;
};
