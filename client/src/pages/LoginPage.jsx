import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/endpoints';
import { setCredentials } from '../store/authSlice';
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const res = await authApi.login(data);
      // Support multiple response shapes from the backend
      const payload = res.data?.data || res.data || {};
      dispatch(setCredentials(payload));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Network / unreachable server
      if (!err.response) {
        setServerError(
          '⚠️ Cannot reach the server. Please make sure the backend is running on the configured URL.'
        );
      } else if (err.response.status === 401) {
        setServerError('Invalid email or password.');
      } else {
        setServerError(
          err.response?.data?.message || `Login failed (${err.response.status}). Please try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-10">
      {/* ===== Animated Background ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="orb w-96 h-96 bg-primary-400 -top-20 -left-20" style={{ animationDelay: '0s' }} />
        <div className="orb w-96 h-96 bg-accent-400 top-1/2 -right-20" style={{ animationDelay: '2s' }} />
        <div className="orb w-80 h-80 bg-pink-400 bottom-0 left-1/3" style={{ animationDelay: '4s' }} />
        <div className="orb w-64 h-64 bg-cyan-400 top-20 right-1/3" style={{ animationDelay: '1s' }} />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* ===== Card ===== */}
      <div className="relative w-full max-w-md animate-scale-in">
        {/* Glow effect behind card */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl blur-2xl opacity-20 animate-pulse-glow" />

        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-primary-900/20 border border-white/60 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-accent-600 to-pink-600 flex items-center justify-center shadow-lg shadow-primary-500/40 animate-pulse-glow">
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-static tracking-tight">HRMS</h1>
              <p className="text-xs text-gray-500 font-medium">Sign in to your account</p>
            </div>
          </div>

          {/* Error */}
          {serverError && (
            <div className="mb-4 px-4 py-2.5 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-xl animate-fade-in-down flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulse" />
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-premium pl-11"
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger-600 mt-1 animate-fade-in-down">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-premium pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-danger-600 mt-1 animate-fade-in-down">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 text-base flex items-center justify-center gap-2 group animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              {loading ? (
                <>
                  <span className="spinner border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-success-500" />
              Secure
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-warning-500" />
              Fast
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-accent-500" />
              Modern
            </span>
          </div>

          {/* Signup link */}
          <p className="text-sm text-gray-600 mt-6 text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
