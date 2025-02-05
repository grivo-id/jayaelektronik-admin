import { ApiResponse } from '../types/api';
import { DashboardStatistics } from '../types/dashboard';
import { axiosInstance } from './base';

export const ApiGetDashboardStatistics = async (): Promise<ApiResponse<DashboardStatistics>> => {
    const response = await axiosInstance.get<ApiResponse<DashboardStatistics>>('/dashboard/statistics');
    return response.data;
};
