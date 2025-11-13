Project: StudentApp — Implementation Summary

Overview

- Purpose: StudentApp is a full-stack sample application providing CRUD for student records. Authentication is handled by Supabase Auth, while application domain data (students) is stored in MongoDB via a Node/Express API.
- Scope of changes: Added environment support, runtime env injection for frontend, Angular Material UI improvements, Supabase-based authentication (frontend + server-side verification), route protection, project-level scripts to bootstrap and start services, and many runtime/build fixes to support Windows and dev workflows.

High-level Architecture

- Frontend (Angular)
  - Standalone components (Angular v20)
  - Angular Material for UI (toolbar, forms, snackbars, icons)
  - Uses `@supabase/supabase-js` client for auth flows (signup, signin, session events)
  - `public/env.js` or meta tags used at runtime to inject `SUPABASE_URL` and `SUPABASE_ANON_KEY` so builds can be environment-agnostic
  - `StudentService` consumes backend REST API and attaches Supabase access tokens to protected write requests
  - `AuthService` exposes `user$`, `getAccessToken()` and handles session change events
  - `AuthGuard` protects create/edit routes

- Backend (Node.js / Express / Mongoose)
  - Express 5.x with Mongoose (MongoDB) for student and minimal user profile storage
  - `verifySupabase` middleware uses the Supabase service role key to validate incoming `Authorization: Bearer <token>` headers server-side and upserts a minimal user into Mongo
  - Protected endpoints: POST/PUT/DELETE for `/api/students` are guarded by `verifySupabase`
  - `.env` support with explicit loading of `backend/.env` and fallback to repo-root `.env`

Key Implementation Details

1) Environment & Runtime Injection
- Frontend runtime keys: `window.__env` (via `public/env.js`) or HTML meta tags. This avoids baking keys into bundles and allows different keys per deployment environment.
- Backend secrets: `SUPABASE_SERVICE_ROLE_KEY` must only exist server-side. Backend loads `.env` (backend and repo root fallback) via `dotenv`.

2) Supabase Client Safety & LockManager Workaround
- Problem: `@supabase/supabase-js` may attempt async storage using the Navigator LockManager and throw `NavigatorLockAcquireTimeoutError` in some environments.
- Fix: frontend `supabase-client.service.ts` initializes the client with `auth: { persistSession: false }` and provides a small synchronous `storage` adapter that uses `localStorage` when available. This prevents async lock usage while keeping session handling workable for dev. If persistent session support is required later, implement a proper storage adapter or re-enable persistence if environment supports Navigator.locks.

3) Server-side Token Verification
- `backend/middleware/verifySupabase.js` creates a Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY` (server-only) and calls `supabase.auth.getUser(token)` to validate tokens.
- On success: minimal user profile is upserted into MongoDB `users` collection and `req.user` is populated.
- On failure: middleware rejects with 401. When the service key is missing, the middleware logs a warning and rejects requests — this helps preserve client security expectations.

4) UI & UX
- Converted student list/create/edit views and auth forms to Angular Material components.
- Added toolbar UI that shows login/register when unauthenticated and the logged-in user email + logout when authenticated.
- Added snackbars for feedback on create/update/delete operations.

5) Project-level scripts & cross-platform support
- `scripts/bootstrap.js` to run `npm install` in subprojects (backend and frontend).
- `scripts/start.js` to launch backend and frontend together with prefixed logs. These scripts are written to work cross-platform and handle Windows shells.

6) Build & Performance
- Removed global Bootstrap from the Angular build to reduce bundle size.
- Added lazy-loading for create/edit and auth routes to reduce initial bundle size.
- Adjusted production budgets temporarily during development; recommended final cleanup to further reduce bundle weight.

Files Changed / Added (selected)

- Root
  - `scripts/bootstrap.js`, `scripts/start.js` — bootstrap and start helpers
  - `.env.example` — example environment variables
  - `PROJECT_DESCRIPTION.md` — this file

- Backend
  - `backend/app.js` — dotenv loading, health endpoint, DB startup
  - `backend/middleware/verifySupabase.js` — new server-side Supabase verification middleware
  - `backend/models/user.model.js` — minimal user model (supabaseId, email, name)
  - Modified `backend/routes/routes.js` to apply `verifySupabase` to POST/PUT/DELETE

- Frontend
  - `frontend/public/env.js` — runtime env injection helper (sets `window.__env`)
  - `frontend/src/app/services/supabase-client.service.ts` — safe client, storage adapter, disabled persistSession
  - `frontend/src/app/services/auth.service.ts` — auth state, getAccessToken()
  - `frontend/src/app/services/register-service.ts` & `login-service.ts` — signup/login wrappers
  - `frontend/src/app/services/student-service.ts` — attaches Authorization header for write operations
  - `frontend/src/app/guards/auth.guard.ts` — route protection
  - Converted components under `frontend/src/app/components/*` to Angular Material
  - Routing updates: lazy-loaded auth/create/edit routes in `app.routes.ts`

How to run locally (development)

1) Install dependencies and bootstrap (root):

```powershell
cd C:\Saaki\StudentApp
npm run install:all
```

2) Provide required env vars:
- Create `backend/.env` or use repo-root `.env` (recommended to move secret into `backend/.env`)
  - `MONGODB_URI` — your MongoDB connection string (or use local fallback)
  - `SUPABASE_URL` — e.g. `https://<project-ref>.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-only)
- For frontend runtime keys, create `frontend/public/env.js` that sets `window.__env` or add meta tags to `frontend/src/index.html`.

3) Start both services from repo root:

```powershell
cd C:\Saaki\StudentApp
npm start
```

4) Open frontend: http://localhost:4200
   Backend API: http://localhost:3000/api/students

Notes on testing auth-protected routes
- Log in from the frontend (Signup / Login). The frontend will receive an access token from Supabase.
- `StudentService` attaches the token as `Authorization: Bearer <token>` when performing POST/PUT/DELETE.
- Backend `verifySupabase` validates the token with the Supabase admin client.

Security & Deployment Notes
- The `SUPABASE_SERVICE_ROLE_KEY` is a privileged secret. Never expose it to client code or commit it to the repo. Use host-managed secrets (Heroku config, Vercel/Azure environment variables, Docker secrets, etc.).
- Move the service key to `backend/.env` or a secrets store and remove it from repo-root `.env` once confirmed.
- Consider implementing a server-side `/api/me` endpoint that returns the synced Mongo profile for the logged-in user.

Known Issues & Trade-offs
- Session persistence for Supabase client is disabled (`persistSession: false`) to avoid Navigator LockManager errors. If you need persistent sessions, implement a storage adapter or re-enable persistence in environments that support locks.
- SMTP/email verification was initially disabled for testing — production should configure Supabase outgoing email settings so newly registered users get verification emails.

Next Recommended Tasks
- Move the service key to `backend/.env` and remove it from repo root; then remove fallback loading of repo-root env in `backend/app.js` (we added the fallback to ease development).
- Add a polite post-registration UI message and "Resend verification" action.
- Add server-only `/api/_admin/supabase-check` that returns presence-of-config (safe) and connectivity to Supabase.
- Add e2e tests for auth-protected operations.

Contact

If you'd like I can:
- Clean up production build budgets and remove unused libs
- Implement persistent session storage adapter for Supabase
- Add a small admin health-check endpoint

— End of Project Description
