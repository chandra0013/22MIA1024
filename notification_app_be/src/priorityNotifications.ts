import * as dotenv from "dotenv";
import { join } from "path";
import { Log, setLoggerToken } from "../../logging_middleware/src/logger";

dotenv.config({ path: join(__dirname, "../.env") });

const NOTIFICATION_API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const token = process.env.EVALUATION_ACCESS_TOKEN || "";
setLoggerToken(token);

type NotificationType = "Placement" | "Result" | "Event";

interface NotificationItem {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
  viewed?: boolean;
}

interface PriorityNotification extends NotificationItem {
  priorityScore: number;
}

const typeWeight: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function getPriorityScore(notification: NotificationItem): number {
  const weight = typeWeight[notification.Type] || 0;
  const notificationTime = new Date(notification.Timestamp).getTime();
  const hoursOld = (Date.now() - notificationTime) / (1000 * 60 * 60);

  const recencyScore = Math.max(0, 100 - hoursOld);

  return weight * 1000 + recencyScore;
}

export async function getPriorityNotifications(limit: number = 10) {
  if (!token) {
    throw new Error("Access token is missing");
  }

  try {
    await Log(
      "backend",
      "info",
      "service",
      "fetching notifications for priority calculation"
    );

    const response = await fetch(NOTIFICATION_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      await Log(
        "backend",
        "error",
        "service",
        "failed to fetch notifications from evaluation api"
      );

      throw new Error(`Notification API failed with status ${response.status}`);
    }

    const data = await response.json();
    const notifications: NotificationItem[] = data.notifications || [];

    const unreadNotifications = notifications.filter(
      (item) => !item.isRead && !item.viewed
    );

    const priorityNotifications: PriorityNotification[] = unreadNotifications
      .map((item) => ({
        ...item,
        priorityScore: getPriorityScore(item)
      }))
      .sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore;
        }

        return (
          new Date(b.Timestamp).getTime() -
          new Date(a.Timestamp).getTime()
        );
      })
      .slice(0, limit);

    await Log(
      "backend",
      "info",
      "service",
      "priority notifications calculated successfully"
    );

    return priorityNotifications;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "service",
      "error while calculating priority notifications"
    );

    throw error;
  }
}

async function main() {
  const topNotifications = await getPriorityNotifications(10);

  console.log("Top priority notifications:");
  console.log(JSON.stringify(topNotifications, null, 2));
}

main();