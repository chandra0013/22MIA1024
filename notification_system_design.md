# Notification System Design

## Stage 1: REST API Design

The notification system actually is needs APIs for creating, reading, updating, and filtering notifications. The FRontend in will help in call these APIs to show notifications to the students and allows them to to view priority notifications.

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

Request body:

```json
{
  "studentId": 1042,
  "title": "Placement Drive",
  "message": "New placement drive is announced.",
  "type": "Placement"
}

## Stage 2: Database Design

PostgreSQL is usually suitable for this notification system since Because the data is structured and it needs the filtering by student, notification type, read status, and timestamp.

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
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  student_id BIGINT NOT NULL,
  notification_type VARCHAR(30) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

## Stage 5: Notify All Students Design

## Assumptions