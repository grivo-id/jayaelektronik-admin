import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiGetAllProductTag } from '../api/productTag';

export const useGetAllProductTag = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['product-tags', params],
        queryFn: () => ApiGetAllProductTag(params),
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
