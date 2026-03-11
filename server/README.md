# Server Guide (Express Basics)

This document explains what the server code is doing, especially the `src/routes` folder.

## What this server does

This is an Express API for Pokemon data.

The server:

- Receives HTTP requests from the client.
- Matches each request to a route handler.
- Runs SQL queries against PostgreSQL.
- Returns JSON responses.

## Folder map

Inside `server/src`:

- `server.ts`: Entry point. Creates the Express app, sets middleware, mounts routes, starts the server.
- `routes/`: Endpoint handlers grouped by resource (`pokemon`, `types`, `abilities`).
- `config/database.ts`: Creates and exports the PostgreSQL connection pool (`pool`).
- `types/`: TypeScript interfaces and request body types.
- `queries/`: (Optional helper layer) SQL builder/helper functions.

## What `src/routes` is for

`src/routes` is where API endpoints live.

Each file creates an Express `Router` and defines paths like `GET /` or `POST /` for a specific resource.

Example in this project:

- `routes/pokemon.ts` handles Pokemon endpoints.
- `routes/types.ts` handles type endpoints.
- `routes/abilities.ts` handles ability endpoints.

This keeps code organized so one huge file does not contain every endpoint.

## How routes get used

In `src/server.ts`, each route file is mounted to a base path:

- `app.use('/api/pokemon', pokemonRoutes)`
- `app.use('/api/types', typesRoutes)`
- `app.use('/api/abilities', abilitiesRoutes)`

What this means:

- A handler defined as `router.get('/')` in `routes/pokemon.ts`
- Becomes `GET /api/pokemon` at runtime.

## Request flow (simple)

When a request comes in, the flow is:

1. Express receives request in `server.ts`.
2. Middleware runs (CORS and JSON parsing).
3. Express picks the matching route file.
4. Route handler runs SQL using `pool.query(...)`.
5. Result rows are returned as JSON.

## `routes/pokemon.ts` at a glance

This file contains the main CRUD-style endpoints:

- `GET /api/pokemon`: Get all Pokemon with joined types/abilities.
- `GET /api/pokemon/:id`: Get one Pokemon by ID.
- `GET /api/pokemon/search?q=name`: Search by name.
- `POST /api/pokemon`: Create a Pokemon (and related types/abilities).
- `PUT /api/pokemon/:id`: Update a Pokemon (and related types/abilities).
- `DELETE /api/pokemon/:id`: Delete a Pokemon.

The create and update handlers use transactions:

- `BEGIN` before related writes.
- `COMMIT` if all queries succeed.
- `ROLLBACK` on error.

This prevents partial/inconsistent writes.

## TypeScript types you will see

From `src/types/index.ts`:

- `Pokemon`, `Type`, `Ability`: Data shapes from database tables.
- `PokemonWithDetails`: Pokemon plus arrays of `types` and `abilities`.
- `CreatePokemonInput`, `UpdatePokemonInput`: Request body shapes for POST/PUT.
- `DatabaseError`: Error shape that may include `code` (for checks like unique constraint errors).

You also will see:

- `catch (error: unknown)`

This is preferred over `any` because it is safer. You must narrow the error type before using custom properties.

## Quick run and test

From the `server` folder:

```bash
npm install
npm run dev
```

Try a couple of endpoints:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/pokemon
```

## Mental model for beginners

Think of each route handler as a small function with one job:

- Read input (params/query/body)
- Query/update DB
- Send JSON response

If you can trace those 3 steps in one handler, you can understand the whole API.
