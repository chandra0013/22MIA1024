# Notification System Design

## Stage 1: REST API Design

The notification system actually is needs APIs for creating, reading, updating, and filtering notifications. The frontend in will help in call these APIs to show notifications to the students and allows them to to view priority notifications.

### API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /notifications | Create a new notification |
| GET | /notifications | Get notifications with optional filters |
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

## Stage 3: Query Optimization

## Stage 4: Performance Improvement

## Stage 5: Notify All Students Design

## Assumptions