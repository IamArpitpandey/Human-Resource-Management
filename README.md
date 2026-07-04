# HRMS — Human Resource Management System

Full-stack HRMS built with **Node.js + Express + MongoDB (Mongoose)** on the backend and **React (Vite) + Tailwind CSS + Redux Toolkit** on the frontend.

## Features
- JWT authentication (signup, login, refresh token, logout, forgot/reset password, email verification)
- Role-based access control: **Employee / HR / Admin**
- Employee profile management
- Attendance: check-in/check-out, daily/monthly history, late detection
- Leave management: apply, approve/reject, overlap detection
- Payroll: salary structure, payslip generation
- Departments CRUD
- Notifications (leave decisions trigger a notification)
- Admin & Employee dashboards with live stats
- Rate limiting, Helmet, CORS, input validation (Zod), centralized error handling

## Project Structure
```
hrms/
├── server/     # Node.js + Express + MongoDB API
└── client/     # React + Vite frontend
```

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## Backend Setup
```bash
cd server
cp .env.example .env      # edit values as needed (Mongo URI, JWT secrets, SMTP)
npm install
npm run seed               # creates default departments + admin user (admin@hrms.com / Admin@123)
npm run dev                # starts on http://localhost:5000
```

API docs (Swagger UI): `http://localhost:5000/api-docs`
Health check: `http://localhost:5000/health`

## Frontend Setup
```bash
cd client
npm install
npm run dev                # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no extra CORS config is needed in development.

## Default Admin Login (after seeding)
```
Email:    admin@hrms.com
Password: Admin@123
```
⚠️ Change this password immediately in a real deployment.

## Environment Variables (server/.env)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing tokens — change these in production |
| `CLIENT_URL` | Frontend origin, used for CORS and email links |
| `SMTP_*` | Optional — if left blank, emails are logged to console instead of sent |

## API Overview (`/api/v1`)
- `POST /auth/signup`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`
- `GET/PATCH /employees/me`, `GET/POST/PATCH/DELETE /employees` (Admin/HR)
- `POST /attendance/check-in`, `/attendance/check-out`, `GET /attendance/me`, `GET /attendance` (Admin/HR)
- `POST /leaves`, `GET /leaves/me`, `GET /leaves` (Admin/HR), `PATCH /leaves/:id/decision` (Admin/HR)
- `GET /payroll/me/salary`, `/payroll/me/payslips`, `PUT /payroll/:employeeId/salary-structure` (Admin), `POST /payroll/generate` (Admin)
- `GET/POST/DELETE /departments`
- `GET /dashboard/employee`, `GET /dashboard/admin`
- `GET /notifications`, `PATCH /notifications/:id/read`

## Notes on this build
- This project was scaffolded and tested in a sandboxed environment without full internet access, so live MongoDB connectivity could not be verified end-to-end here. All code has been syntax-checked, the Express app boots cleanly, and the frontend builds without errors. **Before real use, run both `npm install` steps and `npm run seed` against a real MongoDB instance and smoke-test the main flows (signup → login → check-in → apply leave → admin approve).**
- Passwords are hashed with bcrypt; access tokens are short-lived JWTs, refresh tokens are stored server-side and rotated on refresh.
- For production: set strong values for `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET`, configure real SMTP credentials, and serve the built frontend (`npm run build` in `client/`) behind a reverse proxy alongside the API.
