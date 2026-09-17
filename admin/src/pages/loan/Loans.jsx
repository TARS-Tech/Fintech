import { useEffect, useState } from "react";
import {
  getLoans,
  createLoan,
  updateLoan,
  updateLoanStatus,
} from "../../services/loan.service";
import {
  Landmark,
  Plus,
  Search,
  Filter,
  Edit2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight,
  Coins,
  Building2,
  Briefcase,
  GraduationCap,
  Car,
  ShieldCheck,
  Sparkles,
  Percent,
  Clock,
  Layers,
  ArrowUpRight,
  Loader2,
  FileText
} from "lucide-react";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form State
  const defaultForm = {
    name: "",
    slug: "",
    category: "personal",
    description: "",
    amountMin: "10000",
    amountMax: "500000",
    amountStep: "5000",
    tenureMin: "6",
    tenureMax: "60",
    tenureUnit: "months",
    interestRateMin: "10.5",
    interestRateMax: "18.0",
    interestRateUnit: "% p.a.",
    features: "No collateral required, Instant disbursal, Flexible EMI options",
    status: "active",
    displayOrder: 0,
  };

  const [form, setForm] = useState(defaultForm);

  const fetchLoans = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await getLoans();
      setLoans(response.data || []);
    } catch (err) {
      console.error("Get loans error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch loan products from server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Category Icon & Style Helper
  const getCategoryConfig = (cat) => {
    switch (cat?.toLowerCase()) {
      case "personal":
        return {
          label: "Personal Loan",
          icon: Coins,
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
          iconBg: "bg-indigo-100 text-indigo-600",
        };
      case "business":
        return {
          label: "Business / MSME",
          icon: Briefcase,
          badge: "bg-blue-50 text-blue-700 border-blue-200/60",
          iconBg: "bg-blue-100 text-blue-600",
        };
      case "home":
        return {
          label: "Home / Housing",
          icon: Building2,
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
          iconBg: "bg-emerald-100 text-emerald-600",
        };
      case "education":
        return {
          label: "Education",
          icon: GraduationCap,
          badge: "bg-purple-50 text-purple-700 border-purple-200/60",
          iconBg: "bg-purple-100 text-purple-600",
        };
      case "vehicle":
        return {
          label: "Vehicle / Auto",
          icon: Car,
          badge: "bg-amber-50 text-amber-700 border-amber-200/60",
          iconBg: "bg-amber-100 text-amber-600",
        };
      case "gold":
        return {
          label: "Gold Loan",
          icon: ShieldCheck,
          badge: "bg-yellow-50 text-yellow-800 border-yellow-200/60",
          iconBg: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          label: cat || "General",
          icon: Layers,
          badge: "bg-slate-100 text-slate-700 border-slate-200",
          iconBg: "bg-slate-100 text-slate-600",
        };
    }
  };

  // Auto Generate Slug
  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || !editingLoan
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        : prev.slug,
    }));
  };

  // Toggle Active / Inactive Status
  const handleToggleStatus = async (loan) => {
    const newStatus = loan.status === "active" ? "inactive" : "active";
    try {
      setActionLoadingId(loan._id);
      await updateLoanStatus(loan._id, newStatus);
      setLoans((prev) =>
        prev.map((item) =>
          item._id === loan._id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingLoan(null);
    setForm(defaultForm);
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (loan) => {
    setEditingLoan(loan);
    setForm({
      name: loan.name || "",
      slug: loan.slug || "",
      category: loan.category || "personal",
      description: loan.description || "",
      amountMin: loan.amount?.min?.toString() || "",
      amountMax: loan.amount?.max?.toString() || "",
      amountStep: loan.amount?.step?.toString() || "5000",
      tenureMin: loan.tenure?.min?.toString() || "",
      tenureMax: loan.tenure?.max?.toString() || "",
      tenureUnit: loan.tenure?.unit || "months",
      interestRateMin: loan.interestRate?.min?.toString() || "",
      interestRateMax: loan.interestRate?.max?.toString() || "",
      interestRateUnit: loan.interestRate?.unit || "% p.a.",
      features: Array.isArray(loan.features) ? loan.features.join(", ") : "",
      status: loan.status || "active",
      displayOrder: loan.displayOrder || 0,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Modal Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.slug || !form.category) {
      setFormError("Product name, slug, and category are required.");
      return;
    }

    const amountMin = Number(form.amountMin);
    const amountMax = Number(form.amountMax);
    if (amountMin > amountMax) {
      setFormError("Minimum loan amount cannot exceed maximum amount.");
      return;
    }

    const tenureMin = Number(form.tenureMin);
    const tenureMax = Number(form.tenureMax);
    if (tenureMin > tenureMax) {
      setFormError("Minimum tenure cannot exceed maximum tenure.");
      return;
    }

    const rateMin = Number(form.interestRateMin);
    const rateMax = Number(form.interestRateMax);
    if (rateMin > rateMax) {
      setFormError("Minimum interest rate cannot exceed maximum interest rate.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      category: form.category,
      description: form.description,
      amount: {
        min: amountMin,
        max: amountMax,
        step: Number(form.amountStep || 5000),
      },
      tenure: {
        min: tenureMin,
        max: tenureMax,
        unit: form.tenureUnit,
      },
      interestRate: {
        min: rateMin,
        max: rateMax,
        unit: form.interestRateUnit,
      },
      features: form.features
        ? form.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
      status: form.status,
      displayOrder: Number(form.displayOrder || 0),
    };

    try {
      setSubmitting(true);
      if (editingLoan) {
        await updateLoan(editingLoan._id, payload);
      } else {
        await createLoan(payload);
      }
      setIsModalOpen(false);
      fetchLoans();
    } catch (err) {
      console.error("Save loan error:", err);
      setFormError(
        err.response?.data?.message || "Failed to save loan product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Loans List
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loan.description && loan.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || loan.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const activeCount = loans.filter((l) => l.status === "active").length;
  const activeLoansList = loans.filter((l) => l.status === "active");
  const minInterestRate = activeLoansList.length > 0
    ? Math.min(...activeLoansList.map((l) => l.interestRate?.min ?? 999))
    : 0;
  const minInterestStr = minInterestRate > 0 && minInterestRate < 999 ? `${minInterestRate}% p.a.` : "—";
  
  const maxCredit = loans.length > 0
    ? Math.max(...loans.map((l) => l.amount?.max ?? 0))
    : 0;
  const maxCreditStr = maxCredit > 0 ? `₹${maxCredit.toLocaleString("en-IN")}` : "—";

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 h-32"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 h-28"></div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 h-96"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xl shadow-rose-500/5">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Loan Service Unavailable</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error}</p>
        <button
          onClick={() => fetchLoans()}
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
      
      {/* 1. Header Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Credit Offering Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Loan Products & Schemes
            </h1>
            <p className="text-sm text-slate-300/90 max-w-2xl leading-relaxed font-normal">
              Manage retail and commercial credit options, configure APR interest bands, tenure limits, and product eligibility criteria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => fetchLoans(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl backdrop-blur-md transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>Sync Products</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Loan Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Products</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{loans.length}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Configured in portal</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Products</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{activeCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Available for applicants</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Lowest Interest</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{minInterestStr}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Lowest APR product</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Max Credit Limit</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{maxCreditStr}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Highest loan ceiling</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Coins className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Main Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        
        {/* Table Filters & Toolbar */}
        <div className="p-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Product Catalog</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Showing {filteredLoans.length} of {loans.length} total loan products
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none w-48 sm:w-60 transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal Loan</option>
              <option value="business">Business / MSME</option>
              <option value="home">Home Loan</option>
              <option value="education">Education</option>
              <option value="vehicle">Vehicle</option>
              <option value="gold">Gold Loan</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-y border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Product & Category</th>
                <th className="py-3.5 px-4">Amount Range</th>
                <th className="py-3.5 px-4">Tenure Bracket</th>
                <th className="py-3.5 px-4">Interest Rate</th>
                <th className="py-3.5 px-4">Key Features</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const catConfig = getCategoryConfig(loan.category);
                  const Icon = catConfig.icon;
                  const isActionLoading = actionLoadingId === loan._id;

                  return (
                    <tr key={loan._id} className="hover:bg-slate-50/60 transition-colors group">
                      
                      {/* Product Name & Category */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${catConfig.iconBg}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                                {loan.name}
                              </p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catConfig.badge}`}>
                                {catConfig.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              /{loan.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount Range */}
                      <td className="py-4 px-4 font-extrabold text-slate-900 font-mono">
                        ₹{loan.amount?.min?.toLocaleString()} – ₹{loan.amount?.max?.toLocaleString()}
                      </td>

                      {/* Tenure */}
                      <td className="py-4 px-4 text-slate-800">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {loan.tenure?.min} – {loan.tenure?.max} {loan.tenure?.unit || "months"}
                        </div>
                      </td>

                      {/* Interest Rate */}
                      <td className="py-4 px-4 font-bold text-indigo-700 font-mono">
                        {loan.interestRate?.min}% – {loan.interestRate?.max}% {loan.interestRate?.unit || "p.a."}
                      </td>

                      {/* Features */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {loan.features && loan.features.length > 0 ? (
                            loan.features.slice(0, 2).map((feat, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium truncate max-w-[130px]">
                                • {feat}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">Standard Terms</span>
                          )}
                          {loan.features && loan.features.length > 2 && (
                            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                              +{loan.features.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          loan.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            loan.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`} />
                          {loan.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(loan)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(loan)}
                            disabled={isActionLoading}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                              loan.status === "active"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                            }`}
                            title={loan.status === "active" ? "Deactivate product" : "Activate product"}
                          >
                            {isActionLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : loan.status === "active" ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-rose-600" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-emerald-600" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                        <Landmark className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-slate-700">No loan products found</p>
                      <p className="text-slate-400 text-[11px]">
                        {searchQuery ? `No results matching "${searchQuery}"` : "Get started by adding your first credit offering."}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={handleOpenCreateModal}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs shadow-sm hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Loan</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium px-6">
          <span>Enterprise Credit Governance Engine v2.4</span>
          <span>FinPilot Financial Platform</span>
        </div>

      </div>

      {/* 4. Modal Dialog for Create / Edit Loan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingLoan ? "Edit Loan Product" : "Create New Loan Product"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {editingLoan ? "Update parameters for this active credit offering" : "Define limits, interest rates, and loan features"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Form Error Banner */}
              {formError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Loan Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Express Personal Loan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. express-personal-loan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business / MSME</option>
                    <option value="home">Home / Housing</option>
                    <option value="education">Education</option>
                    <option value="vehicle">Vehicle / Auto</option>
                    <option value="gold">Gold Loan</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Initial Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                  >
                    <option value="active">Active (Live in app)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Description / Marketing Overview
                </label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description highlighting loan benefits..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none resize-none"
                />
              </div>

              {/* Amount Range */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Loan Principal Amount Range (₹)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Min Amount</label>
                    <input
                      type="number"
                      required
                      value={form.amountMin}
                      onChange={(e) => setForm({ ...form, amountMin: e.target.value })}
                      placeholder="10000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Max Amount</label>
                    <input
                      type="number"
                      required
                      value={form.amountMax}
                      onChange={(e) => setForm({ ...form, amountMax: e.target.value })}
                      placeholder="500000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Step Increments</label>
                    <input
                      type="number"
                      value={form.amountStep}
                      onChange={(e) => setForm({ ...form, amountStep: e.target.value })}
                      placeholder="5000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tenure & Interest Rate Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tenure Range */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Tenure Bracket
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Min Tenure</label>
                      <input
                        type="number"
                        required
                        value={form.tenureMin}
                        onChange={(e) => setForm({ ...form, tenureMin: e.target.value })}
                        placeholder="6"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Max Tenure</label>
                      <input
                        type="number"
                        required
                        value={form.tenureMax}
                        onChange={(e) => setForm({ ...form, tenureMax: e.target.value })}
                        placeholder="60"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Interest Rate Range */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Interest Rate Band (% p.a.)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Min APR %</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={form.interestRateMin}
                        onChange={(e) => setForm({ ...form, interestRateMin: e.target.value })}
                        placeholder="10.5"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Max APR %</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={form.interestRateMax}
                        onChange={(e) => setForm({ ...form, interestRateMax: e.target.value })}
                        placeholder="18.0"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Key Features */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Features & Highlights (Comma Separated)
                </label>
                <input
                  type="text"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Instant disbursal, Zero foreclosure fee, Digital KYC"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingLoan ? "Save Changes" : "Create Product"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Loans;