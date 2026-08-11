# Entity Relationship Diagram (ERD)

## Project Name

**Task & Project Management System**

## Sprint 3 – System Design & Database Modeling

### Main Entities

The system contains the following primary entities:

* User
* Project
* Task
* Team
* Notification

### ER Diagram

```text
                         ┌─────────────────┐
                         │      USER       │
                         ├─────────────────┤
                         │ _id             │
                         │ name            │
                         │ email           │
                         │ password        │
                         │ role            │
                         │ profileImage    │
                         │ createdAt       │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                  1 │           1 │           1 │
                    │             │             │
                    ▼             ▼             ▼
             ┌─────────────┐ ┌─────────────┐ ┌────────────────┐
             │   PROJECT   │ │   TEAM      │ │ NOTIFICATION   │
             ├─────────────┤ ├─────────────┤ ├────────────────┤
             │ _id         │ │ _id         │ │ _id            │
             │ title       │ │ projectId   │ │ userId         │
             │ description │ │ memberId    │ │ message        │
             │ status      │ │ role        │ │ isRead         │
             │ startDate   │ └─────────────┘ │ createdAt      │
             │ endDate     │                 └────────────────┘
             │ ownerId     │
             └──────┬──────┘
                    │
                  1 │
                    │
                    ▼
             ┌─────────────┐
             │    TASK     │
             ├─────────────┤
             │ _id         │
             │ title       │
             │ description │
             │ priority    │
             │ status      │
             │ dueDate     │
             │ projectId   │
             │ assignedTo  │
             └─────────────┘
```

## Relationships

### 1. User → Project

**One-to-Many**

One user can create or own multiple projects.

```text
User (1) ────────────< Project (Many)
```

### 2. Project → Task

**One-to-Many**

One project can contain multiple tasks.

```text
Project (1) ────────────< Task (Many)
```

### 3. Project → Team

A project can have multiple team members.

```text
Project (1) ────────────< Team Members (Many)
```

### 4. User → Notification

One user can receive multiple notifications.

```text
User (1) ────────────< Notification (Many)
```

### 5. User → Task

A user can be assigned multiple tasks.

```text
User (1) ────────────< Task (Many)
```

## Summary

The ERD represents the main relationships between users, projects, tasks, teams and notifications in the Task & Project Management System.
