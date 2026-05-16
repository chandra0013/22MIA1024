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

## Stage 4: Performance Improvement

## Stage 5: Notify All Students Design

## Assumptions