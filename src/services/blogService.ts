import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateBlog, ApiGetAllBlog } from '../api/blogsApi';
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

export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBlogPayload) => ApiCreateBlog(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};
