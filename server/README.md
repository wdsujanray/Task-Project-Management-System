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

## Run the backend

From the repository root, run these commands in PowerShell:

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

Edit `server/.env` if MongoDB is not available at the default local URL.
The API starts at `http://localhost:5000`. Keep the server running while
testing. In Postman, register or log in first using `POST
http://localhost:5000/api/auth/register` or `POST
http://localhost:5000/api/auth/login`, then copy the returned `token`.

## Project CRUD API

Project requests require that token. In Postman, select **Authorization**,
choose **Bearer Token**, and paste the token. For JSON requests, choose
**Body > raw > JSON**. Projects belong to the authenticated user; one user
cannot view or modify another user's projects.

| Method | URL | Success |
| --- | --- | --- |
| POST | `http://localhost:5000/api/projects` | `201 Created` |
| GET | `http://localhost:5000/api/projects` | `200 OK` |
| GET | `http://localhost:5000/api/projects/PROJECT_ID` | `200 OK` |
| PUT | `http://localhost:5000/api/projects/PROJECT_ID` | `200 OK` |
| DELETE | `http://localhost:5000/api/projects/PROJECT_ID` | `200 OK` |

### 1. Create a project

Send `POST /api/projects` with:

```json
{
  "name": "Website Development Project",
  "description": "Build the task and project management application",
  "category": "Web Application",
  "status": "Planning",
  "startDate": "2026-11-10",
  "completionDate": "2026-12-10"
}
```

Expected: `201 Created`, with the saved project including its MongoDB `_id`,
`name`, `title`, and dates.

### 2. Get all projects

Send `GET /api/projects`.

Expected: `200 OK` and an array of projects owned by the logged-in user. Copy
the created project's `_id` for the remaining requests.

### 3. Get one project

Send `GET /api/projects/PROJECT_ID`, replacing `PROJECT_ID` with the `_id`.

Expected: `200 OK` and the project object. An invalid ID returns `400`; a
valid ID that is missing or belongs to another user returns `404`.

### 4. Update a project

Send `PUT /api/projects/PROJECT_ID` with the fields to update:

```json
{
  "name": "Website Development - Phase 2",
  "description": "Updated project scope",
  "status": "Active"
}
```

Expected: `200 OK` and the updated project. The route validates updated values;
an empty update body returns `400`.

### 5. Delete a project

Send `DELETE /api/projects/PROJECT_ID`.

Expected: `200 OK` with:

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

The project is deleted from the projects collection and its associated tasks
are removed. Repeating the request returns `404`.

Missing/invalid project data returns `400`; unavailable projects return `404`;
unexpected request or database failures return a server error. The endpoints
also return `401` if the bearer token is missing or invalid.

## Verify changes in MongoDB Compass

1. Connect Compass to the URI in `MONGODB_URI` (default:
   `mongodb://127.0.0.1:27017`).
2. Open the database selected by `MONGODB_DB` (default: `taskflow`).
3. Open the `projects` collection and refresh after create, update, and delete.
   The created document contains the authenticated user's `ownerId`.
4. Open `tasks` to verify that deleting a project also removes its associated
   tasks.
