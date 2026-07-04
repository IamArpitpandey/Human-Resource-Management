import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { departmentApi } from '../api/endpoints';
import {
  Building2, Plus, Trash2, Users, Hash, AlertCircle, CheckCircle2, Sparkles
} from 'lucide-react';

const DEPT_COLORS = [
  'from-primary-500 to-indigo-600',
  'from-accent-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-warning-500 to-orange-600',
  'from-success-500 to-emerald-600',
  'from-info-500 to-cyan-600',
  'from-danger-500 to-rose-700',
  'from-violet-500 to-purple-700',
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const load = async () => {
    const res = await departmentApi.list();
    setDepartments(res.data.data);
  };
  useEffect(() => { load(); }, []);

  const flash = (msg, type = 'success') => {
    setMessage(msg); setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const onCreate = async (data) => {
    setMessage('');
    try {
      await departmentApi.create(data.name);
      flash('Department created! 🏢', 'success');
      reset();
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create department.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return;
    try {
      await departmentApi.remove(id);
      flash('Department removed.', 'success');
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to delete department.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-600 to-pink-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
            <Building2 size={22} className="text-white" />
          </span>
          Departments
        </h1>
        <p className="text-gray-500 text-sm mt-2">Organize your team by department</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm animate-fade-in-down flex items-center gap-2 border ${
          messageType === 'success'
            ? 'bg-success-50 border-success-200 text-success-700'
            : 'bg-danger-50 border-danger-200 text-danger-700'
        }`}>
          {messageType === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      {/* ===== Add form ===== */}
      <form
        onSubmit={handleSubmit(onCreate)}
        className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col sm:flex-row gap-3 animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
      >
        <div className="relative flex-1 max-w-md">
          <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            {...register('name', { required: true })}
            placeholder="Department name (e.g. Engineering)"
            className="input-premium pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">
          <Plus size={16} /> Add Department
        </button>
      </form>

      {/* ===== Department cards ===== */}
      {departments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 mb-4">
            <Building2 size={40} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No departments yet</h3>
          <p className="text-sm text-gray-500">Create your first department using the form above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departments.map((d, idx) => {
            const color = DEPT_COLORS[idx % DEPT_COLORS.length];
            return (
              <div
                key={d._id}
                className="group relative bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-hover animate-fade-in-up opacity-0"
                style={{ animationDelay: `${150 + idx * 60}ms` }}
              >
                {/* Color strip */}
                <div className={`h-2 bg-gradient-to-r ${color}`} />

                {/* Glow on hover */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <Building2 size={22} className="text-white" />
                    </div>
                    <Sparkles size={14} className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-700 transition-colors">
                    {d.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                      <Users size={12} />
                      {d.employeeCount ?? 0} {d.employeeCount === 1 ? 'employee' : 'employees'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(d._id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-danger-600 hover:text-danger-700 hover:bg-danger-50 px-2 py-1.5 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
