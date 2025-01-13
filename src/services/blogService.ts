import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateBlog, ApiDeleteBlog, ApiGetAllBlog, ApiGetBlogById } from '../api/blogsApi';
import { CreateBlogPayload } from '../schema/blogsSchema';
import { QueryParams } from '../types/api';

export const useGetAllBlogQuery = (params: QueryParams) => {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: () => ApiGetAllBlog(params),
        select: (response) => {
            const { data, pagination } = response;
            return {
                data,
                pagination,
            };
        },
        placeholderData: keepPreviousData,
    });
};

export const useGetBlogByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['blog', id],
        queryFn: () => ApiGetBlogById(id),
        placeholderData: keepPreviousData,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBlogPayload) => ApiCreateBlog(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};
