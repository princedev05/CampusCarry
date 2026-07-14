# CampusCarry — Frontend

React web client for **CampusCarry**, the campus gate parcel verification app. Students, guards, and admins each get role-specific dashboards backed by the CampusCarry API.

## Stack

- **React** 19, **React Router** 7  
- **Vite** 8  
- **Tailwind CSS** 4  
- **Axios** (HTTP + refresh-token retry)  
- **react-hot-toast**, **lucide-react**, **recharts** (admin charts)

## Prerequisites

- Node.js 18+ recommended  
- Running [CampusCarry backend](../backend/README.md) (MongoDB + API)

## Setup

```bash
cd frontend
npm install
```

### Environment

Create `.env.local` in this folder (optional). The API client defaults to `http://localhost:7900/api/v1` if unset.

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Full base URL for the REST API (must include `/api/v1`). Example: `http://localhost:3000/api/v1` |

Ensure this matches your backend **PORT** and `/api/v1` prefix. The client sends **cookies** (`withCredentials: true`) for refresh-token flows.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (default `http://localhost:5173`) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project layout

```
src/
  api/           # Axios client, auth/orders/guard/admin helpers
  components/    # Shared UI (Button, Sidebar, Modal, …)
  context/       # AuthProvider / useAuth
  layouts/       # Dashboard shell
  pages/         # Home, auth flows, student/guard/admin dashboards
  utils/         # Token storage, validators, formatting
  App.jsx        # Routes and role guards
  main.jsx       # Root render + Router + Toaster
```

## Authentication

- Access token is stored (see `src/utils/token.js`) and attached as `Authorization: Bearer …`.  
- On **401**, the client attempts `/auth/refresh-token`, then retries the original request or clears auth and redirects to `/login`.

## CORS

The backend must allow your frontend origin (e.g. `http://localhost:5173`) via `CORS_ORIGIN`. See the backend README.

## Related

- Backend API and env vars: [`../backend/README.md`](../backend/README.md)
