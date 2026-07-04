import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { attendanceApi } from '../api/endpoints';
import { LogIn, LogOut, Calendar, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

function StatusPill({ status }) {
  const map = {
    PRESENT: { cls: 'success', label: '✓ Present' },
    HALF_DAY:{ cls: 'warning', label: '⏳ Half Day' },
    ABSENT:  { cls: 'danger',  label: '✗ Absent' },
  };
  const c = map[status] || { cls: 'info', label: status };
  return <span className={`status-pill ${c.cls}`}>{c.label}</span>;
}

export default function AttendancePage() {
  const { user } = useSelector((state) => state.auth);
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdminOrHr ? await attendanceApi.getAll() : await attendanceApi.getMine();
      setRecords(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCheckIn = async () => {
    setMessage('');
    try {
      await attendanceApi.checkIn();
      flash('Checked in successfully! 🎉', 'success');
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Check-in failed.', 'error');
    }
  };

  const handleCheckOut = async () => {
    setMessage('');
    try {
      await attendanceApi.checkOut();
      flash('Checked out successfully! 👋', 'success');
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Check-out failed.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Track your daily check-ins and working hours</p>
      </div>

      {/* ===== Action buttons (employee) ===== */}
      {!isAdminOrHr && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <button
            onClick={handleCheckIn}
            className="group relative overflow-hidden bg-gradient-to-br from-success-500 to-emerald-600 hover:from-success-600 hover:to-emerald-700 text-white p-5 rounded-2xl shadow-lg shadow-success-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-success-500/40"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">Start your day</p>
                <p className="text-lg font-bold mt-1">Check In</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform">
                <LogIn size={22} className="text-white" />
              </div>
            </div>
          </button>

          <button
            onClick={handleCheckOut}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white p-5 rounded-2xl shadow-lg shadow-gray-700/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">End your day</p>
                <p className="text-lg font-bold mt-1">Check Out</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform">
                <LogOut size={22} className="text-white" />
              </div>
            </div>
          </button>

          <div className="bg-gradient-to-br from-primary-500 to-accent-600 text-white p-5 rounded-2xl shadow-lg shadow-primary-500/30 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">Today's Date</p>
                <p className="text-lg font-bold mt-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                <p className="text-xs text-white/80 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
                <Calendar size={22} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Message ===== */}
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm animate-fade-in-down flex items-center gap-2 border ${
          messageType === 'success'
            ? 'bg-success-50 border-success-200 text-success-700'
            : 'bg-danger-50 border-danger-200 text-danger-700'
        }`}>
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-800">Attendance Records</h2>
          </div>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
            {records.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                {isAdminOrHr && <th>Employee</th>}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {[...Array(isAdminOrHr ? 6 : 5)].map((__, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="shimmer h-4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrHr ? 6 : 5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Clock size={32} className="opacity-40" />
                      <p className="text-sm font-medium">No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((r, idx) => (
                  <tr key={r._id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    {isAdminOrHr && (
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                            {r.employeeId?.firstName?.[0]}{r.employeeId?.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-800">
                            {r.employeeId?.firstName} {r.employeeId?.lastName}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="text-gray-700 font-medium">{new Date(r.date).toLocaleDateString()}</td>
                    <td>
                      {r.checkIn
                        ? <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-success-50 text-success-700 rounded-lg text-xs font-bold">
                            <LogIn size={12} /> {new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td>
                      {r.checkOut
                        ? <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                            <LogOut size={12} /> {new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td><StatusPill status={r.status} /></td>
                    <td>
                      {r.workingHours != null
                        ? <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-600">
                            <TrendingUp size={12} /> {r.workingHours}h
                          </span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
