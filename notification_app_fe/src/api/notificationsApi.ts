import { Log, setLoggerToken } from "../../../logging_middleware/src/logger";
import type {
  NotificationFilters,
  NotificationItem,
  NotificationType
} from "../types";

const NOTIFICATION_API_URL = "/evaluation-service/notifications";

const token = import.meta.env.VITE_EVALUATION_ACCESS_TOKEN || "";
console.log("Frontend token loaded:", token ? "yes" : "no");
setLoggerToken(token);

const typeWeight: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function normalizeNotification(item: any): NotificationItem {
  return {
    ID: item.ID || item.id,
    Type: item.Type || item.type,
    Message: item.Message || item.message,
    Timestamp: item.Timestamp || item.timestamp || item.createdAt,
    isRead: item.isRead || false,
    viewed: item.viewed || false
  };
}

function getTimeValue(timestamp: string) {
  return new Date(timestamp.replace(" ", "T")).getTime();
}

export async function fetchNotifications(filters: NotificationFilters) {
  if (!token) {
    throw new Error("Access token is missing");
  }

  const params = new URLSearchParams();
  params.append("limit", String(filters.limit));
  params.append("page", String(filters.page));

  if (filters.notificationType !== "All") {
    params.append("notification_type", filters.notificationType);
  }

  await Log("frontend", "info", "api", "fetching notifications");

  const response = await fetch(`${NOTIFICATION_API_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    await Log("frontend", "error", "api", "failed to fetch notifications");
    throw new Error(`Failed to fetch notifications. Status: ${response.status}`);
  }

  const data = await response.json();
  const rawNotifications = data.notifications || data.data || data || [];

  await Log("frontend", "info", "api", "notifications fetched successfully");

  return rawNotifications.map(normalizeNotification);
}

export function getPriorityNotifications(
  notifications: NotificationItem[],
  limit: number,
  notificationType: string
) {
  return notifications
    .filter((item) => {
      const isUnread = !item.isRead && !item.viewed;
      const matchesType =
        notificationType === "All" || item.Type === notificationType;

      return isUnread && matchesType;
    })
    .map((item) => {
      const notificationTime = getTimeValue(item.Timestamp);
      const hoursOld = (Date.now() - notificationTime) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 100 - hoursOld);

      return {
        ...item,
        priorityScore: typeWeight[item.Type] * 1000 + recencyScore
      };
    })
    .sort((a, b) => {
      if ((b.priorityScore || 0) !== (a.priorityScore || 0)) {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      }

      return getTimeValue(b.Timestamp) - getTimeValue(a.Timestamp);
    })
    .slice(0, limit);
}