import { CreateBlogKeywordPayload } from '../schema/blogKeywordsSchema';
import { ApiResponse } from '../types/api';
import { BlogKeyword } from '../types/blogKeywordsType';
import { axiosInstance } from './base';

export const ApiGetAllBlogKeyword = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<BlogKeyword[]>>('/blog-keywords', { params });

    return response.data;
};

export const ApiCreateBlogKeyword = async (payload: CreateBlogKeywordPayload) => {
    const response = await axiosInstance.post<ApiResponse<BlogKeyword>>('/blog-keywords', payload);

    return response.data;
};

export const ApiUpdateBlogKeyword = async (id: string, payload: CreateBlogKeywordPayload) => {
    const response = await axiosInstance.patch<ApiResponse<BlogKeyword>>(`/blog-keywords/${id}`, payload);

    return response.data;
};

export const ApiDeleteBlogKeyword = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<BlogKeyword>>(`/blog-keywords/${id}`);

    return response.data;
};
