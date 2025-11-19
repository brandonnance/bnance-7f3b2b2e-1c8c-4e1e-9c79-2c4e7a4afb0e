# Task Scheduler – Role-based Task Management Demo

A clean, modern Angular + Tailwind demo showcasing authentication, a Kanban-style task dashboard, statistics, and a light/dark theme system.

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

## 🚀 Features

- 🔐 **Demo Authentication** (email + password)
- 🌗 **Light & Dark Mode** toggle
- 🧱 **Kanban Layout** – Open / In Progress / Done
- ✏️ Inline task editing
- ➕ Task creation panel
- 📊 Completion & status metrics
- 📱 Fully responsive centered “app window” layout
- 🎨 Clean theme-driven UI with @apply utilities in SCSS

---

## 🛠 Tech Stack

- **Angular 17+** (standalone components)
- **TypeScript**
- **SCSS with Tailwind utility patterns**
- **Optional Nx workspace support**
- **Node.js (LTS)**

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <YOUR_REPO_URL>.git
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

Angular CLI:

```bash
ng serve
```

or if using Nx:

```bash
npx nx serve task-scheduler
```

Then visit:

```
http://localhost:4200
```

---

## 📁 Project Structure

```
src/
  app/
    app.component.ts
    app.component.html
    app.component.scss
styles.scss   <- global SCSS (themes + utilities)
screenshots/  <- screenshot PNGs
```

---

## 🧪 Useful Scripts

```bash
npm run start
npm run lint
npm run test
```

Nx variants:

```bash
npx nx graph
npx nx serve <project>
npx nx test <project>
```

---

## 📝 Notes on Screenshots

Your repo should contain:

```
screenshots/
  Screenshot-2025-11-17-093806.png
  Screenshot-2025-11-17-093814.png
  Screenshot-2025-11-17-093823.png
```

GitHub will automatically render them in this README.

---

## 📄 License

MIT — or update to your preferred license.
