import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Landmark,
  Building2,
  Tag,
  FileText,
  Users,
  LogOut,
  Search,
  Bell,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Calendar,
  CheckCircle2
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("adminUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login", { replace: true });
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Loans",
      path: "/admin/loans",
      icon: Landmark,
    },
    {
      label: "Partners",
      path: "/admin/partners",
      icon: Building2,
    },
    {
      label: "Offers",
      path: "/admin/offers",
      icon: Tag,
    },
    {
      label: "Applications",
      path: "/admin/applications",
      icon: FileText,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
  ];

  // Helper to get active page title
  const currentNavItem = navItems.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentNavItem ? currentNavItem.label : "Admin Portal";

  return (
    <div className="min-h-screen bg-slate-50/80 flex font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 h-screen ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header / Brand Logo */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/30 text-lg tracking-wider">
                FP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight">FinPilot</span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200/60 uppercase">PRO</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">Enterprise Admin</p>
              </div>
            </div>

            <button 
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Sidebar Footer: Admin Profile & Logout */}
          <div className="p-4 border-t border-slate-100 space-y-3">
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || "System Admin"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email || "admin@finpilot.com"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                {pageTitle}
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block mt-0.5">
                Overview & analytics governance
              </p>
            </div>
          </div>

          {/* Middle: PulsePay Search Bar */}
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers, loans, partners..."
              className="w-full pl-10 pr-12 py-2 bg-slate-100/70 border border-slate-200/60 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Right Action Icons & Status Pill */}
          <div className="flex items-center gap-3">
            
            {/* System Health Green Pill */}
            <div className="hidden xl:flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>System Live</span>
            </div>

            {/* Date Pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Notification Bell */}
            <button 
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            {/* User Dropdown Trigger */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block">
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
            </div>

          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}