# Module Diagram

## Project Name

**Task & Project Management System**

## Sprint 3 – System Design & Database Modeling

### System Modules

The Task & Project Management System is divided into the following major modules:

1. Authentication
2. User Management
3. Project Management
4. Task Management
5. Team Management
6. Dashboard & Reports
7. Notifications
8. Profile & Settings

### Module Diagram

```text
Task & Project Management System
│
├── Authentication
│   ├── Login
│   ├── Registration
│   ├── Forgot Password
│   └── Logout
│
├── User Management
│   ├── Create User
│   ├── View Users
│   ├── Update User
│   └── Delete User
│
├── Project Management
│   ├── Create Project
│   ├── View Projects
│   ├── Update Project
│   └── Delete Project
│
├── Task Management
│   ├── Create Task
│   ├── Assign Task
│   ├── Update Task
│   └── Track Task Status
│
├── Team Management
│   ├── Add Members
│   ├── Remove Members
│   ├── Assign Roles
│   └── Manage Team
│
├── Dashboard & Reports
│   ├── Project Statistics
│   ├── Task Progress
│   ├── Team Performance
│   └── Reports
│
├── Notifications
│   ├── Task Notifications
│   ├── Project Notifications
│   └── System Notifications
│
└── Profile & Settings
    ├── View Profile
    ├── Edit Profile
    ├── Change Password
    └── Application Settings
```

## Module Description

| Module              | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| Authentication      | Handles user login, registration and authentication.     |
| User Management     | Manages system users and their roles.                    |
| Project Management  | Creates and manages projects.                            |
| Task Management     | Creates, assigns and tracks project tasks.               |
| Team Management     | Manages project team members and roles.                  |
| Dashboard & Reports | Displays project, task and team statistics.              |
| Notifications       | Sends updates and system notifications.                  |
| Profile & Settings  | Allows users to manage profile and application settings. |
