# FlowTask API

NestJS + TypeORM + PostgreSQL backend for the FlowTask React app.

- Base URL: `http://localhost:3000` (override with the `PORT` env var)
- CORS: allows `http://localhost:5173` (the Vite dev server)
- Auth: none (single-user app)
- Bodies are JSON. Unknown properties are stripped, invalid ones return `400`.

## Run

```bash
docker start todo-db      # postgres:16 on port 5432
npm install
npm run start:dev
```

Database settings live in `src/app.module.ts`: database `todo-db`, user and
password `postgres`. `DB_HOST` and `DB_PORT` can be overridden through env vars.
`synchronize: true` creates and updates the tables automatically.

> Port 5432 must belong to the Docker container. If a native Windows Postgres
> service (`postgresql-x64-18`) is running it takes the port and the server
> fails with `database "todo-db" does not exist`. Stop that service first.

## Data model

### Todo

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | generated |
| `title` | string | required, max 200 chars |
| `description` | string | default `""` |
| `status` | string | `To Do` (default), `In Progress`, `Done` |
| `priority` | string | `Low`, `Medium` (default), `High` |
| `category` | string | `Design`, `Development` (default), `Feature`, `Management`, `QA`, `Personal` |
| `starred` | boolean | default `false` |
| `position` | integer | list order, lowest first; managed by the server |
| `createdAt` | ISO date string | generated |

### User profile

Only one profile exists (id `1`). It is created from the defaults on first read.

| Field | Type | Notes |
|---|---|---|
| `id` | number | always `1` |
| `username` | string | required |
| `displayName` | string | required |
| `title`, `email`, `avatarUrl`, `bio` | string | optional |

## Todos

### `GET /todos`
Returns all todos ordered by `position`.

### `GET /todos/:id`
Returns one todo. `404` if it doesn't exist, `400` if `:id` is not a UUID.

### `POST /todos`
Creates a todo and puts it at the top of the list. Responds `201` with the todo.

```json
{
  "title": "Prepare sprint demo",
  "description": "Record walkthrough video",
  "status": "To Do",
  "priority": "High",
  "category": "Management",
  "starred": true
}
```

Only `title` is required.

### `PATCH /todos/:id`
Partial update. Send any of the create fields. Returns the updated todo.
Also used for starring (`{"starred": true}`) and status changes (`{"status": "Done"}`).

### `DELETE /todos/:id`
Deletes a todo. Responds `204` with no body, `404` if missing.

### `PUT /todos/reorder`
Saves a drag-and-drop result. `ids` is the new order of the todos the user
sees, which may be a filtered subset. Those todos swap into the positions they
already occupied, so todos that were not sent keep their place. Returns the full
ordered list.

```json
{ "ids": ["<uuid>", "<uuid>", "<uuid>"] }
```

### `PATCH /todos/bulk/status`
Sets the status of several todos at once. Returns `{ "updated": <count> }`.

```json
{ "ids": ["<uuid>", "<uuid>"], "status": "Done" }
```

### `DELETE /todos/bulk`
Deletes several todos. Returns `{ "deleted": <count> }`.

```json
{ "ids": ["<uuid>", "<uuid>"] }
```

`ids` must be a non-empty array of UUIDs for all three bulk and reorder routes.

## User

### `GET /user`
Returns the profile (creating the default one if none exists).

### `PUT /user`
Updates the profile. Fields that are not sent keep their current value.

```json
{
  "username": "alexmorgan",
  "displayName": "Alex Morgan",
  "title": "Senior Product Engineer",
  "email": "alex.morgan@flowtask.io",
  "avatarUrl": "https://example.com/me.png",
  "bio": "Building things."
}
```

`username` and `displayName` are required and cannot be empty.

## Demo

### `POST /demo/reset`
Deletes all todos, restores the 6 sample tasks from the frontend's seed data
and resets the profile to the default user. Returns `{ "todos": [...], "user": {...} }`.

## Errors

Validation errors use Nest's standard shape:

```json
{
  "message": ["status must be one of the following values: To Do, In Progress, Done"],
  "error": "Bad Request",
  "statusCode": 400
}
```

| Code | When |
|---|---|
| `400` | invalid body, invalid status/priority/category, non-UUID id |
| `404` | todo not found |

## Project layout

```
src/
  todo/    entity, DTOs, service, controller (/todos)
  user/    profile entity, service, controller (/user)
  demo/    demo reset (/demo/reset)
  app.module.ts, main.ts
```

## Tests

```bash
npm test          # unit tests (vitest)
npm run build     # compile check
```

## Migrations

The app currently relies on `synchronize: true`. To switch to migrations:

```bash
npm run typeorm -- migration:generate src/migrations/init
npm run typeorm -- migration:run
```

then set `synchronize: false` in `src/app.module.ts`.
