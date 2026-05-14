import { axiosInstance } from './base';

export const ApiGetAllActivityLogs = async (params: {
  page?: number;
  limit?: number;
  actor_type?: string;
  action?: string;
  entity_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  const response = await axiosInstance.get("/admin/logs", { params });
  return response.data;
};

export const ApiGetActivityLogDetail = async (activityLogId: string) => {
  const response = await axiosInstance.get(`/admin/logs/${activityLogId}`);
  return response.data;
};

export const ApiPurgeOldLogs = async (days?: number) => {
  const response = await axiosInstance.post("/admin/logs/purge", null, {
    params: { days },
  });
  return response.data;
};
