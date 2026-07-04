import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { employeeApi, departmentApi } from '../api/endpoints';
import {
  Plus, Users, X, Save, Trash2, Mail, Hash, User, Briefcase, Building2,
  Shield, CheckCircle2, AlertCircle
} from 'lucide-react';

const ROLE_CONFIG = {
  ADMIN:   { color: 'from-danger-500 to-rose-600',    icon: Shield },
  HR:      { color: 'from-accent-500 to-purple-600',  icon: Briefcase },
  EMPLOYEE:{ color: 'from-primary-500 to-indigo-600', icon: User },
};

function RolePill({ role }) {
  const c = ROLE_CONFIG[role] || ROLE_CONFIG.EMPLOYEE;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${c.color}`}>
      <Icon size={12} /> {role}
    </span>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    const [empRes, deptRes] = await Promise.all([
      employeeApi.list({ limit: 50 }),
      departmentApi.list()
    ]);
    setEmployees(empRes.data.data.items);
    setDepartments(deptRes.data.data);
  };

  useEffect(() => { load(); }, []);

  const flash = (msg, type = 'success') => {
    setMessage(msg); setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const onCreate = async (data) => {
    setMessage('');
    try {
      await employeeApi.create(data);
      flash('Employee created successfully! 🎉', 'success');
      setShowForm(false);
      reset();
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create employee.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await employeeApi.remove(id);
      flash('Employee removed.', 'success');
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to delete employee.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Users size={22} className="text-white" />
            </span>
            Employees
          </h1>
          <p className="text-gray-500 text-sm mt-2">Manage your team members and roles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary self-start">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Employee</>}
        </button>
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

      {/* ===== Form ===== */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-down"
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-accent-50">
            <h2 className="font-bold text-gray-800">New Employee</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the details to add a new team member</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'firstName',     label: 'First name',     icon: User,      type: 'text' },
              { name: 'lastName',      label: 'Last name',      icon: User,      type: 'text' },
              { name: 'employeeId',    label: 'Employee ID',    icon: Hash,      type: 'text' },
              { name: 'email',         label: 'Email',          icon: Mail,      type: 'email' },
              { name: 'password',      label: 'Temp password',  icon: Shield,    type: 'password' },
              { name: 'designation',   label: 'Designation',    icon: Briefcase, type: 'text' },
            ].map((f, i) => (
              <div
                key={f.name}
                className="space-y-1 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{f.label}</label>
                <div className="relative group">
                  <f.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    {...register(f.name, { required: f.name !== 'designation' })}
                    type={f.type}
                    className="input-premium pl-10 py-2"
                  />
                </div>
              </div>
            ))}

            <div className="space-y-1 animate-fade-in-up opacity-0" style={{ animationDelay: '300ms' }}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Role</label>
              <select {...register('role')} className="input-premium py-2">
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="space-y-1 animate-fade-in-up opacity-0" style={{ animationDelay: '350ms' }}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Department</label>
              <select {...register('departmentId')} className="input-premium py-2">
                <option value="">No department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <button type="submit" className="btn-primary">
              <Save size={16} /> Create Employee
            </button>
          </div>
        </form>
      )}

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-800">Team Members</h2>
          </div>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{employees.length} members</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Designation</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Users size={32} className="opacity-40" />
                      <p className="text-sm font-medium">No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((e, idx) => (
                  <tr key={e._id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20">
                          {e.firstName?.[0]}{e.lastName?.[0]}
                        </div>
                        <span className="font-semibold text-gray-800">{e.firstName} {e.lastName}</span>
                      </div>
                    </td>
                    <td className="text-gray-600">{e.userId?.email || '—'}</td>
                    <td><RolePill role={e.userId?.role} /></td>
                    <td>
                      {e.departmentId
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold">
                            <Building2 size={12} /> {e.departmentId.name}
                          </span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="text-gray-600">{e.designation || <span className="text-gray-400">—</span>}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-danger-500 to-rose-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
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
