# Pokemon Test Data Management

Full-stack TypeScript workspace for a Pokemon test data management app.

## Stack

- Client: Vite, React, TypeScript
- Server: Node.js, Express, TypeScript
- Tooling: ESLint, Prettier, Husky, Vitest
- Database: SQL schema in `database/schema.sql`

## Prerequisites

- Node.js `20.19+` or `22.12+`
- npm

## Installation

Install dependencies in the root workspace, client, and server:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Load the Schema

```bash
# Copy the SQL file into the container
docker cp database/schema.sql pokemon-db:/schema.sql

# Execute it
docker exec -it pokemon-db psql -U postgres -d pokemon_test -f /schema.sql
```

## Verify

```bash
# List all tables (should see 5 tables)
docker exec -it pokemon-db psql -U postgres -d pokemon_test -c "\dt"

# See all types (these will populate your dropdown)
docker exec -it pokemon-db psql -U postgres -d pokemon_test -c "SELECT * FROM types ORDER BY name;"

# See all abilities (these will populate your dropdown)
docker exec -it pokemon-db psql -U postgres -d pokemon_test -c "SELECT * FROM abilities ORDER BY name;"

# See all Pokémon (your starting data)
docker exec -it pokemon-db psql -U postgres -d pokemon_test -c "SELECT id, name, height, weight FROM pokemon ORDER BY id;"
## Running the App
```

Start the client:

```bash
cd client
npm run dev
```

Start the server:

```bash
cd server
npm run dev
```

Run the server once without watch mode:

```bash
cd server
npm run start
```

## Root Workspace Commands

Run ESLint across the workspace:

```bash
npm run lint
```

Run strict ESLint with zero warnings allowed:

```bash
npm run lint:js
```

Run tests:

```bash
npm test
```

## Client Commands

```bash
cd client
npm run dev
npm run build
npm run preview
npm run lint
```

## Server Commands

```bash
cd server
npm run dev
npm run start
```

## Database

The database schema lives in `database/schema.sql`.

## Notes

- `server/server.ts` is present for the TypeScript Express server entry point.
- Husky is configured through `.husky/pre-commit` for pre-commit checks.

## Project Structure

```text
pokemon-data-management/
├── client/                 <-- React UI Code
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── database/                 <-- Database schema
│   └── schema.sql
├── server/                   <-- Express API Code
│   ├── nodemon.json
│   ├── package.json
│   ├── server.ts
│   └── tsconfig.json
├── tests/                    <-- Test Suite
│   └── smoke.test.ts
├── .husky/
│   └── pre-commit
├── eslint.config.mts
├── package.json              <-- Root package.json
├── tsconfig.eslint.json
├── tsconfig.json
└── vitest.config.ts
```
