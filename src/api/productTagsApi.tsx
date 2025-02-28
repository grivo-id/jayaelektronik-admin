import { CreateProductTagPayload } from '../schema/productTagsSchema';
import { ApiResponse } from '../types/api';
import { ProductTag } from '../types/productTags';
import { axiosInstance } from './base';

export const ApiGetAllProductTag = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<ProductTag[]>>('/product-tags', { params });
    return response.data;
};

export const ApiCreateProductTag = async (payload: CreateProductTagPayload) => {
    const response = await axiosInstance.post<ApiResponse<ProductTag>>('/product-tags', payload);
    return response.data;
};

export const ApiUpdateProductTag = async (id: string, payload: CreateProductTagPayload) => {
    const response = await axiosInstance.patch<ApiResponse<ProductTag>>(`/product-tags/${id}`, payload);
    return response.data;
};

export const ApiDeleteProductTag = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<ProductTag>>(`/product-tags/${id}`);
    return response.data;
};
