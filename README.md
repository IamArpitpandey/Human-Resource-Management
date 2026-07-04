# Human Resource Management System (HRMS)

A full-stack **Human Resource Management System (HRMS)** built to simplify employee management for organizations. The application provides secure authentication, attendance tracking, leave management, payroll management, and role-based dashboards for Employees, HR, and Administrators.

## 🚀 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Zod Validation

---

# ✨ Features

### Authentication
- User Registration
- Secure Login
- JWT Authentication
- Refresh Tokens
- Email Verification
- Forgot & Reset Password
- Logout

### Role-Based Access
- Employee
- HR
- Admin

### Employee Management
- View and update profile
- Manage employee details
- Department management

### Attendance Management
- Check In / Check Out
- Daily attendance
- Monthly attendance history
- Late arrival detection

### Leave Management
- Apply for leave
- Approve or reject leave requests
- Prevent overlapping leave requests
- Track leave status

### Payroll
- Salary structure management
- Generate payslips
- Employee salary view

### Dashboards
- Employee Dashboard
- HR Dashboard
- Admin Dashboard
- Live statistics and summaries

### Notifications
- Leave approval/rejection notifications
- Important system updates

---

# 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Rate Limiting
- Helmet Security Headers
- CORS Protection
- Request Validation with Zod
- Centralized Error Handling

---

# 📂 Project Structure

```
hrms/
│
├── client/        # React Frontend
│
└── server/        # Express Backend
```

---

# 📋 Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or later)
- MongoDB (Local or Atlas)

---

# ⚙️ Backend Setup

```bash
cd server

cp .env.example .env

npm install

npm run seed

npm run dev
```

Backend will run at:

```
http://localhost:5000
```

Swagger Documentation:

```
http://localhost:5000/api-docs
```

Health Check:

```
http://localhost:5000/health
```

---

# 💻 Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

During development, the frontend automatically proxies API requests to the backend.

---

# 🔑 Default Admin Account

After running the seed command:

```
Email:
admin@hrms.com

Password:
Admin@123
```

> **Note:** Change the default password before deploying the application.

---

# 🌱 Environment Variables

Create a `.env` file inside the `server` directory.

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string |
| JWT_ACCESS_SECRET | JWT Access Token Secret |
| JWT_REFRESH_SECRET | JWT Refresh Token Secret |
| CLIENT_URL | Frontend URL |
| SMTP_* | SMTP configuration for emails |

---

# 📌 API Endpoints

### Authentication

```
POST /auth/signup
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
```

### Employee

```
GET /employees/me
PATCH /employees/me

GET /employees
POST /employees
PATCH /employees
DELETE /employees
```

### Attendance

```
POST /attendance/check-in
POST /attendance/check-out

GET /attendance/me
GET /attendance
```

### Leave

```
POST /leaves
GET /leaves/me
GET /leaves
PATCH /leaves/:id/decision
```

### Payroll

```
GET /payroll/me/salary
GET /payroll/me/payslips

PUT /payroll/:employeeId/salary-structure
POST /payroll/generate
```

### Departments

```
GET /departments
POST /departments
DELETE /departments
```

### Dashboard

```
GET /dashboard/employee
GET /dashboard/admin
```

### Notifications

```
GET /notifications
PATCH /notifications/:id/read
```

---

# 🛠️ Development Notes

This project has been developed using a modular architecture to make it easy to maintain and extend.

Before using it in a production environment:

- Configure a real MongoDB database.
- Set strong JWT secrets.
- Configure SMTP credentials for email services.
- Build the frontend using:

```bash
cd client
npm run build
```

- Deploy the frontend and backend behind a reverse proxy such as Nginx.

---

# 👨‍💻 Future Improvements

- Biometric Attendance
- Google OAuth Login
- Payroll Reports (PDF)
- Email Notifications
- Employee Performance Module
- Mobile Responsive Enhancements
- Docker Deployment
- CI/CD Pipeline

---

# 📄 License

This project is developed for learning and academic purposes. Feel free to modify and extend it according to your requirements.