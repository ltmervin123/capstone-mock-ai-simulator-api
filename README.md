# ⚙️ Node.js Backend Starter Template

A clean, scalable, and modular Node.js backend template built with **Express.js**, ideal for REST APIs, microservices, or full-stack applications. Designed to help developers jumpstart projects quickly with best practices and built-in tooling.

---

## 📁 Project Structure

📦 node-backend-template
├── src
│ ├── config # Shared config
│ ├── controllers # Route logic
│ ├── middlewares # Custom middleware (e.g., auth, error handlers)
│ ├── models # Mongoose/Sequelize models (if using a DB)
│ ├── routes # Route definitions
│ ├── services # Business logic layer
│ ├── utils # Utility functions/helpers
│ ├── third-party # Use third party service (e.g Cluade API)
├── app.js # App entry point
├── .vscode/ # VSCode workspace settings (optional)
├── .editorconfig # Editor formatting rules
├── .prettierrc # Prettier config
├── .eslintrc.cjs # ESLint config
├── .env # Sample environment variables
├── .gitignore
├── package.json
└── README.md

---

## 🧾 Naming Conventions

To ensure consistency and maintainability across the project, follow these conventions:

### 📂 Folder & File Naming

| Item              | Convention      | Example                                 |
| ----------------- | --------------- | --------------------------------------- |
| Folders           | `kebab-case`    | `controllers/`, `user-routes/`          |
| Files             | `kebab-case.js` | `user-controller.js`, `auth-service.js` |
| Config Files      | `kebab-case.js` | `db-config.js`, `server-config.js`      |
| Environment Files | `.env`          | `.env`, `.env.example`                  |

### 🧠 Variable & Function Naming

| Type      | Convention    | Example                          |
| --------- | ------------- | -------------------------------- |
| Variables | `camelCase`   | `userName`, `dbConnection`       |
| Functions | `camelCase`   | `getUserById()`, `handleLogin()` |
| Constants | `UPPER_SNAKE` | `JWT_SECRET`, `PORT`, `API_KEY`  |
| Classes   | `PascalCase`  | `UserService`, `ErrorHandler`    |

### 🌐 Route Naming

| Type         | Convention     | Example                               |
| ------------ | -------------- | ------------------------------------- |
| Route Paths  | `kebab-case`   | `/user-profile`, `/api/v1/auth/login` |
| Router Files | `plural-kebab` | `users.js`, `posts.js`                |

> ✅ **REST Best Practice**: Use nouns for routes — `/users`, not `/getUser`.

🧪 Run Linting & Formatting

- npx eslint .
- npx prettier --write .
