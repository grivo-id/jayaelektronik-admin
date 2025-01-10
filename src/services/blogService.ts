import { useQuery } from '@tanstack/react-query';
import { ApiGetAllBlog } from '../api/blogApi';

export const useGetAllBlogQuery = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: ApiGetAllBlog,
        select: (response) => response.data,
    });
};
