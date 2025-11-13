# StudentApp

This repository contains a simple Student management application with separate frontend and backend projects.

Structure
- `backend/` - Node.js + Express API using Mongoose to talk to MongoDB.
- `frontend/` - Angular (v20) single-page application.

Quick start (Windows / PowerShell)

1) Backend

```powershell
cd c:/Saaki/StudentApp/backend
npm install
# Start with a custom MongoDB connection string (optional)
# Example (PowerShell):
$env:MONGODB_URI = "mongodb://localhost:27017/studentdb"
npm start
```

If `MONGODB_URI` is not provided, the backend falls back to `mongodb://localhost:27017/studentdb`.

Health check: http://localhost:3000/health

API base: http://localhost:3000/api/students

2) Frontend

```powershell
cd c:/Saaki/StudentApp/frontend
npm install
npm start
# or: npx ng serve --configuration development
```

By default the Angular dev server runs on `http://localhost:4200`.

Notes and recommended improvements
- Consider using a `.env` file and the `dotenv` package for local development.
- Add a root-level npm script or a simple script (e.g., using concurrently) to run both backend and frontend together.
- Add integration or smoke tests for the API endpoints.

If you want, I can add a `.env` example, wire up `dotenv` in the backend, or add a simple `Makefile` / npm script to run both parts concurrently.

Deployment and Hosting Notes
--------------------------------

Frontend (Netlify)
- Use Netlify to host the static Angular build. This repo includes `netlify.toml`, `frontend/_redirects`, and a build helper `frontend/scripts/generate-env.js` which writes a runtime `public/env.js` from Netlify build environment variables.
- On Netlify set these environment variables in Site Settings → Build & deploy → Environment:
	- `SUPABASE_URL` (e.g. `https://<project-ref>.supabase.co`)
	- `SUPABASE_ANON_KEY` (public anon key)
- Deploy steps (Netlify will use `netlify.toml` automatically):
	1. Push repo to GitHub (or other Git provider).
	2. In Netlify: New site → Import from Git → select repo.
	3. Netlify will run the build command and publish `frontend/dist/frontend`.

Backend (Server)
- Host the backend separately (recommended): Render, Railway, Fly, Heroku, or a VPS. The backend requires the `SUPABASE_SERVICE_ROLE_KEY` which is a privileged key and must remain server-side.
- Add these environment variables on your backend host:
	- `MONGODB_URI` (your MongoDB connection string)
	- `SUPABASE_SERVICE_ROLE_KEY` (service role key — SECRET)
	- `SUPABASE_URL` (optional)

Security reminders
- Never put `SUPABASE_SERVICE_ROLE_KEY` into Netlify or frontend code. Keep it only on the backend or in a secure secret manager.
- The repo contains `backend/.env.example` (do not commit real secrets).

Files added to help deploy to Netlify
- `netlify.toml` — build config and SPA redirect
- `frontend/scripts/generate-env.js` — writes `frontend/public/env.js` at build time
- `frontend/_redirects` — SPA fallback for client-side routes

If you want, I can also:
- Add a small server-only `/api/_admin/supabase-check` endpoint that reports whether Supabase server config is present (safe: it won't print the key).
- Create `backend/.env` locally for you (I cannot store secrets), or help set secrets in your chosen host.

