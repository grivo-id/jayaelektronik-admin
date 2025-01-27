import { ApiResponse } from '../types/api';
import { ProductTag } from '../types/productTagType';
import { axiosInstance } from './base';

export const ApiGetAllProductTag = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<ProductTag[]>>('/product-tags', { params });

    return response.data;
};
