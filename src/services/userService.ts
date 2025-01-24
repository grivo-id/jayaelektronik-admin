import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiCreateUser, ApiGetAllUser, ApiUpdateUser } from '../api/userApi';
import { CreateUserPayload, UpdateUserPayload } from '../schema/userSchema';

export const useGetAllUserQuery = (params: Record<string, any>) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => ApiGetAllUser(params),
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

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateUserPayload) => ApiCreateUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => ApiUpdateUser(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
