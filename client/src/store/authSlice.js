import { createSlice } from '@reduxjs/toolkit';

// ===== Helpers for localStorage persistence =====
const STORAGE_KEY = 'hrms_auth';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode errors
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

// ===== Initial state: hydrate from localStorage if present =====
const persisted = loadFromStorage();

const initialState = persisted ?? {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * setCredentials
     * Accepts either:
     *  - a full credentials object: { accessToken, refreshToken, user }
     *  - or just the API response data
     */
    setCredentials: (state, action) => {
      const payload = action.payload || {};

      // Support multiple response shapes
      state.accessToken  = payload.accessToken  || payload.token || state.accessToken;
      state.refreshToken = payload.refreshToken || state.refreshToken;
      state.user         = payload.user         || payload.data?.user || payload || state.user;

      saveToStorage({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      });
    },

    setUser: (state, action) => {
      state.user = action.payload;
      saveToStorage({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      });
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      saveToStorage({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      });
    },

    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearStorage();
    },
  },
});

export const { setCredentials, setUser, setAccessToken, clearCredentials } = authSlice.actions;

// ===== Selectors =====
export const selectCurrentUser       = (state) => state.auth.user;
export const selectAccessToken       = (state) => state.auth.accessToken;
export const selectRefreshToken      = (state) => state.auth.refreshToken;
export const selectIsAuthenticated   = (state) => !!state.auth.accessToken && !!state.auth.user;
export const selectUserRole          = (state) => state.auth.user?.role || null;
export const selectIsAdminOrHr       = (state) => {
  const r = state.auth.user?.role;
  return r === 'ADMIN' || r === 'HR';
};

export default authSlice.reducer;
