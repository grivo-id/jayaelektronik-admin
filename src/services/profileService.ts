import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiGetUserProfile, ApiResetPasswordManager, ApiUpdateUserProfile } from '../api/profileApi';
import { UpdateUserProfilePayload } from '../schema/userSchema';

export const useGetUserProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: () => ApiGetUserProfile(),
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateUserProfilePayload }) => ApiUpdateUserProfile(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });
};

export const useResetPasswordManager = () => {
    return useMutation({
        mutationFn: (id: string) => ApiResetPasswordManager(id),
    });
};
