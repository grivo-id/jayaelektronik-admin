import { ApiResponse } from '../types/api';
import { Blog } from '../types/blogs';
import { axiosInstance } from './base';

export const ApiGetAllBlog = async () => {
    const response = await axiosInstance.get<ApiResponse<Blog[]>>('/blogs');

    return response.data;
};
