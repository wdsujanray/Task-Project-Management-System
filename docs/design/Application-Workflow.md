# Application Workflow

## Project Name

**Task & Project Management System**

## Sprint 3 – System Design & Database Modeling

### Main Application Workflow

```text
┌──────────────┐
│    Login     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dashboard   │
└──────┬───────┘
       │
       ▼
┌────────────────┐
│ Select Project │
└──────┬─────────┘
       │
       ▼
┌─────────────────────┐
│ Create / Update Task │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Assign Team Member  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Save Changes     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Database Updated   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Notification Sent   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Success Message   │
└─────────────────────┘
```

## User Authentication Workflow

```text
Open Application
       │
       ▼
     Login
       │
       ▼
Validate Credentials
       │
   ┌───┴────┐
   │        │
 Valid    Invalid
   │        │
   ▼        ▼
Dashboard  Error Message
```

## Project Management Workflow

```text
Dashboard
    │
    ▼
Projects
    │
    ▼
Create Project
    │
    ▼
Enter Project Details
    │
    ▼
Save Project
    │
    ▼
Project Created
```

## Task Management Workflow

```text
Select Project
      │
      ▼
Create Task
      │
      ▼
Enter Task Details
      │
      ▼
Select Priority
      │
      ▼
Set Due Date
      │
      ▼
Assign Team Member
      │
      ▼
Save Task
      │
      ▼
Task Created
      │
      ▼
Notification Sent
```

## Task Status Workflow

```text
Pending
   │
   ▼
In Progress
   │
   ▼
Completed
```

## Notification Workflow

```text
Action Performed
      │
      ▼
Database Updated
      │
      ▼
Notification Created
      │
      ▼
User Receives Notification
      │
      ▼
User Opens Notification
      │
      ▼
Notification Marked as Read
```
