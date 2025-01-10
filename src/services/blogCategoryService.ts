import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateBlogCategory, ApiDeleteBlogCategory, ApiGetAllBlogCategory, ApiUpdateBlogCategory } from '../api/blogCategoryApi';
import { CreateBlogCategoryPayload } from '../schema/blogCategoriesShema';

export const useGetAllBlogCategoryQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['blog-categories', params],
        queryFn: () => ApiGetAllBlogCategory(params),
        select: (response) => {
            const { data, pagination } = response;
            return {
                data,
                pagination,
            };
        },
    });
};

export const useCreateBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBlogCategoryPayload) => ApiCreateBlogCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
        },
    });
};

export const useUpdateBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateBlogCategoryPayload }) => ApiUpdateBlogCategory(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
        },
    });
};

export const useDeleteBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteBlogCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
        },
    });
};
