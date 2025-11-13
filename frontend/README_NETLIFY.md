Netlify deployment notes

This file explains the Netlify-specific build-time environment and files used by the StudentApp frontend.

Files added
- `frontend/scripts/generate-env.js`: writes `frontend/public/env.js` at build time from Netlify build env vars.
- `frontend/_redirects`: Netlify SPA redirect for client-side routing.
- `netlify.toml`: Netlify build configuration (base dir, publish, build command, redirects).

How it works
- During Netlify build the command in `netlify.toml` runs `npm ci` then `npm run generate:env` which writes `public/env.js` with `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Netlify environment variables.
- The Angular app includes `/env.js` in `index.html` so `window.__env` is available at runtime.

Netlify UI settings
- Base directory: leave blank if using `netlify.toml`, or set to `frontend`.
- Build command: if not using `netlify.toml`, set to: `npm run generate:env && npm run build -- --configuration production`.
- Publish directory: `frontend/dist/frontend` (adjust if you changed `angular.json`).
- Environment variables to add:
  - `SUPABASE_URL` = https://<project-ref>.supabase.co
  - `SUPABASE_ANON_KEY` = (public anon key)

Security notes
- Only put the public anon key in Netlify. **Do not** put the Supabase service role key in Netlify — that key must remain server-side.

Testing locally
- To simulate Netlify build locally:
```
cd frontend
npm run generate:env
npm run build -- --configuration production
npx serve dist/frontend
```
