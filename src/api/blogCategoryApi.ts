import { CreateBlogCategoryPayload } from '../schema/blogCategoriesShema';
import { ApiResponse } from '../types/api';
import { BlogCategory } from '../types/blogCategories';
import { axiosInstance } from './base';

export const ApiGetAllBlogCategory = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<BlogCategory[]>>('/blog-categories', { params });

    return response.data;
};

export const ApiCreateBlogCategory = async (payload: CreateBlogCategoryPayload) => {
    const response = await axiosInstance.post<ApiResponse<BlogCategory[]>>('/blog-categories', payload);

    return response.data;
};

export const ApiUpdateBlogCategory = async (id: string, payload: CreateBlogCategoryPayload) => {
    const response = await axiosInstance.patch<ApiResponse<BlogCategory[]>>(`/blog-categories/${id}`, payload);

    return response.data;
};

export const ApiDeleteBlogCategory = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<BlogCategory[]>>(`/blog-categories/${id}`);

    return response.data;
};
