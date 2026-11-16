# Task & Project Management System

A web application for organizing projects, tasks, deadlines, and team collaboration.

## Technology

- Frontend: React and Vite
- Backend: Node.js and Express
- Database: MongoDB

## Run locally

Start the backend from `server/` with `npm install` and `npm run dev`. Start
the frontend from `client/` with `npm install` and `npm run dev`.

The frontend uses `http://localhost:5000/api` by default. Set `VITE_API_URL`
in the client environment when the API runs at a different address.

## GitHub Pages

The GitHub Actions workflow builds and publishes the frontend from `client/`.
In the repository settings, set **Pages > Build and deployment > Source** to
**GitHub Actions**. The API is not hosted by GitHub Pages; deploy the backend
separately and set `VITE_API_URL` to its public API URL to use live data.
