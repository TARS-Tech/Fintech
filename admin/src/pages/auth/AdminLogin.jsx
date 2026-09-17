import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminAuth.service";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin(form.email, form.password);
      
      // Store token & user info in localStorage
      localStorage.setItem("adminAccessToken", res.data.accessToken);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to sign in. Please verify your admin credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Subtle Mesh / Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
      </div>

      {/* Main Card Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/70 border border-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: PulsePay Showcase (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Background Ambient Decorative Light */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl" />

          {/* Top Brand Pill */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                FP
              </div>
              <span className="font-semibold text-sm tracking-tight text-white/90">FinPilot Admin</span>
              <span className="text-[10px] font-medium bg-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30 uppercase tracking-wider">v2.4</span>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise Financial Control Center
              </h2>
              <p className="mt-2.5 text-xs lg:text-sm text-slate-300/90 leading-relaxed">
                Monitor portfolio health, manage partner loans, and analyze customer risk metrics in real-time.
              </p>
            </div>
          </div>

          {/* PulsePay Mini Dashboard Card Showcase */}
          <div className="relative z-10 my-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl space-y-4">
              {/* Stat Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>Monthly Portfolio MRR</span>
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.4%</span>
                </div>
              </div>

              {/* Big Metric */}
              <div>
                <span className="text-3xl font-bold tracking-tight text-white">$482,340</span>
                <span className="text-xs text-slate-400 ml-2 font-normal">from last month</span>
              </div>

              {/* Mini Sparkline Bar Chart Representation */}
              <div className="flex items-end gap-1.5 h-12 pt-2">
                {[35, 42, 28, 55, 48, 62, 80, 75, 90, 85, 100].map((height, idx) => (
                  <div key={idx} className="flex-1 bg-slate-700/60 rounded-t overflow-hidden h-full flex items-end">
                    <div 
                      className={`w-full transition-all duration-500 ${
                        idx === 10 ? 'bg-indigo-400 shadow-lg shadow-indigo-500/50' : 'bg-indigo-500/40 hover:bg-indigo-400/60'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>

              {/* Security Pill Footer inside Left Panel */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> System Operational
                </span>
                <span className="text-slate-400 font-mono text-[10px]">99.99% Uptime</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>256-bit AES Security • Strict Role-Based Access Control</span>
          </div>
        </div>

        {/* Right Side: Login Form (7 cols on desktop) */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
                <LockKeyhole className="w-3.5 h-3.5" /> Admin Authentication
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back 👋
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Please enter your credentials to access the FinPilot management portal.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@finpilot.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    defaultChecked
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-slate-400 hover:text-indigo-600 cursor-pointer font-medium transition-colors">
                  Contact SuperAdmin
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 focus:ring-4 focus:ring-indigo-500/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Notice */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Internal Portal • Unauthorized Access Attempt is Prohibited
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}