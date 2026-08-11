# MongoDB Collections

## Project Name

**Task & Project Management System**

## Sprint 3 – System Design & Database Modeling

The application uses MongoDB as the primary database. The following collections are required.

---

## 1. Users Collection

**Collection Name:** `users`

| Field          | Type     | Description             |
| -------------- | -------- | ----------------------- |
| `_id`          | ObjectId | Unique user ID          |
| `name`         | String   | User's full name        |
| `email`        | String   | User's email address    |
| `password`     | String   | Encrypted user password |
| `role`         | String   | User role               |
| `profileImage` | String   | Profile image URL       |
| `createdAt`    | Date     | Account creation date   |

### Example Document

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "project_manager",
  "profileImage": "/images/profile.jpg",
  "createdAt": "2026-08-11T00:00:00Z"
}
```

---

## 2. Projects Collection

**Collection Name:** `projects`

| Field         | Type     | Description         |
| ------------- | -------- | ------------------- |
| `_id`         | ObjectId | Unique project ID   |
| `title`       | String   | Project title       |
| `description` | String   | Project description |
| `status`      | String   | Project status      |
| `startDate`   | Date     | Project start date  |
| `endDate`     | Date     | Project end date    |
| `ownerId`     | ObjectId | ID of project owner |

### Example Document

```json
{
  "_id": "ObjectId",
  "title": "Website Development",
  "description": "Development of a project management website",
  "status": "active",
  "startDate": "2026-08-01T00:00:00Z",
  "endDate": "2026-09-30T00:00:00Z",
  "ownerId": "ObjectId"
}
```

---

## 3. Tasks Collection

**Collection Name:** `tasks`

| Field         | Type     | Description        |
| ------------- | -------- | ------------------ |
| `_id`         | ObjectId | Unique task ID     |
| `title`       | String   | Task title         |
| `description` | String   | Task description   |
| `priority`    | String   | Task priority      |
| `status`      | String   | Task status        |
| `dueDate`     | Date     | Task deadline      |
| `projectId`   | ObjectId | Related project ID |
| `assignedTo`  | ObjectId | Assigned user ID   |

### Example Document

```json
{
  "_id": "ObjectId",
  "title": "Design Login Page",
  "description": "Create responsive login page UI",
  "priority": "high",
  "status": "in_progress",
  "dueDate": "2026-08-20T00:00:00Z",
  "projectId": "ObjectId",
  "assignedTo": "ObjectId"
}
```

---

## 4. Teams Collection

**Collection Name:** `teams`

| Field       | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `_id`       | ObjectId | Unique team record ID  |
| `projectId` | ObjectId | Related project ID     |
| `memberId`  | ObjectId | User/member ID         |
| `role`      | String   | Member role in project |

### Example Document

```json
{
  "_id": "ObjectId",
  "projectId": "ObjectId",
  "memberId": "ObjectId",
  "role": "developer"
}
```

---

## 5. Notifications Collection

**Collection Name:** `notifications`

| Field       | Type     | Description                |
| ----------- | -------- | -------------------------- |
| `_id`       | ObjectId | Unique notification ID     |
| `userId`    | ObjectId | Notification receiver      |
| `message`   | String   | Notification message       |
| `isRead`    | Boolean  | Read/unread status         |
| `createdAt` | Date     | Notification creation date |

### Example Document

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "message": "You have been assigned a new task.",
  "isRead": false,
  "createdAt": "2026-08-11T10:00:00Z"
}
```

---

## Collection Relationships

```text
users
  │
  ├──< projects
  │       │
  │       ├──< tasks
  │       │
  │       └──< teams
  │
  └──< notifications
```

## MongoDB Collections Summary

```text
Database: task_project_management

Collections:
├── users
├── projects
├── tasks
├── teams
└── notifications
```
