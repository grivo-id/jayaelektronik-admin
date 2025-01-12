import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateBlogKeyword, ApiDeleteBlogKeyword, ApiGetAllBlogKeyword, ApiUpdateBlogKeyword } from '../api/blogKeywordsApi';
import { CreateBlogKeywordPayload } from '../schema/blogKeywordsSchema';

export const useGetAllBlogKeyword = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['blog-keywords', params],
        queryFn: () => ApiGetAllBlogKeyword(params),
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

export const useCreateBlogKeyword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBlogKeywordPayload) => ApiCreateBlogKeyword(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-keywords'] });
        },
    });
};

export const useUpdateBlogKeyword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateBlogKeywordPayload }) => ApiUpdateBlogKeyword(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-keywords'] });
        },
    });
};

export const useDeleteBlogKeyword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteBlogKeyword(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-keywords'] });
        },
    });
};
