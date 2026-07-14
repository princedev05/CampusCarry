# CampusCarry — Backend

REST API for **CampusCarry**: students register expected parcels, guards verify arrivals at the gate (tracking ID + OTP), pickup tokens are assigned, and parcels are handed over after confirmation.

Built with **Node.js**, **Express** 5, **MongoDB** / **Mongoose**, **JWT** auth (access + refresh), and **express-validator**.

## Prerequisites

- Node.js 18+  
- MongoDB instance (local or Atlas)

## Quick start

```bash
cd backend
npm install
```

Create a `.env` file in this folder using the variables below. Then:

```bash
npm run dev      # nodemon — hot reload
# or
npm start        # node src/index.js
```

Default listen port is **3000** unless `PORT` is set. On startup the app connects to MongoDB and initializes the pickup-token pool (numbers 1–100).

### Demo data (optional)

```bash
npm run seed:demo
```

Seeds demo users, orders, and token records (requires valid `.env` and MongoDB).

## Environment variables

Create `backend/.env` in this directory (`dotenv` loads `./.env` from `src/index.js`).

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `PORT` | No | HTTP port (default `3000`) |
| `ACCESS_TOKEN_SECRET` | Yes | Secret for signing access JWTs |
| `ACCESS_TOKEN_EXPIRY` | Yes | Access token lifetime (e.g. `15m`, `1d`) |
| `REFRESH_TOKEN_SECRET` | Yes | Secret for signing refresh JWTs |
| `REFRESH_TOKEN_EXPIRY` | No | Refresh token lifetime |
| `CORS_ORIGIN` | No | Comma-separated allowed origins (default `http://localhost:5173`) |
| `NODE_ENV` | No | Set `development` for verbose errors in middleware |
| `FORGOT_PASSWORD_REDIRECT_URL` | For password reset emails | Base URL for reset link (token appended as path segment) |
| `MAILTRAP_SMTP_HOST` | For email | SMTP host (e.g. Mailtrap) |
| `MAILTRAP_SMTP_PORT` | For email | SMTP port |
| `MAILTRAP_SMTP_USER` | For email | SMTP user |
| `MAILTRAP_SMTP_PASS` | For email | SMTP password |

**Frontend alignment:** Point the SPA at `http://localhost:<PORT>/api/v1` (see frontend `VITE_API_URL`).

## API overview

Base path: **`/api/v1`**

| Prefix | Purpose |
|--------|---------|
| `/auth` | Register, login, logout, refresh, email verification, password reset |
| `/orders` | Student orders (create, list, cancel, …) |
| `/guard` | Guard deliveries, verify arrival, handover |
| `/token` | Generate / verify pickup tokens (`/generate`, `/verify`) |
| `/delivery` | Delivery lifecycle helpers (arrived / pickup, per routes) |
| `/admin` | Admin-only analytics and management |
| `/healthcheck` | Health probe |

Example guard verification:

```http
POST /api/v1/guard/verify-delivery
Authorization: Bearer <access_token>
Content-Type: application/json

{ "trackingId": "...", "otp": "..." }
```

## Project layout

```
src/
  controllers/   # Route handlers
  routes/        # Express routers mounted in app.js
  models/        # Mongoose schemas
  middlewares/   # Auth, roles, validation, errors
  validators/    # express-validator chains
  utils/         # Mail, responses, helpers
  db/            # Mongo connection
  app.js         # Express app + CORS + route mounting
  index.js       # Entry: env, DB, token pool init, listen
scripts/
  seedDemoData.js
```

## Roles

- **student** — orders and pickup flows  
- **guard** — accept/verify deliveries, handover  
- **admin** — administrative endpoints  

Protected routes use JWT middleware and role checks where applicable.

## Security notes

- Passwords hashed with **bcrypt**  
- HTTP-only cookie patterns may be used alongside JWT refresh (see auth controllers)  
- Validate all inputs via validators + middleware  

## Related

- Frontend setup and `VITE_API_URL`: [`../frontend/README.md`](../frontend/README.md)
