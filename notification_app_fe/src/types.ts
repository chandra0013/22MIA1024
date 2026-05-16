export type NotificationType = "Placement" | "Result" | "Event";

export type NotificationTypeFilter = "All" | NotificationType;

export interface NotificationItem {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
  viewed?: boolean;
  priorityScore?: number;
}

export interface NotificationFilters {
  limit: number;
  page: number;
  notificationType: NotificationTypeFilter;
}