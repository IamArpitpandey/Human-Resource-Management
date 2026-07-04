import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi, describeError, diagnoseBackend, probeUrl } from '../api/endpoints';
import { setCredentials } from '../store/authSlice';
import {
  Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Zap,
  Stethoscope, CheckCircle2, XCircle, Loader2, X,
  Send, FileSearch, AlertTriangle
} from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagOpen, setDiagOpen] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagResults, setDiagResults] = useState(null);

  // Manual probe state
  const [probeUrl_, setProbeUrl] = useState('');
  const [probeMethod, setProbeMethod] = useState('post');
  const [probeResult, setProbeResult] = useState(null);
  const [probeLoading, setProbeLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const res = await authApi.login(data);
      // Support multiple backend response shapes:
      //   { success, data: { accessToken, refreshToken, user } }
      //   { accessToken, refreshToken, user }
      //   { token, user }
      const root = res.data || {};
      const payload = root.data || root;
      const credentials = {
        accessToken:  payload.accessToken  || payload.token || root.accessToken,
        refreshToken: payload.refreshToken || root.refreshToken,
        user:         payload.user         || root.user,
      };
      dispatch(setCredentials(credentials));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostic = async () => {
    setDiagOpen(true);
    setDiagLoading(true);
    setDiagResults(null);
    setProbeResult(null);
    try {
      const result = await diagnoseBackend();
      setDiagResults(result);
    } catch (err) {
      setDiagResults({ error: err.message });
    } finally {
      setDiagLoading(false);
    }
  };

  const runManualProbe = async () => {
    if (!probeUrl_.trim()) return;
    setProbeLoading(true);
    setProbeResult(null);
    try {
      const result = await probeUrl(probeMethod, probeUrl_.trim());
      setProbeResult(result);
    } catch (err) {
      setProbeResult({ ok: false, error: err.message });
    } finally {
      setProbeLoading(false);
    }
  };

  const foundEndpoints = diagResults?.results?.filter(r => r.found && r.status !== 404) || [];
  const allNetworkError = diagResults?.results?.every(r => r.status === 'NETWORK_ERROR');
  const authFound = foundEndpoints.filter(r => r.method === 'POST');

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-primary-400 -top-20 -left-20" style={{ animationDelay: '0s' }} />
        <div className="orb w-96 h-96 bg-accent-400 top-1/2 -right-20" style={{ animationDelay: '2s' }} />
        <div className="orb w-80 h-80 bg-pink-400 bottom-0 left-1/3" style={{ animationDelay: '4s' }} />
        <div className="orb w-64 h-64 bg-cyan-400 top-20 right-1/3" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl blur-2xl opacity-20 animate-pulse-glow" />
        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-primary-900/20 border border-white/60 p-8">
          <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-accent-600 to-pink-600 flex items-center justify-center shadow-lg shadow-primary-500/40 animate-pulse-glow">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-static tracking-tight">HRMS</h1>
              <p className="text-xs text-gray-500 font-medium">Sign in to your account</p>
            </div>
          </div>

          {serverError && (
            <div className="mb-4 px-4 py-3 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-xl animate-fade-in-down whitespace-pre-line">
              {serverError}
            </div>
          )}

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

          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-success-500" />Secure</span>
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-warning-500" />Fast</span>
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-accent-500" />Modern</span>
          </div>

          <p className="text-sm text-gray-600 mt-6 text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors">
              Sign up
            </Link>
          </p>

          <button
            type="button"
            onClick={runDiagnostic}
            className="mt-4 w-full text-xs font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
          >
            <Stethoscope size={12} />
            Having trouble? Diagnose backend connection
          </button>
        </div>
      </div>

      {/* ============ DIAGNOSTIC MODAL ============ */}
      {diagOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setDiagOpen(false)}>
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-50 to-accent-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Stethoscope size={18} className="text-primary-600" />
                <h2 className="font-bold text-gray-800">Backend Diagnostic</h2>
              </div>
              <button onClick={() => setDiagOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {diagLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={32} className="text-primary-600 animate-spin" />
                  <p className="text-sm text-gray-500">Probing 30+ backend routes...</p>
                </div>
              ) : diagResults?.error ? (
                <div className="text-center py-12">
                  <p className="text-danger-600 font-semibold">Diagnostic failed</p>
                  <p className="text-sm text-gray-500 mt-2">{diagResults.error}</p>
                </div>
              ) : diagResults ? (
                <div className="space-y-4">
                  {/* Base URLs */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Backend URLs</p>
                    <p className="text-sm font-mono text-gray-700">API: <span className="text-primary-600 font-bold">{diagResults.baseURL}</span></p>
                    <p className="text-sm font-mono text-gray-700">Root: <span className="text-primary-600 font-bold">{diagResults.rootBaseURL}</span></p>
                  </div>

                  {/* Status banner */}
                  {allNetworkError && (
                    <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle size={20} className="text-danger-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-danger-800">Backend is unreachable</p>
                        <p className="text-sm text-danger-700 mt-1">All requests failed with network errors. Make sure the backend is running.</p>
                      </div>
                    </div>
                  )}

                  {foundEndpoints.length > 0 && (
                    <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-success-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-success-800">Found {foundEndpoints.length} working endpoint(s)!</p>
                        <div className="mt-2 space-y-1">
                          {foundEndpoints.map((r, i) => (
                            <p key={i} className="text-sm font-mono text-success-700">
                              <span className="font-bold">{r.method}</span> {r.path} → <span className="font-bold">HTTP {r.status}</span>
                              {r.isJson && <span className="ml-2 text-xs bg-success-100 px-1.5 py-0.5 rounded">JSON</span>}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {foundEndpoints.length === 0 && !allNetworkError && (
                    <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-warning-800">No known endpoints matched</p>
                        <p className="text-sm text-warning-700 mt-1">Backend is up but routes don't match common patterns. Use the manual URL probe below to find your actual routes.</p>
                      </div>
                    </div>
                  )}

                  {/* Compact results table */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">All Probe Results ({diagResults.results.length})</p>
                    <div className="space-y-1 max-h-64 overflow-y-auto bg-gray-50 rounded-xl p-3">
                      {diagResults.results.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-white rounded text-xs">
                          {r.status === 'NETWORK_ERROR' ? (
                            <XCircle size={12} className="text-danger-500 flex-shrink-0" />
                          ) : r.found ? (
                            <CheckCircle2 size={12} className="text-success-500 flex-shrink-0" />
                          ) : (
                            <XCircle size={12} className="text-gray-400 flex-shrink-0" />
                          )}
                          <span className="font-mono font-bold text-primary-700 w-12">{r.method}</span>
                          <span className="font-mono text-gray-700 flex-1 truncate">{r.path}</span>
                          <span className={`font-bold w-16 text-right ${
                            r.status === 'NETWORK_ERROR' ? 'text-danger-600' :
                            r.found ? 'text-success-600' : 'text-gray-400'
                          }`}>
                            {r.status === 'NETWORK_ERROR' ? '🔌 OFFLINE' : r.found ? `✓ ${r.status}` : `404`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== MANUAL URL PROBE ===== */}
                  <div className="border-t-2 border-dashed border-primary-200 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileSearch size={16} className="text-primary-600" />
                      <p className="text-sm font-bold text-gray-800">Manual URL Probe</p>
                      <span className="text-xs text-gray-500">— test any URL yourself</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Got your backend's route definitions? Paste the full URL below to test it.
                    </p>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={probeMethod}
                        onChange={(e) => setProbeMethod(e.target.value)}
                        className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-mono font-bold text-primary-700 hover:border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                      >
                        <option value="post">POST</option>
                        <option value="get">GET</option>
                        <option value="put">PUT</option>
                        <option value="delete">DELETE</option>
                      </select>
                      <input
                        type="text"
                        value={probeUrl_}
                        onChange={(e) => setProbeUrl(e.target.value)}
                        placeholder="http://localhost:5000/api/auth/register"
                        className="flex-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-mono hover:border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && runManualProbe()}
                      />
                      <button
                        onClick={runManualProbe}
                        disabled={probeLoading || !probeUrl_.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {probeLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Test
                      </button>
                    </div>

                    {probeResult && (
                      <div className={`mt-2 rounded-lg border p-3 animate-fade-in-down ${
                        probeResult.ok === false ? 'bg-danger-50 border-danger-200' :
                        probeResult.status === 404 ? 'bg-gray-50 border-gray-200' :
                        'bg-success-50 border-success-200'
                      }`}>
                        {probeResult.ok === false ? (
                          <p className="text-sm text-danger-700 font-mono">🔌 Network error: {probeResult.error}</p>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1.5">
                              {probeResult.status === 404 ? (
                                <XCircle size={14} className="text-gray-500" />
                              ) : (
                                <CheckCircle2 size={14} className="text-success-500" />
                              )}
                              <span className="font-bold text-sm">
                                HTTP {probeResult.status}
                              </span>
                              {probeResult.contentType && (
                                <span className="text-xs text-gray-500 font-mono">({probeResult.contentType})</span>
                              )}
                            </div>
                            {probeResult.bodyPreview && (
                              <pre className="text-xs font-mono bg-white/60 p-2 rounded border border-gray-200 overflow-x-auto whitespace-pre-wrap break-all">
                                {probeResult.bodyPreview}
                              </pre>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2 italic">
                      💡 Tip: Open your backend's <code className="px-1 py-0.5 bg-gray-100 rounded">routes/</code> folder to find the actual paths.
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">💡 Next Steps</p>
                    <ul className="text-sm text-primary-900 space-y-1.5">
                      {allNetworkError && (
                        <li>• Start your backend: <code className="px-1.5 py-0.5 bg-white rounded">cd server && npm run dev</code></li>
                      )}
                      {foundEndpoints.length === 0 && !allNetworkError && (
                        <>
                          <li>• Check your backend's route files (usually <code className="px-1.5 py-0.5 bg-white rounded">server/routes/</code>)</li>
                          <li>• Use the Manual URL Probe above to test your actual routes</li>
                          <li>• Once you find them, update <code className="px-1.5 py-0.5 bg-white rounded">src/api/endpoints.js</code></li>
                          <li>• Or share your backend's <code className="px-1.5 py-0.5 bg-white rounded">app.js / server.js</code> with me and I'll align them automatically!</li>
                        </>
                      )}
                      {authFound.length > 0 && (
                        <li>• ✅ Auth endpoint working — try logging in now!</li>
                      )}
                      <li>• If running on different port, set <code className="px-1.5 py-0.5 bg-white rounded">VITE_API_URL</code> in <code className="px-1.5 py-0.5 bg-white rounded">.env</code></li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
