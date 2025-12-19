# TurboVets Interview Study Guide

## Table of Contents
- [Evaluation Criteria (What They're Looking For)](#evaluation-criteria-what-theyre-looking-for)
- [Architecture Overview](#architecture-overview)
- [Key Technical Talking Points](#key-technical-talking-points)
- [Requirements vs Implementation Analysis](#requirements-vs-implementation-analysis)
- [Likely Technical Questions & Answers](#likely-technical-questions--answers)
- [Code Walkthrough Order](#code-walkthrough-order)
- [Areas to Acknowledge as Future Improvements](#areas-to-acknowledge-as-future-improvements)
- [Questions to Ask Them](#questions-to-ask-them)

---

## Evaluation Criteria (What They're Looking For)

From the assessment document, they will evaluate:

1. **Secure and correct RBAC implementation** - Your guards + permissions system
2. **JWT-based authentication** - Real auth, not mock
3. **Clean, modular architecture in NX** - Monorepo structure
4. **Code clarity, structure, and maintainability** - Clean code
5. **Responsive and intuitive UI** - TailwindCSS + mobile-friendly
6. **Test coverage** - This is a gap (be honest about it)
7. **Documentation quality** - Your README is solid
8. **Bonus for elegant UI/UX or advanced features** - You have dark mode + visualization

**Priority order based on assessment language:** Security > Architecture > Functionality > UI > Tests

---

## Architecture Overview

### Backend (NestJS)
- JWT authentication with bcryptjs password hashing
- Permission-based RBAC using decorators + guards
- Organization-scoped data access
- SQLite with TypeORM
- Audit logging for task operations

### Frontend (Angular)
- Standalone components
- JWT stored in localStorage
- HTTP interceptor attaches Bearer tokens
- Role-based UI rendering (`canModifyTasks`)

### Monorepo Structure
```
apps/
  api/          # NestJS backend
  dashboard/    # Angular frontend

libs/
  data/         # (Scaffold only - not populated)
  auth/         # (Scaffold only - not populated)
```

**Note:** The libs folders exist from NX scaffolding but weren't utilized. Prioritized security and functionality over code extraction. With more time, would extract shared types (Task, User, Role interfaces) and permission constants.

---

## Key Technical Talking Points

### 1. Authentication Flow

```
Login Request → AuthService.validateUser() → bcrypt.compare() → JWT signed with payload:
{ sub, email, role, organizationId } → Token returned to frontend → Stored in localStorage
```

**Be ready to explain:**
- Why bcryptjs for password hashing (adaptive cost factor, industry standard)
- JWT payload contents include role and organizationId for stateless authorization
- JWT_SECRET from environment variable (not hardcoded) - security best practice

**Key Files:**
- `apps/api/src/app/auth/auth.controller.ts` - Login endpoint
- `apps/api/src/app/auth/auth.service.ts` - Validation + JWT signing
- `apps/api/src/app/auth/jwt.strategy.ts` - Token verification
- `apps/api/src/app/auth/jwt.config.ts` - Secret from env var

### 2. RBAC Enforcement (Two Layers)

**Guard Layer** (`apps/api/src/app/tasks/tasks-permission.guard.ts`):
- Uses `@RequirePermission()` decorator metadata
- Checks `ROLE_PERMISSIONS` mapping against user's role from JWT
- Returns 403 Forbidden if permission missing

**Permission Matrix** (`apps/api/src/app/access-control/permissions.constants.ts`):
```typescript
OWNER:  ['tasks.read', 'tasks.create', 'tasks.update', 'tasks.delete',
         'org.manage', 'users.manage', 'audit.read']
ADMIN:  ['tasks.read', 'tasks.create', 'tasks.update', 'tasks.delete', 'audit.read']
VIEWER: ['tasks.read']
```

**Key Files:**
- `apps/api/src/app/access-control/permission.decorator.ts` - @RequirePermission decorator
- `apps/api/src/app/access-control/permissions.constants.ts` - Role-permission mapping
- `apps/api/src/app/tasks/tasks-permission.guard.ts` - Guard implementation

### 3. Organization-Level Scoping

**Backend** (`apps/api/src/app/tasks/tasks.service.ts:15-23`):
```typescript
findAll(orgId?: string) {
  const where = orgId ? { organizationId: orgId } : {};
  return this.taskRepo.find({ where, relations: ['assignee'], order: { createdAt: 'DESC' } });
}
```

**Controller extracts orgId from JWT:**
```typescript
@Get()
@RequirePermission('tasks.read')
findAll(@Req() req: any) {
  const orgId = req.user?.organizationId as string | undefined;
  return this.tasksService.findAll(orgId);
}
```

**Frontend** (`dashboard/src/app/app.ts:160-164`):
- Gets organizationId from decoded token for task creation
- Users only see their organization's tasks

### 4. State Management Approach (They Asked About This)

**Your approach:** Component-level state with RxJS observables

```typescript
// In AppComponent
tasks: Task[] = [];
isAuthenticated$ = this.auth.isAuthenticated$.subscribe(...)
```

**Be ready to explain:**
- "I used component-level state with RxJS BehaviorSubjects for auth state"
- "For a larger app, I'd consider NgRx or Signal-based state management"
- "The current approach works well for this scope - tasks are loaded on auth, updated optimistically on changes"
- "AuthService uses BehaviorSubject for `isAuthenticated$` which components subscribe to"

**Why this is reasonable:**
- Simple app with single view doesn't need complex state management
- RxJS is Angular-native, no extra dependencies
- Easy to upgrade to NgRx if needed

---

### 5. What Happens When a Viewer Tries to Modify Data

Walk through this scenario:
1. Viewer clicks edit/delete → **Frontend hides buttons** (`canModifyTasks = false`)
2. If API called directly → `TasksPermissionGuard` checks permission
3. `ROLE_PERMISSIONS['VIEWER']` = `['tasks.read']` only
4. Guard throws `ForbiddenException` with message "Role VIEWER does not have permission tasks.update"

**Code path:**
```
Request → JwtAuthGuard (validates token) → TasksPermissionGuard (checks permission) → Controller
```

---

## Requirements vs Implementation Analysis

### Fully Implemented

| Requirement | Your Implementation |
|-------------|---------------------|
| JWT Authentication | Real JWT with bcrypt, not mock |
| RBAC (Owner/Admin/Viewer) | Permission-based guards + decorator |
| Task CRUD endpoints | All 4 endpoints working |
| Organization scoping | Tasks filtered by orgId from JWT |
| Audit logging | AuditLogService records task actions |
| NX Monorepo structure | apps/api, dashboard (libs scaffolded but not populated) |
| Login UI | Working login form |
| JWT storage + interceptor | localStorage + HttpInterceptor |
| Responsive design | TailwindCSS |
| Dark/light mode toggle | Bonus implemented |
| Task completion visualization | Bonus - status bar chart |

### Partially Implemented / Worth Discussing

| Requirement | Status | What to Say |
|-------------|--------|-------------|
| **2-level org hierarchy** | Basic orgId only | "I implemented single-level org scoping. For 2-level hierarchy, I'd add a `parentId` field to Organization entity and recursive permission checks" |
| **Role inheritance** | Flat permissions | "Permissions are explicitly listed per role. True inheritance would use a tree structure where Admin inherits Viewer permissions automatically" |
| **Drag-and-drop** | Status dropdown instead | "I prioritized security over UI polish per assessment guidance. CDK DragDrop module is ready to add" |
| **Sort/filter/categorize** | Status grouping only | "Tasks are grouped by status (Kanban-style). Adding category field (Work/Personal) and sort controls would be straightforward - just add a `category` enum to the Task entity" |
| **Test coverage** | Minimal | "Time constraints - I'd prioritize testing guards and auth service first" |
| **Shared libs usage** | Scaffold only, not utilized | "The libs folders exist from NX scaffolding but I prioritized security and functionality. With more time, I'd extract shared interfaces (Task, User, Role) and permission constants into libs for true code sharing between frontend and backend." |

### Not Implemented (Be Honest About)

| Requirement | Prepared Response |
|-------------|-------------------|
| **Keyboard shortcuts** | "Would use Angular HostListener or a library like hotkeys.js" |
| **Jest tests** | "Would test TasksPermissionGuard with different role scenarios, AuthService.validateUser, and org scoping in TasksService" |

**Note:** Task ownership check on edit/delete **was added** after initial submission - the service now validates `task.organizationId === user.organizationId` before allowing updates or deletes.

---

## Likely Technical Questions & Answers

### Architecture & Design Decisions

**Q: Why use guards instead of checking permissions in services?**
> Guards provide declarative, reusable authorization at the controller level. They fail fast before business logic runs. Services stay focused on business logic, not authorization.

**Q: Why store role in JWT instead of looking it up?**
> Stateless authorization - no database lookup needed per request. Trade-off: role changes require re-login or token refresh.

**Q: Why localStorage for JWT?**
> Simple implementation. Production considerations: httpOnly cookies prevent XSS access to tokens; localStorage is vulnerable if XSS exists.

**Q: Why NX monorepo?**
> Single workspace with unified tooling, shared TypeScript models between frontend/backend, consistent build/test scripts, easier refactoring across apps.

### Security Questions

**Q: How would you handle token expiration?**
> Add refresh token flow, or implement an interceptor that catches 401s and redirects to login.

**Q: What security improvements would you make for production?**
> - httpOnly cookies instead of localStorage
> - Refresh token rotation
> - Rate limiting on login endpoint
> - CSRF protection
> - Input validation with class-validator
> - Helmet.js for security headers

**Q: How does your 2-level organization hierarchy work?**
> Honest answer: "I implemented single-level organization scoping where users belong to one org and see only that org's tasks. For true 2-level hierarchy, I'd add a `parentId` to Organization, then in the guard/service check if user's org is the task's org OR a parent of it. The query would use a recursive CTE or multiple lookups."

**Q: Walk me through what happens if an Admin from Org-A tries to delete a task from Org-B**
> This is a gap. Currently:
> 1. Guard checks: Does ADMIN have `tasks.delete`? → Yes
> 2. Service deletes task without org check
>
> "I'd fix this by adding org validation in TasksService.remove() - fetch the task, compare organizationIds, throw ForbiddenException if mismatch."

### Implementation Questions

**Q: Why dropSchema: true in TypeORM?**
> Development convenience - fresh DB on each restart. Would be `false` with proper migrations in production.

**Q: What's missing from audit logging?**
> User ID (currently only role), IP address, request body for forensics, separate audit DB in production.

**Q: Why no tests?**
> "I prioritized working security implementation over test coverage given the 8-hour timebox. My testing priority would be: 1) Guard permission logic, 2) Auth validation, 3) Org scoping queries."

**Q: How would you test the RBAC guard?**
> "I'd use NestJS testing utilities to create a mock ExecutionContext with different user roles. Test cases:
> - OWNER can access all permissions
> - ADMIN can't access users.manage
> - VIEWER can only tasks.read
> - Missing role throws ForbiddenException
> - Invalid permission key is handled gracefully"

**Q: What's your state management approach?**
> "Component-level state with RxJS BehaviorSubjects. AuthService exposes `isAuthenticated$` observable that components subscribe to. Tasks are stored in component state and updated optimistically. For a larger app with shared state across routes, I'd consider NgRx or Angular Signals."

**Q: How would you implement role inheritance?**
> "Instead of explicit permission arrays per role, I'd define a role hierarchy (VIEWER < ADMIN < OWNER) and have the guard check if user's role level >= required role level. Or use a permission tree where each role inherits from its parent."

---

## Code Walkthrough Order

When demoing, walk through in this order:

### 1. Login Flow
```
auth.controller.ts → auth.service.ts → JWT creation with payload
```
- Show how password is validated with bcrypt
- Show JWT payload structure (sub, email, role, organizationId)

### 2. RBAC Implementation
```
permission.decorator.ts → permissions.constants.ts → tasks-permission.guard.ts
```
- Show the decorator metadata pattern
- Show role-to-permission mapping
- Walk through guard logic step by step

### 3. Organization Scoping
```
tasks.controller.ts (lines 29-33) → tasks.service.ts (findAll method)
```
- Show how orgId is extracted from req.user (JWT payload)
- Show how query is filtered

### 4. Frontend Auth
```
jwt-interceptor.ts → auth.service.ts → app.ts (canModifyTasks logic)
```
- Show token attachment to requests
- Show role-based UI hiding

### 5. Audit Logging
```
audit-log.service.ts → tasks.controller.ts (audit calls after actions)
```

---

## Areas to Acknowledge as Future Improvements

### From the Assessment Document (they specifically mentioned these):
1. **Advanced role delegation** - Allow admins to delegate specific permissions
2. **JWT refresh tokens** - Silent token refresh before expiration
3. **CSRF protection** - Add CSRF tokens for cookie-based auth
4. **RBAC caching** - Cache permission lookups (Redis) for performance
5. **Scaling permission checks efficiently** - Batch permission checks, denormalize for read performance

### Additional Improvements:
6. **More granular org scoping** - Tasks update/delete don't verify task belongs to user's org
7. **Input validation** - DTOs could use class-validator decorators
8. **Error handling** - Global exception filter for consistent error responses
9. **Testing** - Unit/integration tests for guards and services
10. **Production DB** - Postgres migration with proper migrations (not synchronize: true)
11. **2-level org hierarchy** - Add parentId and recursive checks
12. **Role inheritance** - Hierarchical permission inheritance
13. **Task categories** - Add Work/Personal category field with filtering

---

## Questions to Ask Them

- What does the tech stack look like at TurboVets currently?
- How does your team approach security code reviews?
- What's the deployment pipeline like for your NestJS services?
- How do you handle multi-tenancy at scale?
- What does the typical sprint/development cycle look like?
- What are the biggest technical challenges the team is currently facing?

---

## Quick Reference: Key Files

| Component | File Path |
|-----------|-----------|
| JWT Strategy | `apps/api/src/app/auth/jwt.strategy.ts` |
| Auth Service | `apps/api/src/app/auth/auth.service.ts` |
| Permission Guard | `apps/api/src/app/tasks/tasks-permission.guard.ts` |
| Permissions Map | `apps/api/src/app/access-control/permissions.constants.ts` |
| Tasks Controller | `apps/api/src/app/tasks/tasks.controller.ts` |
| Tasks Service | `apps/api/src/app/tasks/tasks.service.ts` |
| Frontend Auth | `dashboard/src/app/auth/auth.service.ts` |
| JWT Interceptor | `dashboard/src/app/auth/jwt-interceptor.ts` |
| Main App Component | `dashboard/src/app/app.ts` |

---

## Strongest Points to Emphasize

1. **Security-first approach** - Real JWT, bcrypt hashing, env-based secrets, permission guards
2. **Clean separation** - Guards for authz, services for business logic, decorators for metadata
3. **Stateless design** - Role/org in JWT means no DB lookups for authorization
4. **Working E2E flow** - Login → Token → Scoped tasks → RBAC enforcement
5. **Bonus features** - Dark/light mode, task visualization (shows attention to UX)

---

## Default Test Credentials

```
Email: owner@example.com
Password: password123
```

Remember to export `JWT_SECRET` before starting the API!
