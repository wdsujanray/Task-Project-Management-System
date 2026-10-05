# Task & Project Management API

Express API for the Task & Project Management System.

## Run

```powershell
npm install
npm run dev
```

Configure `MONGODB_URI` and optionally `MONGODB_DB` in `server/.env` (see
`.env.example`). The server listens on `http://localhost:5000` by default;
set `PORT` to use a different port.

Project CRUD uses Mongoose. Authentication and task endpoints continue to use
the existing MongoDB driver connection.

## Backend test route

Request `GET http://localhost:5000/api/test` for a database-independent API
health response.

## Project route testing

The project routes require a MongoDB connection:

| Method | URL |
| --- | --- |
| GET | `http://localhost:5000/api/projects` |
| GET | `http://localhost:5000/api/projects/PROJECT_ID` |
| POST | `http://localhost:5000/api/projects` |
| PUT | `http://localhost:5000/api/projects/PROJECT_ID` |
| DELETE | `http://localhost:5000/api/projects/PROJECT_ID` |
| PATCH | `http://localhost:5000/api/projects/PROJECT_ID` |

For POST and PUT, send JSON such as:

```json
{
  "name": "Website Development Project",
  "description": "Task and project management application"
}
```
