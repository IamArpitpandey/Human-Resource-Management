import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { authApi } from '../api/endpoints';
import {
  LayoutDashboard, User, Clock, CalendarDays, Wallet,
  Users, Building2, LogOut, Sparkles
} from 'lucide-react';

export default function AppLayout() {
  const { user, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';

  const handleLogout = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore, log out locally regardless
    }
    dispatch(clearCredentials());
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/profile',     label: 'Profile',     icon: User },
    { to: '/attendance',  label: 'Attendance',  icon: Clock },
    { to: '/leaves',      label: 'Leave',       icon: CalendarDays },
    { to: '/payroll',     label: 'Payroll',     icon: Wallet },
  ];
  if (isAdminOrHr) {
    navItems.push({ to: '/employees',   label: 'Employees',   icon: Users });
    navItems.push({ to: '/departments', label: 'Departments', icon: Building2 });
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'from-danger-500 to-rose-600';
      case 'HR':    return 'from-accent-500 to-purple-600';
      default:      return 'from-primary-500 to-indigo-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-72 bg-white/70 backdrop-blur-2xl border-r border-white/60 flex flex-col shadow-2xl shadow-primary-900/5 animate-slide-in-left">
        {/* Logo block */}
        <div className="px-6 py-6 border-b border-gray-100/80 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 via-accent-600 to-pink-600 flex items-center justify-center shadow-lg shadow-primary-500/40 animate-pulse-glow">
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-static tracking-tight">HRMS</h1>
              <p className="text-[11px] text-gray-500 font-medium">Every workday, aligned.</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }, idx) => (
            <NavLink
              key={to}
              to={to}
              style={{ animationDelay: `${idx * 60}ms` }}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} animate-fade-in-up opacity-0`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-md shadow-primary-500/40'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User card + logout */}
        <div className="px-4 py-4 border-t border-gray-100/80 space-y-2 bg-gradient-to-b from-transparent to-primary-50/30">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className={`avatar-gradient w-10 h-10 rounded-xl text-sm bg-gradient-to-br ${getRoleColor(user?.role)}`}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
              <p className="text-[11px] text-gray-500 font-medium">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r ${getRoleColor(user?.role)}`}>
                  {user?.role}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="nav-item w-full justify-start text-danger-600 hover:bg-danger-50 hover:text-danger-700 group"
          >
            <div className="p-1.5 rounded-lg bg-danger-100 text-danger-600 group-hover:bg-danger-600 group-hover:text-white transition-all duration-300">
              <LogOut size={16} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main className="flex-1 p-8 overflow-y-auto animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
