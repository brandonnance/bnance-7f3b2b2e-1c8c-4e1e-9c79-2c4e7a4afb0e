# 🚀 Task Scheduler  
A full-stack task management platform built with **Nx**, **NestJS**, **Angular**, **TypeORM**, **JWT Authentication**, and **TailwindCSS**.

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Node](https://img.shields.io/badge/node-18+-green)
![Nx](https://img.shields.io/badge/monorepo-Nx-blue)

**Author:** Brandon Nance

---

# 📚 Table of Contents

- [Overview](#overview)  
- [Tech Stack](#tech-stack)  
- [Features](#features)  
- [Architecture](#architecture)  
- [Data Models](#data-models)  
- [ERD](#erd)  
- [Authentication & Access Control](#authentication--access-control)  
- [API Reference](#api-reference)  
- [Frontend Overview](#frontend-overview)  
- [Setup Instructions](#setup-instructions)  
- [Future Considerations](#future-considerations)  
- [Screenshots](#screenshots)

---

# 📌 Overview

The **Task Scheduler** is a role-based, organization-scoped task management application built inside an Nx monorepo. It includes:

- Secure JWT login  
- Full RBAC permission system (Owner / Admin / Viewer)  
- Multi-organization scoping  
- CRUD operations for tasks  
- Audit logging  
- Angular UI with TailwindCSS  
- Dark/Light Mode  
- Status breakdown visualization  

_No drag-and-drop functionality is included in this implementation._

---

# 🛠 Tech Stack

### **Backend**
- NestJS (REST API)
- TypeORM
- SQLite
- JWT Authentication
- RBAC via Nest Guards

### **Frontend**
- Angular (Standalone components)
- TailwindCSS
- LocalStorage-based JWT handling

### **Monorepo**
- Nx Workspaces
- Shared libs for entities and auth types

---

# ⭐ Features

### **Authentication**
- Email + password login  
- JWT token generation + verification  

### **Role-Based Access Control**
- Owner → full system access  
- Admin → full organization access  
- Viewer → read-only  

### **Task Management**
- View tasks by status  
- Create, edit, delete tasks  
- Tasks scoped to user’s organization  

### **Audit Logging**
- Records all create/update/delete operations  
- Admin/Owner-only access  

### **UI Enhancements**
- Light/Dark mode toggle  
- Responsive layout  
- Status visualization bar  

---

# 🏗 Architecture

### **Monorepo Layout**

```
apps/
  api/          # NestJS backend
  dashboard/    # Angular frontend

libs/
  data/         # Entities, enums, permissions
  auth/         # Auth DTOs and interfaces
```

### **Backend Architecture**
Modules:
- AuthModule  
- TasksModule  
- AuditLogModule  
- OrganizationsModule  
- UsersModule  

Guards handle RBAC and org-level scoping.

### **Frontend Architecture**
- Angular standalone components  
- Auth stored in localStorage  
- API services for Tasks and Auth  
- Styled with TailwindCSS  

### **Why Nx?**
- Single workspace  
- Unified scripts and tooling  
- Ability to share TypeScript models  

---

# 🧱 Data Models

### **User**
```
id: string
name: string
email: string
passwordHash: string
role: OWNER | ADMIN | VIEWER
organizationId: string
```

### **Organization**
```
id: string
name: string
parentId?: string
```

### **Task**
```
id: string
title: string
description?: string
status: OPEN | IN_PROGRESS | DONE
dueDate?: Date
assigneeId?: string
organizationId: string
createdAt: Date
updatedAt: Date
```

### **AuditLog**
```
id: string
userId: string
role: string
action: string
endpoint: string
timestamp: Date
```

---

# 📐 ERD

```mermaid
erDiagram

    ORGANIZATION ||--o{ USER : "has many"
    ORGANIZATION ||--o{ TASK : "has many"

    USER ||--o{ TASK : "assigned tasks"
    USER ||--o{ AUDITLOG : "creates logs"
```

---

# 🔐 Authentication & Access Control

### **Permission Matrix**

| Role   | View Tasks | Create | Edit | Delete | Audit Logs |
|--------|------------|--------|------|--------|------------|
| **OWNER** | ✔ | ✔ | ✔ | ✔ | ✔ |
| **ADMIN** | ✔ | ✔ | ✔ | ✔ | ✔ |
| **VIEWER** | ✔ | ✖ | ✖ | ✖ | ✖ |

---

# 📡 API Reference

Base URL:
```
http://localhost:3000/api
```

---

## 🔐 POST /auth/login

### Request
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "access_token": "..."
}
```

---

## 📌 GET /tasks

### Response
```json
[
  {
    "id": "123",
    "title": "Prepare project briefing",
    "status": "OPEN",
    "organizationId": "ORG-A"
  }
]
```

---

## 📝 POST /tasks

### Request
```json
{
  "title": "New Task",
  "status": "OPEN",
  "organizationId": "ORG-A"
}
```

### Response
```json
{
  "id": "abc",
  "title": "New Task",
  "status": "OPEN"
}
```

---

## ✏️ PUT /tasks/:id

### Request
```json
{
  "title": "Updated Task",
  "status": "IN_PROGRESS"
}
```

### Response
```json
{
  "id": "abc",
  "title": "Updated Task",
  "status": "IN_PROGRESS"
}
```

---

## ❌ DELETE /tasks/:id

### Response
```json
{
  "success": true,
  "deletedId": "abc"
}
```

---

# 🎨 Frontend Overview

- Angular standalone components  
- TailwindCSS styling  
- Dark/Light mode  
- Task status visualization bar  
- JWT authentication  

---

# 🧭 Future Considerations

### **1. Trello-Style Custom Status Columns**  
### **2. Drag & Drop (Angular CDK)**  
### **3. Real-Time WebSockets Collaboration**  
### **4. Admin UI for Organizations**  
### **5. Advanced Analytics & Charts**  
### **6. Postgres Migration**  

---

# 🖼 Screenshots

*(Add your images here)*

```
![Login Screen](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)
![Dark Mode](./screenshots/dark-mode.png)
```
