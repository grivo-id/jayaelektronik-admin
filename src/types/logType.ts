export interface IActivityLogAttributes {
  activity_log_id: string;
  actor_type: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  old_values: any | null;
  new_values: any | null;
  ip_address: string | null;
  created_at: string;
}

export interface IActivityLogFilters {
  page?: number;
  limit?: number;
  actor_type?: string;
  action?: string;
  entity_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}
