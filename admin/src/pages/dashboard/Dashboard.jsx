import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboard.service";
import { getPartners } from "../../services/partner.service";
import {
  Users,
  Landmark,
  Building2,
  Tag,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Percent,
  ShieldCheck,
  Activity,
  ChevronRight,
  Search,
  FileText,
  Sparkles,
  Plus,
  SlidersHorizontal,
  ArrowRight,
  Filter
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const [statsRes, partnersRes] = await Promise.all([
        getDashboardStats(),
        getPartners().catch(() => ({ data: [] })),
      ]);

      const statsData = statsRes?.data || statsRes;
      setStats(statsData);
      setPartners(partnersRes?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load dashboard statistics. Please verify backend service connection."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Safe accessor helpers
  const totalCustomers = stats?.totalCustomers ?? stats?.data?.totalCustomers ?? 0;
  const activeLoans = stats?.activeLoans ?? stats?.data?.activeLoans ?? 0;
  const activePartners = stats?.activePartners ?? stats?.data?.activePartners ?? 0;
  const activeOffers = stats?.activeOffers ?? stats?.data?.activeOffers ?? 0;

  const recentApplications = [];

  const filteredApplications = recentApplications.filter(app => {
    const matchesSearch = app.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase().replace(" ", "");
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-72 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
          </div>
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
              </div>
              <div className="h-8 w-20 bg-slate-300 rounded-lg"></div>
              <div className="h-3 w-36 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* Big Block Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-80"></div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-80"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xl shadow-rose-500/5">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Dashboard Data Unavailable</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error}</p>
        <button
          onClick={() => fetchStats()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/25 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-800">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time Portfolio Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Financial Control & Operations
            </h1>
            <p className="text-sm text-slate-300/90 max-w-2xl leading-relaxed font-normal">
              Monitor active loan portfolio performance, lending partner connectivity, customer acquisition growth, and risk telemetry across all active products.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Time Filter Pill */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl backdrop-blur-md transition-all outline-none cursor-pointer"
            >
              <option value="7d" className="text-slate-900">Last 7 Days</option>
              <option value="30d" className="text-slate-900">Last 30 Days</option>
              <option value="90d" className="text-slate-900">Last 90 Days</option>
              <option value="year" className="text-slate-900">This Year</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl backdrop-blur-md transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Sync Stats"}</span>
            </button>

            {/* Primary Action Button */}
            <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCustomers.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Registered customer accounts</span>
          </div>
        </div>

        {/* Active Loans */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Loans
            </span>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeLoans.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active credit products</span>
          </div>
        </div>

        {/* Active Partners */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Partners
            </span>
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activePartners.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Lending banks & NBFCs</span>
          </div>
        </div>

        {/* Active Offers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Offers
            </span>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeOffers.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Live marketplace offers</span>
          </div>
        </div>

      </div>

      {/* 3. Analytics Charts & Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Loan Disbursal Trend (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Loan Disbursal & Revenue Telemetry</h3>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200/60">
                  +18.4% YoY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Monthly loan origination volume vs principal repayment collections
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span>Disbursed</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium ml-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Repaid</span>
              </div>
            </div>
          </div>

          {/* Visual Custom Interactive Bar Representation */}
          <div className="pt-4 pb-2 space-y-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 px-2 border-b border-slate-100 pb-3">
              {[
                { month: "Jan", disbursed: 65, repaid: 45 },
                { month: "Feb", disbursed: 72, repaid: 50 },
                { month: "Mar", disbursed: 80, repaid: 60 },
                { month: "Apr", disbursed: 75, repaid: 58 },
                { month: "May", disbursed: 90, repaid: 70 },
                { month: "Jun", disbursed: 85, repaid: 68 },
                { month: "Jul", disbursed: 98, repaid: 82 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-full pt-4">
                    {/* Disbursed Bar */}
                    <div 
                      className="w-1/2 bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:from-indigo-700 group-hover:to-indigo-600 shadow-xs relative"
                      style={{ height: `${item.disbursed}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                        ₹{item.disbursed * 10}L
                      </div>
                    </div>
                    {/* Repaid Bar */}
                    <div 
                      className="w-1/2 bg-slate-200 rounded-t-lg transition-all duration-300 group-hover:bg-slate-300 relative"
                      style={{ height: `${item.repaid}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="grid grid-cols-3 gap-4 pt-2 text-center sm:text-left">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block uppercase">Avg Ticket Size</span>
                <span className="text-base font-extrabold text-slate-900">₹4,25,000</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block uppercase">NPA Rate</span>
                <span className="text-base font-extrabold text-emerald-600">0.42%</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block uppercase">Approval SLA</span>
                <span className="text-base font-extrabold text-indigo-600">4.2 Mins</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Underwriting Risk & Partners Status (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Partner Health Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Lending Partners Status
              </h3>
              <span className="text-xs text-indigo-600 font-semibold">
                Total ({partners.length})
              </span>
            </div>

            <div className="space-y-3">
              {partners.length > 0 ? (
                partners.slice(0, 4).map((partner) => (
                  <div key={partner._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="font-semibold text-slate-800">{partner.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span className="uppercase font-bold text-slate-600">{partner.type}</span>
                      <span className={`font-bold ${partner.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {partner.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400 font-medium">
                  No lending partners configured yet.
                </div>
              )}
            </div>
          </div>

          {/* Risk Telemetry Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  AI Underwriting Risk Telemetry
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-semibold">
                Engine Active
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Low Risk (Credit Score 750+)</span>
                  <span className="font-bold text-white">72.4%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: "72.4%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Moderate Risk (Score 650-749)</span>
                  <span className="font-bold text-white">21.8%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: "21.8%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">High Risk / Flagged (&lt; 650)</span>
                  <span className="font-bold text-white">5.8%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: "5.8%" }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-300 flex items-center justify-between border-t border-indigo-800/80">
              <span>Auto-Approval Rate: <strong>64.2%</strong></span>
              <span className="text-indigo-300 cursor-pointer hover:underline">Config Rules</span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Recent Loan Applications & Activity Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        
        {/* Table Header & Controls */}
        <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Loan Applications</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Live queue of underwriting requests submitted across channels
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicant or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none w-48"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="inreview">In Review</option>
                <option value="disbursed">Disbursed</option>
                <option value="pendingkyc">Pending KYC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-y border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Applicant</th>
                <th className="py-3.5 px-4">Loan Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Lender Partner</th>
                <th className="py-3.5 px-4">Credit Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors group">
                    
                    {/* Applicant */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {app.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                            {app.customer}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{app.id} • {app.date}</p>
                        </div>
                      </div>
                    </td>

                    {/* Loan Type */}
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {app.type}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-extrabold text-slate-900 font-mono">
                      {app.amount}
                    </td>

                    {/* Lender Partner */}
                    <td className="py-4 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-700">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {app.partner}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{app.riskScore}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          app.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                          app.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {app.riskLevel}
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                        app.status === 'Disbursed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                        app.status === 'In Review' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'Approved' ? 'bg-emerald-500' :
                          app.status === 'Disbursed' ? 'bg-indigo-500' :
                          app.status === 'In Review' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        {app.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right pr-6">
                      <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold transition-colors inline-flex items-center gap-1">
                        <span>Review</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                    No applications found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium px-6">
          <span>Showing {filteredApplications.length} of {recentApplications.length} active sample applications</span>
          <button className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1">
            <span>View all applications in portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;