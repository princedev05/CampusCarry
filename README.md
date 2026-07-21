# 📦 CampusCarry

A full-stack **parcel management system** for college campuses. Students register expected parcels, guards verify arrivals at the gate using tracking ID + OTP, pickup tokens are assigned, and parcels are handed over after confirmation.

🔗 **Live Demo (Frontend):** https://campus-carry-rho.vercel.app/
🔗 **Backend API:** https://campuscarry-backend.onrender.com/
🔗 **Health Check:** https://campuscarry-backend.onrender.com/api/v1/healthcheck

> ⚠️ **Note:** Backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

---

## ✨ Features

- 🔐 **JWT Authentication** — secure access + refresh token flow
- 🎫 **OTP-based Gate Verification** — guards verify parcel arrivals using tracking ID + OTP
- 🔢 **Pickup Token System** — token pool assignment for organized, queue-free pickups
- 📧 **Email Notifications** — automated emails for password reset and parcel updates
- 📊 **Admin Analytics Dashboard** — parcel volume, pickup trends, and guard activity insights
- 👥 **Role-based Access Control** — separate flows for students, guards, and admins

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (access + refresh tokens) |
| Validation | express-validator |
| Email | Nodemailer (Mailtrap) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📂 Project Structure

```
CampusCarry/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # Express routers
│   │   ├── models/         # Mongoose schemas
│   │   ├── middlewares/    # Auth, roles, validation, errors
│   │   ├── validators/     # express-validator chains
│   │   ├── utils/          # Mail, responses, helpers
│   │   ├── sockets/        # Socket.io event handlers
│   │   ├── db/             # Mongo connection
│   │   ├── app.js          # Express app + CORS + route mounting
│   │   └── index.js        # Entry: env, DB, token pool init, listen
│   ├── scripts/
│   │   └── seedDemoData.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/         # Auth/socket context providers
│   │   ├── api/             # Axios instance / API calls
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/princedev05/CampusCarry.git
cd CampusCarry
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `PORT` | No | HTTP port (default 3000) |
| `ACCESS_TOKEN_SECRET` | Yes | Secret for signing access JWTs |
| `ACCESS_TOKEN_EXPIRY` | Yes | Access token lifetime (e.g. `15m`) |
| `REFRESH_TOKEN_SECRET` | Yes | Secret for signing refresh JWTs |
| `REFRESH_TOKEN_EXPIRY` | No | Refresh token lifetime |
| `CORS_ORIGIN` | No | Comma-separated allowed origins |
| `NODE_ENV` | No | `development` for verbose errors |
| `FORGOT_PASSWORD_REDIRECT_URL` | For email | Base URL for password reset link |
| `MAILTRAP_SMTP_HOST` | For email | SMTP host |
| `MAILTRAP_SMTP_PORT` | For email | SMTP port |
| `MAILTRAP_SMTP_USER` | For email | SMTP user |
| `MAILTRAP_SMTP_PASS` | For email | SMTP password |

Run the server:
```bash
npm run dev      # nodemon — hot reload
# or
npm start
```

Optional demo data:
```bash
npm run seed:demo
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```
VITE_API_URL=http://localhost:3000/api/v1
```

Run the frontend:
```bash
npm run dev
```

---

## 📡 API Overview

Base path: `/api/v1`

| Prefix | Purpose |
|---|---|
| `/auth` | Register, login, logout, refresh, email verification, password reset |
| `/orders` | Student orders (create, list, cancel, …) |
| `/guard` | Guard deliveries, verify arrival, handover |
| `/token` | Generate / verify pickup tokens |
| `/delivery` | Delivery lifecycle helpers |
| `/admin` | Admin-only analytics and management |
| `/healthcheck` | Health probe |

**Example — Guard verifies a delivery:**
```http
POST /api/v1/guard/verify-delivery
Authorization: Bearer <access_token>
Content-Type: application/json

{ "trackingId": "...", "otp": "..." }
```

---

## 👥 Roles

| Role | Access |
|---|---|
| **Student** | Register parcels, view pickup tokens |
| **Guard** | Verify deliveries via OTP, hand over parcels |
| **Admin** | View analytics, manage users and deliveries |

---

## 🔒 Security Notes

- Passwords hashed with bcrypt
- JWT access + refresh token pattern with HTTP-only cookies
- All inputs validated via `express-validator` + middleware
- Role-based route protection

---

## 🗺️ Roadmap

- [ ] QR code-based pickup verification
- [ ] Rate limiting on OTP endpoints
- [ ] Audit logs for parcel handovers
- [ ] Docker + docker-compose setup
- [ ] CI pipeline (GitHub Actions)
- [ ] Automated tests (Jest + Supertest)

---

## 📄 License

This project is open for educational and portfolio purposes.

