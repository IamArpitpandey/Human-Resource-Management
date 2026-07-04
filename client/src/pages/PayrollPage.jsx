import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { payrollApi } from '../api/endpoints';
import { Wallet, TrendingUp, AlertCircle, FileText, IndianRupee, Briefcase, Home, MinusCircle } from 'lucide-react';

export default function PayrollPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdminOrHr = user?.role === 'ADMIN' || user?.role === 'HR';
  const [salary, setSalary] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [allPayrolls, setAllPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isAdminOrHr) {
          const res = await payrollApi.getAll();
          setAllPayrolls(res.data.data);
        } else {
          const [salaryRes, payslipRes] = await Promise.allSettled([
            payrollApi.getMySalary(),
            payrollApi.getMyPayslips(),
          ]);
          if (salaryRes.status === 'fulfilled') setSalary(salaryRes.value.data.data);
          if (payslipRes.status === 'fulfilled') setPayslips(payslipRes.value.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdminOrHr]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-12 rounded-xl w-64" />
        <div className="shimmer h-48 rounded-2xl" />
        <div className="shimmer h-64 rounded-2xl" />
      </div>
    );
  }

  // ===== Admin / HR view =====
  if (isAdminOrHr) {
    const totalGross = allPayrolls.reduce((s, p) => s + (p.grossPay || 0), 0);
    const totalNet   = allPayrolls.reduce((s, p) => s + (p.netPay || 0), 0);
    const totalDed   = allPayrolls.reduce((s, p) => s + (p.deductions || 0), 0);

    return (
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Payroll Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and review all employee payroll records</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, label: 'Total Gross', value: totalGross, color: 'from-primary-500 to-indigo-600' },
            { icon: Wallet,     label: 'Total Net',   value: totalNet,   color: 'from-success-500 to-emerald-600' },
            { icon: MinusCircle,label: 'Total Deductions', value: totalDed, color: 'from-danger-500 to-rose-600' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 card-hover animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-3`}>
                <s.icon size={22} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">₹{s.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-primary-600" />
              <h2 className="font-bold text-gray-800">All Payroll Records</h2>
            </div>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{allPayrolls.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Employee</th><th>Month/Year</th><th>Gross</th><th>Deductions</th><th>Net</th>
                </tr>
              </thead>
              <tbody>
                {allPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FileText size={32} className="opacity-40" />
                        <p className="text-sm font-medium">No payroll records yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allPayrolls.map((p, idx) => (
                    <tr key={p._id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                            {p.employeeId?.firstName?.[0]}{p.employeeId?.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-800">{p.employeeId?.firstName} {p.employeeId?.lastName}</span>
                        </div>
                      </td>
                      <td className="text-gray-700 font-medium">{p.month}/{p.year}</td>
                      <td className="font-mono">₹{p.grossPay.toLocaleString()}</td>
                      <td className="font-mono text-danger-600">₹{p.deductions.toLocaleString()}</td>
                      <td className="font-mono font-bold text-success-700">₹{p.netPay.toLocaleString()}</td>
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

  // ===== Employee view =====
  const components = salary ? [
    { icon: IndianRupee, label: 'Basic',      value: salary.basic,      color: 'from-primary-500 to-indigo-600' },
    { icon: Home,        label: 'HRA',        value: salary.hra,        color: 'from-success-500 to-emerald-600' },
    { icon: Briefcase,   label: 'Allowances', value: salary.allowances, color: 'from-accent-500 to-purple-600' },
    { icon: MinusCircle, label: 'Deductions', value: salary.deductions, color: 'from-danger-500 to-rose-600', isNeg: true },
  ] : [];

  const net = salary ? (salary.basic + salary.hra + salary.allowances - salary.deductions) : 0;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Payroll</h1>
        <p className="text-gray-500 text-sm mt-1">View your salary structure and payslip history</p>
      </div>

      {salary ? (
        <>
          {/* ===== Salary card with net pay highlight ===== */}
          <div className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-pink-600 rounded-2xl p-6 shadow-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white mb-2">
                  <Wallet size={12} />
                  Net Take-Home
                </div>
                <p className="text-5xl font-bold text-white tracking-tight">
                  ₹{net.toLocaleString()}
                </p>
                <p className="text-sm text-white/80 mt-1">Per month · after deductions</p>
              </div>
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
                <TrendingUp size={64} className="text-white" />
              </div>
            </div>
          </div>

          {/* ===== Components grid ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {components.map((c, i) => (
              <div
                key={c.label}
                className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 card-hover animate-fade-in-up opacity-0"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg mb-3`}>
                  <c.icon size={22} className="text-white" />
                </div>
                <p className={`text-2xl font-bold ${c.isNeg ? 'text-danger-600' : 'text-gray-800'}`}>
                  {c.isNeg ? '-' : ''}₹{c.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-warning-50 border border-warning-200 px-5 py-4 rounded-2xl flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <AlertCircle size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning-800">Salary not set up yet</p>
            <p className="text-sm text-warning-700 mt-1">Your salary structure has not been configured. Please contact HR/Admin.</p>
          </div>
        </div>
      )}

      {/* ===== Payslips table ===== */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-800">Payslip History</h2>
          </div>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{payslips.length} slips</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr><th>Month/Year</th><th>Gross</th><th>Deductions</th><th>Net</th></tr>
            </thead>
            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FileText size={32} className="opacity-40" />
                      <p className="text-sm font-medium">No payslips yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payslips.map((p, idx) => (
                  <tr key={p._id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg text-xs font-bold text-primary-700">
                        {p.month}/{p.year}
                      </span>
                    </td>
                    <td className="font-mono">₹{p.grossPay.toLocaleString()}</td>
                    <td className="font-mono text-danger-600">₹{p.deductions.toLocaleString()}</td>
                    <td className="font-mono font-bold text-success-700">₹{p.netPay.toLocaleString()}</td>
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
