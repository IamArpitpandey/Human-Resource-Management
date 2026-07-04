import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authApi, describeError } from '../api/endpoints';
import { UserPlus, Mail, Lock, Hash, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      // Try /register first (standard), then /signup as fallback
      await authApi.register(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setServerError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-accent-50 via-white to-pink-50 flex items-center justify-center px-4 py-10">
      {/* ===== Animated Background ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-accent-400 -top-20 -right-20" style={{ animationDelay: '0s' }} />
        <div className="orb w-96 h-96 bg-pink-400 bottom-0 -left-20" style={{ animationDelay: '2s' }} />
        <div className="orb w-80 h-80 bg-primary-400 top-1/3 right-1/4" style={{ animationDelay: '4s' }} />
        <div className="orb w-64 h-64 bg-cyan-400 bottom-1/4 right-1/3" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* ===== Card ===== */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-pulse-glow" />

        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-accent-900/20 border border-white/60 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-600 via-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-accent-500/40 animate-pulse-glow">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                Create account
              </h1>
              <p className="text-xs text-gray-500 font-medium">Join the HRMS platform</p>
            </div>
          </div>

          {success && (
            <div className="mb-4 px-4 py-3 bg-success-50 border border-success-200 text-success-700 text-sm rounded-xl animate-fade-in-down flex items-center gap-2">
              <CheckCircle2 size={18} />
              Signup successful! Redirecting to login...
            </div>
          )}
          {serverError && (
            <div className="mb-4 px-4 py-2.5 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-xl animate-fade-in-down">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <label className="block text-xs font-semibold text-gray-700">First name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-600 transition-colors" />
                  <input
                    {...register('firstName', { required: true })}
                    className="input-premium pl-9 py-2"
                  />
                </div>
              </div>
              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <label className="block text-xs font-semibold text-gray-700">Last name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-600 transition-colors" />
                  <input
                    {...register('lastName', { required: true })}
                    className="input-premium pl-9 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-semibold text-gray-700">Employee ID</label>
              <div className="relative group">
                <Hash size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-600 transition-colors" />
                <input
                  {...register('employeeId', { required: 'Employee ID is required' })}
                  className="input-premium pl-11"
                />
              </div>
              {errors.employeeId && (
                <p className="text-xs text-danger-600 mt-1 animate-fade-in-down">{errors.employeeId.message}</p>
              )}
            </div>

            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-600 transition-colors" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-premium pl-11"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger-600 mt-1 animate-fade-in-down">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-600 transition-colors" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: 8 })}
                  className="input-premium pl-11"
                  placeholder="Min 8 chars, mixed case, number, symbol"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-danger-600 mt-1 animate-fade-in-down">Password does not meet requirements</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-accent-600 to-pink-600 hover:from-accent-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-accent-500/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              {loading ? (
                <>
                  <span className="spinner border-white/40 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-accent-600 font-semibold hover:text-accent-700 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
