import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { leaveApi } from '../api/endpoints';
import {
  CalendarDays, Send, CheckCircle2, XCircle, Clock,
  Sparkles, FileText
} from 'lucide-react';

const LEAVE_TYPES = [
  { value: 'PAID',   label: 'Paid',   color: 'from-success-500 to-emerald-600',  icon: '💰' },
  { value: 'SICK',   label: 'Sick',   color: 'from-danger-500 to-rose-600',      icon: '🏥' },
  { value: 'CASUAL', label: 'Casual', color: 'from-warning-500 to-orange-600',   icon: '🌴' },
  { value: 'UNPAID', label: 'Unpaid', color: 'from-gray-500 to-gray-700',        icon: '⏸️' },
];

function StatusPill({ status }) {
  const map = {
    APPROVED: { cls: 'success', icon: CheckCircle2 },
    REJECTED: { cls: 'danger',  icon: XCircle },
    PENDING:  { cls: 'warning', icon: Clock },
  };
  const c = map[status] || { cls: 'info', icon: FileText };
  const Icon = c.icon;
  return (
    <span className={`status-pill ${c.cls}`}>
      <Icon size={12} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function LeavePage() {
  const { user } = useSelector((state) => state.auth);
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';
  const { register, handleSubmit, reset } = useForm();
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdminOrHr ? await leaveApi.getAll() : await leaveApi.getMine();
      setLeaves(res.data.data);
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

  const onApply = async (data) => {
    setMessage('');
    try {
      await leaveApi.apply(data);
      flash('Leave request submitted! 🎉', 'success');
      reset();
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to submit leave request.', 'error');
    }
  };

  const decide = async (id, status) => {
    try {
      await leaveApi.decide(id, status);
      flash(`Leave ${status.toLowerCase()} successfully`, 'success');
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to update leave request.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Leave Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isAdminOrHr ? 'Review and decide on employee leave requests' : 'Apply for and track your leave requests'}
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm animate-fade-in-down flex items-center gap-2 border ${
          messageType === 'success'
            ? 'bg-success-50 border-success-200 text-success-700'
            : 'bg-danger-50 border-danger-200 text-danger-700'
        }`}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* ===== Apply form (employee) ===== */}
      {!isAdminOrHr && (
        <form
          onSubmit={handleSubmit(onApply)}
          className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-md">
                <Send size={16} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-800">Apply for Leave</h2>
              <Sparkles size={14} className="text-primary-500 animate-pulse" />
            </div>
          </div>

          <div className="p-6">
            {/* Leave type chips */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Leave Type</label>
              <div className="flex flex-wrap gap-2">
                {LEAVE_TYPES.map((t, i) => (
                  <label
                    key={t.value}
                    className="group cursor-pointer animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${150 + i * 50}ms` }}
                  >
                    <input type="radio" {...register('leaveType', { required: true })} value={t.value} className="peer sr-only" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-gradient-to-r peer-checked:from-primary-50 peer-checked:to-accent-50 peer-checked:shadow-md peer-checked:scale-105 hover:border-gray-300">
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-sm font-semibold text-gray-700 peer-checked:text-primary-700">{t.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                <input type="date" {...register('startDate', { required: true })} className="input-premium" />
              </div>
              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</label>
                <input type="date" {...register('endDate', { required: true })} className="input-premium" />
              </div>
              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</label>
                <input {...register('remarks')} className="input-premium" placeholder="Optional reason" />
              </div>
            </div>

            <button type="submit" className="btn-gradient">
              <Send size={16} /> Submit Leave Request
            </button>
          </div>
        </form>
      )}

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-800">{isAdminOrHr ? 'All Leave Requests' : 'My Leave Requests'}</h2>
          </div>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
            {leaves.length} requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                {isAdminOrHr && <th>Employee</th>}
                <th>Type</th>
                <th>Dates</th>
                <th>Remarks</th>
                <th>Status</th>
                {isAdminOrHr && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {[...Array(isAdminOrHr ? 6 : 5)].map((__, j) => (
                      <td key={j} className="px-5 py-3.5"><div className="shimmer h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrHr ? 6 : 5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <CalendarDays size={32} className="opacity-40" />
                      <p className="text-sm font-medium">No leave requests found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaves.map((l, idx) => {
                  const typeMeta = LEAVE_TYPES.find(t => t.value === l.leaveType);
                  return (
                    <tr key={l._id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                      {isAdminOrHr && (
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                              {l.employeeId?.firstName?.[0]}{l.employeeId?.lastName?.[0]}
                            </div>
                            <span className="font-medium text-gray-800">
                              {l.employeeId?.firstName} {l.employeeId?.lastName}
                            </span>
                          </div>
                        </td>
                      )}
                      <td>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-700">
                          <span>{typeMeta?.icon}</span> {l.leaveType}
                        </span>
                      </td>
                      <td className="text-gray-700 font-medium">
                        {new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}
                      </td>
                      <td className="text-gray-500 text-sm">{l.remarks || '—'}</td>
                      <td><StatusPill status={l.status} /></td>
                      {isAdminOrHr && (
                        <td>
                          {l.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => decide(l._id, 'APPROVED')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-success-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                              >
                                <CheckCircle2 size={12} /> Approve
                              </button>
                              <button
                                onClick={() => decide(l._id, 'REJECTED')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-danger-500 to-rose-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
