import { CreateProductPayload, UpdateProductPayload } from '../schema/productSchema';
import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';

interface GetAllProductPayload {
    brand_slugs?: string[];
    sub_category_slugs?: string[];
}

export const ApiGetAllProduct = async (params: Record<string, any>, body?: GetAllProductPayload) => {
    const response = await axiosInstance.post<ApiResponse<Product[]>>('/products/all', body, {
        params,
    });

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

export const ApiUpdateProduct = async (productId: string, payload: UpdateProductPayload) => {
    const response = await axiosInstance.patch<ApiResponse<Product>>(`/products/${productId}`, payload);
    return response.data;
};
export const ApiDeleteProduct = async (productId: string) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(`/products/${productId}`);
    return response.data;
};

export const ApiDeleteProductBulk = async (productIds: string[]) => {
    const response = await axiosInstance.post<ApiResponse<null>>('/products/delete/bulk', {
        product_id: productIds,
    });
    return response.data;
};
