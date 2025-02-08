import { useQuery } from '@tanstack/react-query';
import { ApiGetDashboardStatistics } from '../api/dashboard';

export const useGetDashboardStatistics = () => {
    return useQuery({
        queryKey: ['dashboardStatistics'],
        queryFn: ApiGetDashboardStatistics,
    });
};
