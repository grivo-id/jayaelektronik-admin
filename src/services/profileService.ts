import { useQuery } from '@tanstack/react-query';
import { ApiGetUserProfile } from '../api/profileApi';

export const useGetUserProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: () => ApiGetUserProfile(),
    });
};
