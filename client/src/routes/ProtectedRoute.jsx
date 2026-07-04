import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw, LogIn } from 'lucide-react';

/**
 * ProtectedRoute
 * - If user not authenticated → redirect to /login
 * - If authenticated but wrong role → redirect to /dashboard
 * - Shows a brief loading state while Redux rehydrates from localStorage
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, accessToken } = useSelector((state) => state.auth);
  const location = useLocation();

  // Track if Redux has finished initial hydration
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Give Redux one tick to rehydrate from localStorage on mount
    const t = setTimeout(() => setHydrated(true), 50);
    return () => clearTimeout(t);
  }, []);

  // While hydrating, show a tiny loader (only briefly)
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center">
          <Loader2 size={36} className="text-primary-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // No auth → redirect to login (with the intended destination)
  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Auth but wrong role → bounce to dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
