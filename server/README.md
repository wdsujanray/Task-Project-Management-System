# Task & Project Management API

Express API for the Task & Project Management System.

## Run

```powershell
npm install
$env:MONGODB_URI="mongodb://localhost:27017/"
$env:MONGODB_DB="users"
$env:AUTH_SECRET="replace-with-a-long-random-secret"
npm run dev
```

The server listens on `http://localhost:5000` by default. Set `PORT` to use a
different port. The Vite client uses this URL by default; set `VITE_API_URL`
when the API is hosted elsewhere.

Authentication, task endpoints, and the legacy `PATCH /api/projects/:id`
handler retain their existing MongoDB behavior. The Sprint 12 project
`GET`, `POST`, `PUT`, and `DELETE` handlers return temporary responses without
accessing MongoDB.

## Backend test route

Request `GET http://localhost:5000/api/test` for a database-independent API
health response.

## Project route testing

The project routes respond without a MongoDB connection:

| Method | URL |
| --- | --- |
| GET | `http://localhost:5000/api/projects` |
| GET | `http://localhost:5000/api/projects/101` |
| POST | `http://localhost:5000/api/projects` |
| PUT | `http://localhost:5000/api/projects/101` |
| DELETE | `http://localhost:5000/api/projects/101` |

For POST and PUT, send JSON such as:

```json
{
  "name": "Website Development Project",
  "description": "Task and project management application"
}
```
