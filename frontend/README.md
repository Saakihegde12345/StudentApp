# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Local runtime environment for Supabase (dev)

The frontend reads runtime values from `window.__env` (file `public/env.js`) so the same build can be deployed to different hosts.

To create a local `public/env.js` for development without exposing server secrets:

1. Create a `public/env.js` file in `frontend/public` with these keys:

```js
window.__env = {
	SUPABASE_URL: 'https://your-project.supabase.co',
	SUPABASE_ANON_KEY: 'public-anon-key-goes-here',
	API_BASE_URL: 'http://localhost:3000'
};
```

2. OR use the helper script from the `frontend` folder which will read from environment variables or the repo `.env` (but will NEVER write or expose a service-role key):

PowerShell example:
```pwsh
cd frontend
# set env vars in the current shell (or ensure repo .env contains SUPABASE_ANON_KEY)
$env:SUPABASE_URL = 'https://your-project.supabase.co'
$env:SUPABASE_ANON_KEY = 'public-anon-key'
node ./scripts/create-local-env.js
npm start
```

Important: do NOT put `SUPABASE_SERVICE_ROLE_KEY` into the frontend `public/env.js` — that key must remain server-side only.
