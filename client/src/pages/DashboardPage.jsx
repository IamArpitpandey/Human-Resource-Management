import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dashboardApi } from '../api/endpoints';
import {
  Users, CalendarClock, Wallet, Building2, CheckCircle2, XCircle,
  Sparkles, TrendingUp
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="stat-card group animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={22} className="text-white relative z-10" />
        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-3xl font-bold text-gray-800 transition-colors group-hover:text-primary-600">
        {value}
      </p>
      <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      <div className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

function StatusPill({ status }) {
  const config = {
    APPROVED: { cls: 'success', label: '✓ Approved' },
    REJECTED: { cls: 'danger',  label: '✗ Rejected' },
    PENDING:  { cls: 'warning', label: '⏳ Pending' },
  }[status] || { cls: 'info', label: status };
  return <span className={`status-pill ${config.cls}`}>{config.label}</span>;
}

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = isAdminOrHr ? await dashboardApi.admin() : await dashboardApi.employee();
        setData(res.data?.data || res.data || null);
      } catch (err) {
        console.warn('Dashboard fetch failed:', err.message);
        setData(null);   // graceful empty state instead of infinite spinner
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdminOrHr]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-12 rounded-xl w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="shimmer h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ===== Welcome banner ===== */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-accent-600 to-pink-600 p-8 shadow-xl animate-fade-in-up"
        style={{ animationDelay: '0ms' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-3">
              <Sparkles size={14} />
              {isAdminOrHr ? 'Admin Dashboard' : 'Employee Dashboard'}
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back{data?.profile ? `, ${data.profile.firstName}` : ''} <span className="inline-block animate-bounce-soft">👋</span>
            </h1>
            <p className="text-white/80 text-sm mt-2 max-w-xl">
              Here's what's happening today. Stay productive and aligned with your team.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
              <TrendingUp size={64} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Stats grid ===== */}
      {isAdminOrHr ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users}         label="Total Employees"     value={data?.employeeCount ?? 0}  color="from-primary-600 to-indigo-700"   delay={100} />
          <StatCard icon={CalendarClock} label="Pending Leaves"      value={data?.pendingLeaves ?? 0}  color="from-warning-500 to-orange-600"   delay={200} />
          <StatCard icon={Wallet}        label="Payroll Records"     value={data?.payrollCount ?? 0}   color="from-success-500 to-emerald-700"  delay={300} />
          <StatCard icon={Building2}     label="Departments"         value={data?.departmentCount ?? 0} color="from-accent-500 to-purple-700"   delay={400} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={CheckCircle2}  label="Present Days (Month)"  value={data?.attendanceSummary?.present ?? 0} color="from-success-500 to-emerald-700" delay={100} />
          <StatCard icon={XCircle}       label="Half Days"             value={data?.attendanceSummary?.halfDay ?? 0} color="from-warning-500 to-orange-600" delay={200} />
          <StatCard icon={CalendarClock} label="Pending Leave Requests" value={data?.leaveSummary?.pending ?? 0}   color="from-primary-600 to-indigo-700"  delay={300} />
        </div>
      )}

      {/* ===== Recent leaves ===== */}
      {!isAdminOrHr && data?.recentLeaves?.length > 0 && (
        <div
          className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up opacity-0"
          style={{ animationDelay: '500ms' }}
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <CalendarClock size={18} className="text-primary-600" />
              Recent Leave Requests
            </h2>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              {data.recentLeaves.length}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recentLeaves.map((leave, idx) => (
              <div
                key={leave._id}
                className="flex justify-between items-center px-6 py-4 hover:bg-gradient-to-r hover:from-primary-50/40 hover:to-accent-50/40 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${600 + idx * 50}ms` }}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{leave.leaveType}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusPill status={leave.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
