# Notification System Design

## Stage 1: REST API Design

The notification system actually needs APIs for creating the notifications on first step then reading the notification then updating, and filtering notifications. The FRontend in will help in call these APIs to show notifications to the students and allows them to to view priority notifications.

### API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /notifications | Create a new notification |
| GET | /notifications | Get notifications with filters that have options |
| GET | /notifications/:id | Get a single notification |
| PATCH | /notifications/:id/read | Mark a notification as read |
| DELETE | /notifications/:id | Delete a notification |
| GET | /notifications/priority | Get top priority unread notifications |

### Create Notification

**POST /notifications**

example Request body:

```json
{
  "studentId": 1042,
  "title": "Placement Drive",
  "message": "New placement drive is announced.",
  "type": "Placement"
}

## Stage 2: Database Design

In DB PostgreSQL is usually suitable for this notification system since Because the data is structured and it needs the filtering by student, notification type, read status, and timestamp.

### Table: notifications

| Column | Type | Purpose |
|---|---|---|
| id | UUID PRIMARY KEY | Unique notification ID |
| student_id | BIGINT NOT NULL | Student receiving the notification |
| notification_type | VARCHAR(30) NOT NULL | Event, Result, or Placement |
| message | TEXT NOT NULL | Notification message |
| is_read | BOOLEAN DEFAULT FALSE | Read/unread status |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Notification time |

```sql
CREATE TABLE notifications (  id UUID PRIMARY KEY, student_id BIGINT NOT NULL, notification_type VARCHAR(30) NOT NULL,  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Stage 3: Query Optimization

if i observe the query it is correct as per the logic , but it can become slow in cases when the table grows because the database may be scalable and may scan many rows and then sort them.

```sql
Select * FROM notifications where student_id = 1042 AND is_read = false
Order BY created_at ASC;

a suitable index can be
```sql
Create INDEX idx_notifications_student_read_created ON notifications (student_id, is_read, created_at);

one query useful to find all students placement notification is 
```sql
Select student_id, id, notification_type, message, created_at
FROM notifications WHERE notification_type = 'Placement'  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

## Stage 4: Performance Improvement

After thinking what i understood is fetching notifications on every single page load for every student can overload and it will be complex the database and slow down the application.

i would recomend the improvements like :

--> Using pagination instead of loading all notifications.
-> trying to Fetch only recent notifications first.
--> avoiding repeated API calls if the same data is already loaded.
i am not sure but using WebSocket for real-time updates instead of refreshing the full list repeatedly.

## Stage 5: Notify All Students Design

so the direct loop-based implementation is risky sometimes because sending emails again saving to DB and then pushing app notifications for all 50,000 students inside whole one single request can result in collapse timeout or partially fail.

so If `send_email` fails after the 200 students, some students may receive notifications and others may not. there will be inconsistent delivery.

so the better suggestion or design can be

1. first Create a notification job when HR clicks "Notify All".
2. then try to Save the job in DB with status `pending`.
3. this step we can Add student notification tasks to a queue.
4. process the queue in batches.
5. save in-app notifications first.
6. using to send emails separately through workers.
7. then retry failed email tasks.
8. Track job status as pending, processing, completed, or failed.

email support should be sent asynchronously for efficient delivery along with the retry support.

## Assumptions