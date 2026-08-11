# Application Navigation Flow

## Project Name

**Task & Project Management System**

## Sprint 3 – System Design & Database Modeling

The navigation structure changes according to the user's role.

---

## Administrator Navigation

```text
Login
  │
  ▼
Dashboard
  │
  ├── Users
  │   ├── User List
  │   ├── Add User
  │   └── Edit User
  │
  ├── Projects
  │   ├── Project List
  │   ├── Add Project
  │   └── Project Details
  │
  ├── Tasks
  │   ├── Task List
  │   ├── Add Task
  │   └── Task Details
  │
  ├── Teams
  │   ├── Team Members
  │   └── Manage Roles
  │
  ├── Reports
  │
  ├── Notifications
  │
  ├── Profile
  │
  └── Logout
```

---

## Project Manager Navigation

```text
Login
  │
  ▼
Dashboard
  │
  ├── Projects
  │   ├── Project List
  │   ├── Create Project
  │   └── Project Details
  │
  ├── Tasks
  │   ├── Task List
  │   ├── Create Task
  │   └── Assign Task
  │
  ├── Team Members
  │   ├── View Members
  │   └── Manage Members
  │
  ├── Reports
  │
  ├── Profile
  │
  └── Logout
```

---

## Team Member Navigation

```text
Login
  │
  ▼
Dashboard
  │
  ├── My Tasks
  │   ├── Pending Tasks
  │   ├── In Progress
  │   └── Completed Tasks
  │
  ├── My Projects
  │
  ├── Notifications
  │
  ├── Profile
  │
  └── Logout
```

---

## Common Navigation

All authenticated users can access:

```text
Dashboard
Profile
Notifications
Logout
```

Role-specific navigation is controlled by the user's assigned role.
