# Basic Wireframes

## Project Name

**Task & Project Management System**

## Sprint 3 – System Design & Database Modeling

This document contains the basic low-fidelity wireframes for the main application screens.

---

# 1. Login Page

```text
┌──────────────────────────────────┐
│                                  │
│              LOGO                │
│                                  │
│        Task Management           │
│                                  │
│  Email                           │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  Password                        │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│          [    Login    ]         │
│                                  │
│        Forgot Password?          │
│                                  │
└──────────────────────────────────┘
```

---

# 2. Dashboard

```text
┌──────────────────────────────────────────────────────┐
│ LOGO       Dashboard     Notifications    Profile    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│  │  PROJECTS  │ │   TASKS    │ │    TEAM    │       │
│  │     12     │ │     48     │ │     15     │       │
│  └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
│  Recent Projects                                     │
│  ┌────────────────────────────────────────────────┐  │
│  │ Project A                         In Progress   │  │
│  │ Project B                         Completed     │  │
│  │ Project C                         Pending       │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Task Progress                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ Completed   ████████████████░░░░   80%        │  │
│  │ Progress    ████████████░░░░░░░░   60%        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Notifications                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ New task assigned                               │  │
│  │ Project deadline updated                        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 3. Project List

```text
┌──────────────────────────────────────────┐
│ Projects                    + Add Project│
├──────────────────────────────────────────┤
│                                          │
│ Search Projects                          │
│ ┌──────────────────────────────────────┐ │
│ │ Search...                            │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Project A                            │ │
│ │ Website Development                  │ │
│ │ Status: In Progress                  │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Project B                            │ │
│ │ Mobile Application                   │ │
│ │ Status: Completed                    │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Project C                            │ │
│ │ E-Commerce Platform                  │ │
│ │ Status: Pending                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

---

# 4. Task Form

```text
┌──────────────────────────────────────────┐
│              Create Task                 │
├──────────────────────────────────────────┤
│                                          │
│ Task Title                               │
│ ┌──────────────────────────────────────┐ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Description                              │
│ ┌──────────────────────────────────────┐ │
│ │                                      │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Priority                                 │
│ ┌──────────────────────────────────────┐ │
│ │ Select Priority ▼                    │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Due Date                                 │
│ ┌──────────────────────────────────────┐ │
│ │ DD / MM / YYYY                       │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Assign Member                            │
│ ┌──────────────────────────────────────┐ │
│ │ Select Member ▼                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│          [ Cancel ]  [ Save Task ]       │
│                                          │
└──────────────────────────────────────────┘
```

---

# 5. User Profile

```text
┌──────────────────────────────────────────┐
│              User Profile                │
├──────────────────────────────────────────┤
│                                          │
│              ┌──────────┐                │
│              │          │                │
│              │ PROFILE  │                │
│              │  IMAGE   │                │
│              │          │                │
│              └──────────┘                │
│                                          │
│ Name                                     │
│ John Doe                                 │
│                                          │
│ Email                                    │
│ john@example.com                         │
│                                          │
│ Role                                     │
│ Project Manager                          │
│                                          │
│ Created At                               │
│ August 11, 2026                          │
│                                          │
│          [ Edit Profile ]                │
│                                          │
└──────────────────────────────────────────┘
```

---

## Wireframe Summary

| Screen       | Purpose                                       |
| ------------ | --------------------------------------------- |
| Login Page   | User authentication                           |
| Dashboard    | Overview of projects, tasks and notifications |
| Project List | View and manage projects                      |
| Task Form    | Create and assign tasks                       |
| User Profile | View and edit user information                |

## Design Level

These are **basic low-fidelity wireframes** intended for Sprint 3 system design and planning. They can later be converted into high-fidelity UI designs using Figma or another UI/UX design tool.
