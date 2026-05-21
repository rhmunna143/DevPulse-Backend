# DevPulse Backend

**Live API:** [https://devpulse-backend-red.vercel.app](https://devpulse-backend-red.vercel.app)

A RESTful issue-tracking API built with Express and TypeScript, deployed on Vercel with a Neon PostgreSQL database. Supports role-based access control for contributors and maintainers.

---

## Features

- JWT-based authentication with 7-day token expiry
- Role-based access control (contributor / maintainer)
- Full issue lifecycle management — create, read, update, delete
- Filterable issue listing by status, type, and sort order
- Serverless-ready with Neon PostgreSQL (no connection pooling config needed)
- Input validation with meaningful error responses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Database | Neon PostgreSQL (serverless) |
| Auth | JSON Web Tokens (JWT) + bcrypt |
| Deployment | Vercel |
| Dev Server | tsx (hot reload) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database

### Installation

```bash
git clone https://github.com/rhmunna143/devpulse-backend.git
cd devpulse-backend
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
```

The server starts on `http://localhost:5000` by default.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |

---

## API Reference

Base URL: `https://devpulse-backend-red.vercel.app`

All authenticated requests require the JWT token in the `Authorization` header (no `Bearer` prefix):

```
Authorization: <your_token>
```

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive a JWT token |

**POST /api/auth/signup**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "role": "contributor"
}
```
> `role` is optional — defaults to `"contributor"`. Accepted values: `"contributor"`, `"maintainer"`.

**POST /api/auth/login**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

---

### Issues

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/issues` | Yes | contributor, maintainer | Create a new issue |
| `GET` | `/api/issues` | No | — | List all issues |
| `GET` | `/api/issues/:id` | No | — | Get a single issue by ID |
| `PATCH` | `/api/issues/:id` | Yes | contributor, maintainer | Update an issue (role-restricted) |
| `PUT` | `/api/issues/:id` | Yes | contributor, maintainer | Update an issue (same as PATCH) |
| `DELETE` | `/api/issues/:id` | Yes | maintainer | Delete an issue |

#### Query Parameters — GET /api/issues

| Parameter | Values | Default | Description |
|---|---|---|---|
| `sort` | `newest`, `oldest` | `newest` | Sort order by creation date |
| `status` | `open`, `in_progress`, `resolved` | — | Filter by status |
| `type` | `bug`, `feature_request` | — | Filter by issue type |

**Example:** `GET /api/issues?sort=newest&status=open&type=bug`

#### Role-Based Update Rules

| Action | Contributor | Maintainer |
|---|---|---|
| Update own open issue | ✅ | ✅ |
| Update another user's issue | ❌ | ✅ |
| Change issue status | ❌ | ✅ (auto-sets to `in_progress`) |
| Delete issue | ❌ | ✅ |

---

### Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Validation error message"
}
```

---

## Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | SERIAL | PRIMARY KEY |
| `name` | VARCHAR(255) | NOT NULL |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `password` | VARCHAR(255) | NOT NULL |
| `role` | VARCHAR(20) | NOT NULL, default: `'contributor'` |
| `created_at` | TIMESTAMP | NOT NULL, default: NOW() |
| `updated_at` | TIMESTAMP | NOT NULL, default: NOW() |

### `issues`

| Column | Type | Constraints |
|---|---|---|
| `id` | SERIAL | PRIMARY KEY |
| `title` | VARCHAR(150) | NOT NULL |
| `description` | TEXT | NOT NULL |
| `type` | VARCHAR(20) | NOT NULL (`bug` \| `feature_request`) |
| `status` | VARCHAR(20) | NOT NULL, default: `'open'` |
| `reporter_id` | INT | FK → `users(id)` ON DELETE CASCADE |
| `created_at` | TIMESTAMP | NOT NULL, default: NOW() |
| `updated_at` | TIMESTAMP | NOT NULL, default: NOW() |

**Relationship:** One user can report many issues. Deleting a user cascades to delete all their issues.

> Tables are auto-created on server startup via `CREATE TABLE IF NOT EXISTS` — no manual migrations needed.

---

## Postman Collection

Import the collection to test all endpoints locally:

[DevPulse.postman_collection.json](./DevPulse.postman_collection.json)

Set the `baseUrl` variable to `http://localhost:5000` for local testing or `https://devpulse-backend-red.vercel.app` for the live API.

---

## License

MIT — see [LISCENCE.md](./LISCENCE.md)
