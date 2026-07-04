/**
 * API client + endpoints for the HRMS backend.
 * Configure your base URL via VITE_API_URL or fallback to localhost.
 */
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,           // 15s timeout so we never hang forever
  headers: { 'Content-Type': 'application/json' },
});

// ===== Request interceptor: attach JWT =====
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('hrms_auth');
    if (raw) {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch { /* ignore */ }
  return config;
});

// ===== Response interceptor: handle 401 globally =====
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token invalid/expired — clear and let route guards redirect
      try { localStorage.removeItem('hrms_auth'); } catch { /* ignore */ }
    }
    return Promise.reject(err);
  }
);

// ===== Endpoint groups =====
export const authApi = {
  signup:   (data) => api.post('/auth/signup', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   (refreshToken) => api.post('/auth/logout', { refreshToken }),
  me:       ()     => api.get('/auth/me'),
};

export const dashboardApi = {
  admin:    () => api.get('/dashboard/admin'),
  employee: () => api.get('/dashboard/employee'),
};

export const employeeApi = {
  list:   (params)     => api.get('/employees', { params }),
  getMe:  ()           => api.get('/employees/me'),
  create: (data)       => api.post('/employees', data),
  updateMe: (data)     => api.patch('/employees/me', data),
  remove: (id)         => api.delete(`/employees/${id}`),
};

export const departmentApi = {
  list:   ()           => api.get('/departments'),
  create: (name)       => api.post('/departments', { name }),
  remove: (id)         => api.delete(`/departments/${id}`),
};

export const attendanceApi = {
  getMine:  ()        => api.get('/attendance/me'),
  getAll:   ()        => api.get('/attendance'),
  checkIn:  ()        => api.post('/attendance/check-in'),
  checkOut: ()        => api.post('/attendance/check-out'),
};

export const leaveApi = {
  getMine:  ()           => api.get('/leaves/me'),
  getAll:   ()           => api.get('/leaves'),
  apply:    (data)       => api.post('/leaves', data),
  decide:   (id, status) => api.patch(`/leaves/${id}`, { status }),
};

export const payrollApi = {
  getMySalary:   () => api.get('/payroll/me/salary'),
  getMyPayslips: () => api.get('/payroll/me/payslips'),
  getAll:        () => api.get('/payroll'),
};
