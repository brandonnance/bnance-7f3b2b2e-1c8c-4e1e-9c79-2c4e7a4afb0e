# Task Scheduler – Role-based Task Management Demo

A clean, modern Angular + Tailwind demo showcasing authentication, a Kanban-style task dashboard, statistics, and a light/dark theme system.

**Author:** Brandon Nance

---

# 📚 Table of Contents

- [Overview](#overview)  
- [Tech Stack](#tech-stack)  
- [Features](#features)
- [Setup Instructions](#setup-instructions) 
- [Architecture](#architecture)  
- [Data Models](#data-models)  
- [ERD](#erd)  
- [Authentication & Access Control](#authentication--access-control)  
- [API Reference](#api-reference)  
- [Frontend Overview](#frontend-overview)   
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

## 🛠 Tech Stack

### **Backend**
- NestJS (REST API)
- TypeORM
- SQLite
- JWT Authentication
- RBAC via Nest Guards

### **Frontend**
- Angular (Standalone components)
- TailwindCSS

### **Monorepo**
- Nx Workspaces

---

## 🚀 Features

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

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/brandonnance/bnance-7f3b2b2e-1c8c-4e1e-9c79-2c4e7a4afb0e.git
cd <your-project-folder>
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn
```

### 3. Start the dev server

Nx:

```bash
npx nx serve api
npx nx serve dashboard
```

Then visit:

```
http://localhost:4200
```

---

## 📁 Architecture

```
apps/
  api/
    src/
      main.ts
      app/
        access-control
        audit-log
        auth
        entities
        tasks
        app.controller.ts
        app.module.ts
        app.service.ts
dashboard/
  src/
    styles.scss   <- global SCSS (themes + utilities)
    app/
      auth
      tasks
      app.html
      app.ts
screenshots/  <- screenshot PNGs
dev.sqlite   <- dev DB
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

# 🧭 Future Considerations

### **1. Trello-Style Custom Status Columns**  
### **2. Drag & Drop (Angular CDK)**  
### **3. Real-Time WebSockets Collaboration**  
### **4. Admin UI for Organizations**  
### **5. Advanced Analytics & Charts**  
### **6. Postgres Migration**  

---

## 📸 Screenshots

### **Login – Dark Theme**
![Login Screen – Dark](screenshots/Screenshot-2025-11-17-093806.png)

### **Dashboard – Dark Theme**
![Dashboard – Dark](screenshots/Screenshot-2025-11-17-093814.png)

### **Dashboard – Light Theme**
![Dashboard – Light](screenshots/Screenshot-2025-11-17-093823.png)

> Place the PNG files inside a `/screenshots` folder in your repo.

---


