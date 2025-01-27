import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateProductCategoryPayload } from '../schema/productCategorySchema';
import { ApiCreateProductCategory, ApiDeleteProductCategory, ApiGetAllProductCategory, ApiUpdateProductCategory } from '../api/productCategoryApi';
import { CreateProductSubCategoryPayload } from '../schema/productSubCategorySchema';
import { ApiCreateProductSubCategory, ApiDeleteProductSubCategory, ApiUpdateProductSubCategory } from '../api/productSubCategoryApi';
import { ProductCategory } from '../types/productCategories';

export const useGetAllProductCategory = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['product-categories', params],
        queryFn: () => ApiGetAllProductCategory(params),
        select: (response) => {
            const { data, pagination } = response;
            const processedData = data.map((category: ProductCategory) => ({
                ...category,
                children: category.children?.map((child) => ({
                    ...child,
                    parent_id: category.id,
                })),
            }));

            return {
                data: processedData,
                pagination,
            };
        },
        placeholderData: keepPreviousData,
    });
};

export const useCreateProductCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProductCategoryPayload) => ApiCreateProductCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useUpdateProductCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateProductCategoryPayload }) => ApiUpdateProductCategory(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useDeleteProductCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteProductCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useCreateProductSubCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProductSubCategoryPayload) => ApiCreateProductSubCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useUpdateProductSubCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateProductSubCategoryPayload }) => ApiUpdateProductSubCategory(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};

export const useDeleteProductSubCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ApiDeleteProductSubCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] });
        },
    });
};
