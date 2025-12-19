# Interview Walkthrough Script: "Walk Us Through Your Approach"

**Target time: 5-7 minutes**

---

## 1. Opening - Set Context (30 seconds)

> "When I received this assessment, I identified the core priorities from the requirements: **security first**, then architecture, then functionality. The assessment explicitly stated that security and reliability come before UI polish, so that guided my decisions throughout."

---

## 2. Address the Scaffolding Challenge Briefly (30 seconds)

> "I'll be honest - I spent some initial time wrestling with the NX monorepo scaffolding. The default generators didn't produce exactly the folder structure outlined in the spec. Rather than burn hours fighting tooling, I made a pragmatic call: **a working, secure application matters more than perfect folder layout**. I got the monorepo working with `apps/api` and `dashboard`. The `libs` folders exist but are essentially scaffolding - I prioritized getting security and functionality working first. Extracting shared types into libs would be a quick refactor with more time."

**Why this works:** Shows problem-solving, pragmatism, and that you don't get stuck on perfectionism.

---

## 3. Walk Through Architecture (2-3 minutes)

> "Let me walk you through the architecture, starting with authentication..."

### Files to open in order:

### 3a. Auth Flow
**Open:** `apps/api/src/app/auth/auth.service.ts`

> "Real JWT authentication - no mocking. Password validation with bcrypt, then I sign a JWT containing the user's ID, email, role, and organizationId. This makes authorization stateless - no database lookup needed per request."

### 3b. RBAC System
**Open:** `apps/api/src/app/access-control/permissions.constants.ts`

> "For access control, I defined a permission-based system. Each role maps to an array of permissions."

**Then open:** `apps/api/src/app/tasks/tasks-permission.guard.ts`

> "The guard reads the `@RequirePermission` decorator and checks if the user's role has that permission. Owner gets everything, Admin gets task CRUD plus audit logs, Viewer is read-only."

### 3c. Organization Scoping
**Open:** `apps/api/src/app/tasks/tasks.controller.ts`

> "For multi-tenancy, I extract organizationId from the JWT and filter all queries by it. Users only see their own organization's data."

**Then open:** `apps/api/src/app/tasks/tasks.service.ts`

> "The service layer also validates org ownership on update and delete operations - a user can't modify tasks from another organization even if they have the right role."

### 3d. Frontend Auth
**Open:** `dashboard/src/app/auth/auth.service.ts`

> "On the frontend, the JWT is stored and attached via an HTTP interceptor."

**Then open:** `dashboard/src/app/app.ts`

> "The UI uses the decoded role to conditionally show edit/delete buttons - but that's just UX. The real enforcement happens server-side."

---

## 4. Highlight Key Decisions (1 minute)

> "A few key decisions I made:"

- **Security over features** - "I skipped drag-and-drop to focus on getting RBAC and org scoping right"
- **Defense in depth** - "Role checks happen on both frontend (UX) and backend (enforcement)"
- **Audit logging** - "Every create, update, delete is logged with user ID, role, and org"
- **Environment-based secrets** - "JWT_SECRET comes from env vars, not hardcoded"

---

## 5. Acknowledge Trade-offs (30 seconds)

> "Given the 8-hour timebox, I made some trade-offs:"

- "Test coverage is minimal - I'd prioritize testing the guards and auth service first"
- "I implemented single-level org scoping rather than the 2-level hierarchy - I can explain how I'd extend it"
- "localStorage for JWT rather than httpOnly cookies - that's a production hardening step"

---

## 6. Close with What You'd Do Next (30 seconds)

> "If this were going to production, my first priorities would be:"

1. "Move to PostgreSQL with proper migrations"
2. "Move JWT to httpOnly cookies"
3. "Add test coverage for the security-critical paths"

---

## Quick Reference: File Order for Demo

1. `apps/api/src/app/auth/auth.service.ts` - JWT creation
2. `apps/api/src/app/access-control/permissions.constants.ts` - Role permissions
3. `apps/api/src/app/tasks/tasks-permission.guard.ts` - Guard logic
4. `apps/api/src/app/tasks/tasks.controller.ts` - Org extraction
5. `apps/api/src/app/tasks/tasks.service.ts` - Org validation
6. `dashboard/src/app/auth/auth.service.ts` - Frontend auth
7. `dashboard/src/app/app.ts` - Role-based UI

---

## Practice Tips

1. **Have the files ready to open** - Know the order you'll click through
2. **Don't read code line-by-line** - Summarize what each file does
3. **Keep moving** - Don't get stuck on any one file
4. **Connect to requirements** - Reference what they asked for as you show it
5. **Stay confident** - You built this, you know it
