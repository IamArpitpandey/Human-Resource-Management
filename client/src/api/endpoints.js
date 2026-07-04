/**
 * API client + endpoints for the HRMS backend.
 *
 * Backend structure (from server/app.js + routes/index.js + routes/auth.routes.js):
 *   Base prefix:        /api/v1
 *   Auth routes:        POST /api/v1/auth/signup, /login, /refresh, /logout,
 *                       /verify-email, /forgot-password, /reset-password
 *   Resource routes:    /api/v1/employees, /attendance, /leaves, /payroll,
 *                       /notifications, /departments, /dashboard
 *   Health check:       GET  /health  (mounted at root, NOT under /api)
 *
 * Set base URL via VITE_API_URL (default: http://localhost:5000/api/v1)
 */
import axios from 'axios';

// ===== Base URL configuration =====
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
// rootBaseURL strips /api/v1 (or /api) for health/root checks
const rootBaseURL = baseURL.replace(/\/api\/v\d+\/?$/, '').replace(/\/api\/?$/, '');

// ===== Axios instance =====
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // backend uses cookie-parser, so send credentials
});

// ===== Request interceptor: attach JWT =====
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('hrms_auth');
    if (raw) {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch { /* ignore */ }
  return config;
});

// ===== Response interceptor: handle 401 globally =====
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try { localStorage.removeItem('hrms_auth'); } catch { /* ignore */ }
    }
    return Promise.reject(err);
  }
);

// ===== Try multiple paths until one succeeds =====
async function tryPaths(method, paths, data, config = {}) {
  const attempts = [];
  let lastErr;
  for (const path of paths) {
    try {
      return await api.request({ method, url: path, data, ...config });
    } catch (err) {
      attempts.push({ path, status: err.response?.status || 'NO_RESPONSE' });
      lastErr = err;
      // Only continue on 404 — other errors should bubble up immediately
      if (err.response?.status !== 404) break;
    }
  }
  if (lastErr) lastErr.attempts = attempts;
  throw lastErr;
}

// ===== AUTH endpoints (aligned with backend's auth.routes.js) =====
// Backend has: /signup, /verify-email, /login, /refresh, /logout,
//              /forgot-password, /reset-password
export const authApi = {
  // Primary endpoint per backend: POST /api/v1/auth/signup
  // Try signup first, then register as fallback for older API versions
  signup:   (data) => tryPaths('post', ['/auth/signup', '/auth/register'], data),
  register: (data) => tryPaths('post', ['/auth/signup', '/auth/register'], data), // alias

  // Primary endpoint per backend: POST /api/v1/auth/login
  login:    (data) => tryPaths('post', ['/auth/login', '/auth/signin'], data),

  // POST /api/v1/auth/refresh — token refresh
  refresh:  (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  // POST /api/v1/auth/logout
  logout:   (refreshToken) => api.post('/auth/logout', { refreshToken }),

  // POST /api/v1/auth/verify-email
  verifyEmail: (data) => api.post('/auth/verify-email', data),

  // POST /api/v1/auth/forgot-password
  forgotPassword: (data) => api.post('/auth/forgot-password', data),

  // POST /api/v1/auth/reset-password
  resetPassword:  (data) => api.post('/auth/reset-password', data),

  // Current user — try common patterns
  me:       () => tryPaths('get', ['/auth/me', '/employees/me', '/users/me'], null),
};

// ===== Dashboard =====
export const dashboardApi = {
  admin:    () => api.get('/dashboard/admin'),
  employee: () => api.get('/dashboard/employee'),
  general:  () => api.get('/dashboard'),
};

// ===== Employees =====
export const employeeApi = {
  list:     (params) => api.get('/employees', { params }),
  getMe:    ()       => api.get('/employees/me'),
  create:   (data)   => api.post('/employees', data),
  updateMe: (data)   => api.patch('/employees/me', data),
  remove:   (id)     => api.delete(`/employees/${id}`),
};

// ===== Departments =====
export const departmentApi = {
  list:   ()     => api.get('/departments'),
  create: (name) => api.post('/departments', { name }),
  remove: (id)   => api.delete(`/departments/${id}`),
};

// ===== Attendance =====
export const attendanceApi = {
  getMine:  ()        => api.get('/attendance/me'),
  getAll:   ()        => api.get('/attendance'),
  checkIn:  ()        => api.post('/attendance/check-in'),
  checkOut: ()        => api.post('/attendance/check-out'),
};

// ===== Leave =====
export const leaveApi = {
  getMine:  ()           => api.get('/leaves/me'),
  getAll:   ()           => api.get('/leaves'),
  apply:    (data)       => api.post('/leaves', data),
  decide:   (id, status) => api.patch(`/leaves/${id}`, { status }),
};

// ===== Payroll =====
export const payrollApi = {
  getMySalary:   () => api.get('/payroll/me/salary'),
  getMyPayslips: () => api.get('/payroll/me/payslips'),
  getAll:        () => api.get('/payroll'),
};

// ===== Notifications =====
export const notificationApi = {
  list:   ()       => api.get('/notifications'),
  markRead: (id)   => api.patch(`/notifications/${id}/read`),
};

// ===== Health check =====
export const healthApi = {
  // GET /health — mounted at root, NOT under /api/v1
  check: () => axios.get(`${rootBaseURL}/health`, { timeout: 5000 }),
  root:  () => axios.get(rootBaseURL, { timeout: 5000 }),
};

// ===== Diagnostics: probe the actual /api/v1 paths =====
export async function diagnoseBackend() {
  const candidates = [
    // Health (root level)
    { method: 'get',  path: '/health',                label: 'Health (root)',     root: true },

    // ===== Auth (/api/v1/auth/*) =====
    { method: 'post', path: '/auth/signup',            label: 'Signup (primary)' },
    { method: 'post', path: '/auth/login',             label: 'Login (primary)' },
    { method: 'post', path: '/auth/refresh',           label: 'Refresh token' },
    { method: 'post', path: '/auth/logout',            label: 'Logout' },
    { method: 'post', path: '/auth/verify-email',      label: 'Verify email' },
    { method: 'post', path: '/auth/forgot-password',   label: 'Forgot password' },
    { method: 'post', path: '/auth/reset-password',    label: 'Reset password' },
    { method: 'post', path: '/auth/register',          label: 'Register (alt)' },

    // ===== Common reads =====
    { method: 'get',  path: '/auth/me',                label: 'Auth Me' },
    { method: 'get',  path: '/employees/me',           label: 'Employee Me' },
    { method: 'get',  path: '/dashboard',              label: 'Dashboard' },
    { method: 'get',  path: '/dashboard/admin',        label: 'Dashboard Admin' },
    { method: 'get',  path: '/dashboard/employee',     label: 'Dashboard Employee' },
    { method: 'get',  path: '/employees',              label: 'Employees' },
    { method: 'get',  path: '/departments',            label: 'Departments' },
    { method: 'get',  path: '/attendance',             label: 'Attendance' },
    { method: 'get',  path: '/leaves',                 label: 'Leaves' },
    { method: 'get',  path: '/payroll',                label: 'Payroll' },
    { method: 'get',  path: '/notifications',          label: 'Notifications' },
  ];

  const results = [];
  for (const c of candidates) {
    const url = c.root ? `${rootBaseURL}${c.path}` : `${baseURL}${c.path}`;
    try {
      const res = await axios({
        method: c.method,
        url,
        timeout: 4000,
        validateStatus: () => true,
        data: c.method === 'post' ? {} : undefined,
      });
      let bodyPreview = '';
      try {
        const data = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
        bodyPreview = data.substring(0, 200);
      } catch { bodyPreview = '[non-text response]'; }
      const contentType = res.headers?.['content-type'] || '';
      results.push({
        label: c.label,
        path: c.path,
        method: c.method.toUpperCase(),
        status: res.status,
        ok: res.status < 500,
        found: res.status !== 404,
        isJson: contentType.includes('json'),
        bodyPreview,
      });
    } catch (err) {
      results.push({
        label: c.label,
        path: c.path,
        method: c.method.toUpperCase(),
        status: 'NETWORK_ERROR',
        ok: false,
        found: false,
        isJson: false,
        bodyPreview: err.message,
      });
    }
  }
  return { baseURL, rootBaseURL, results };
}

// ===== Manual URL probe =====
export async function probeUrl(method, fullUrl) {
  try {
    const res = await axios({
      method,
      url: fullUrl,
      timeout: 6000,
      validateStatus: () => true,
      data: method.toLowerCase() === 'post' ? {} : undefined,
    });
    let bodyPreview = '';
    try {
      const data = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      bodyPreview = data.substring(0, 400);
    } catch { bodyPreview = '[non-text]'; }
    return {
      ok: true,
      status: res.status,
      contentType: res.headers?.['content-type'] || '',
      bodyPreview,
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ===== Error message helper =====
export function describeError(err) {
  if (!err) return 'Unknown error';

  const attempts = err.attempts;
  if (attempts && attempts.length > 1) {
    const triedList = attempts.slice(0, 4).map(a => `${a.path}`).join(', ');
    const more = attempts.length > 4 ? `, +${attempts.length - 4} more` : '';
    if (attempts.every(a => a.status === 404)) {
      return `🔍 None of the expected endpoints exist.\n\nTried at ${baseURL}:\n${triedList}${more}\n\nUpdate src/api/endpoints.js with your actual paths.`;
    }
    return `🔍 Endpoint issue. Tried: ${triedList}${more}`;
  }

  if (!err.response) {
    if (err.code === 'ECONNABORTED') return '⏱️ Request timed out. Server is slow or unreachable.';
    if (err.message?.includes('Network Error')) return `🌐 Network error — cannot reach ${baseURL}. Is the backend running?`;
    return `⚠️ ${err.message || 'Connection failed'}`;
  }

  const { status, data, config } = err.response;
  const path = config?.url || '';
  switch (status) {
    case 400: return data?.message || `❌ Bad request to ${path}`;
    case 401: return '🔒 Invalid credentials. Please check your email & password.';
    case 403: return '🚫 Forbidden — you do not have permission.';
    case 404: return `🔍 Endpoint not found: ${baseURL}${path}`;
    case 409: return data?.message || '⚠️ Conflict — record already exists.';
    case 422: return data?.message || '❌ Validation failed.';
    case 429: return '⏱️ Too many requests — please slow down.';
    case 500: return '💥 Server error. Try again or contact support.';
    case 502: return '🚧 Bad gateway — backend is down or restarting.';
    case 503: return '🚧 Service unavailable — backend overloaded.';
    default:  return data?.message || `Error ${status}: ${path}`;
  }
}
