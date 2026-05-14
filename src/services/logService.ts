import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ApiGetAllActivityLogs,
  ApiGetActivityLogDetail,
  ApiPurgeOldLogs,
} from "../api/logApi";

export const useGetAllActivityLogs = (params: {
  page?: number;
  limit?: number;
  actor_type?: string;
  action?: string;
  entity_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => ApiGetAllActivityLogs(params),
  });
};

export const useGetActivityLogDetail = (activityLogId: string) => {
  return useQuery({
    queryKey: ["activity-log", activityLogId],
    queryFn: () => ApiGetActivityLogDetail(activityLogId),
    enabled: !!activityLogId,
  });
};

export const usePurgeOldLogs = () => {
  return useMutation({
    mutationFn: (days?: number) => ApiPurgeOldLogs(days),
  });
};
