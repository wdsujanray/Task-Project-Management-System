# Task & Project Management API

Express API backed by MongoDB for users, projects, and tasks.

## Run

```powershell
npm install
$env:MONGODB_URI="mongodb://localhost:27017/"
$env:MONGODB_DB="users"
$env:AUTH_SECRET="replace-with-a-long-random-secret"
npm run dev
```

The API uses the existing `users` database and its existing `users`, `projects`, `tasks`, `teams`, and `notifications` collections. It does not create a `task_project_management` database or collection. Set `MONGODB_DB` to your actual existing database name if `users` is the collection/database label rather than the database name.

The API runs at `http://localhost:5000`. The Vite client uses that URL by default; set `VITE_API_URL` when MongoDB API is hosted elsewhere.

## Backend test route

Run `npm run dev` from `server/`, then request `http://localhost:5000/api/test`. This route returns a JSON confirmation and does not require a MongoDB connection.

Authentication endpoints are `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/profile`. Project and task endpoints require the returned bearer token.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
