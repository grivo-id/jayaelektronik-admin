import { ApiResponse, QueryParams } from '../types/api';
import { Blog } from '../types/blogsType';
import { axiosInstance } from './base';
import { CreateBlogPayload } from '../schema/blogsSchema';

export const ApiGetAllBlog = async (params: QueryParams) => {
    const response = await axiosInstance.get<ApiResponse<Blog[]>>('/blogs', { params });
    return response.data;
};

export const ApiGetBlogById = async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Blog>>(`/blogs?blog_id=${id}`);
    return response.data;
};

export const ApiCreateBlog = async (payload: CreateBlogPayload) => {
    const response = await axiosInstance.post<ApiResponse<Blog>>('/blogs', payload);
    return response.data;
};

export const ApiDeleteBlog = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<Blog>>(`/blogs/${id}`);

    return response.data;
};
