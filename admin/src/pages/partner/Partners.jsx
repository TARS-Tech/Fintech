import { useEffect, useState } from "react";
import {
  getPartners,
  createPartner,
  updatePartner,
  updatePartnerStatus,
  deletePartner,
} from "../../services/partner.service";

import {
  Building2,
  Landmark,
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Sparkles,
  Handshake,
  BadgeCheck,
  Hash,
  Trash2,
} from "lucide-react";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const defaultForm = {
    name: "",
    code: "",
    type: "Bank",
    logo: "",
    status: "active",
  };

  const [form, setForm] = useState(defaultForm);

  // Fetch Partners
  const fetchPartners = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await getPartners();
      setPartners(response.data || []);
    } catch (err) {
      console.error("Get partners error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch lending partners from server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Type Icon & Badge Config
  const getPartnerTypeConfig = (type) => {
    switch (type) {
      case "Bank":
        return {
          icon: Landmark,
          label: "Bank",
          badge: "bg-blue-50 text-blue-700 border border-blue-200/70",
          iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
        };
      case "NBFC":
        return {
          icon: Building2,
          label: "NBFC",
          badge: "bg-purple-50 text-purple-700 border border-purple-200/70",
          iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
        };
      default:
        return {
          icon: Building2,
          label: type || "Partner",
          badge: "bg-slate-100 text-slate-600 border border-slate-200",
          iconBg: "bg-slate-100 text-slate-600 border border-slate-200",
        };
    }
  };

  // Input Handlers
  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: val,
      code: !editingPartner && (!prev.code || prev.code === prev.name.substring(0, 4).toUpperCase())
        ? val.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "")
        : prev.code,
    }));
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    setForm((prev) => ({
      ...prev,
      code: value,
    }));
  };

  // Toggle Status
  const handleToggleStatus = async (partner) => {
    const newStatus = partner.status === "active" ? "inactive" : "active";
    try {
      setActionLoadingId(partner._id);
      await updatePartnerStatus(partner._id, newStatus);
      setPartners((prev) =>
        prev.map((item) =>
          item._id === partner._id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Partner status update error:", err);
      alert(err.response?.data?.message || "Failed to update partner status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Partner
  const handleDeletePartner = async (partner) => {
    if (!window.confirm(`Are you sure you want to delete ${partner.name}?`)) {
      return;
    }
    try {
      setActionLoadingId(partner._id);
      await deletePartner(partner._id);
      setPartners((prev) => prev.filter((p) => p._id !== partner._id));
    } catch (err) {
      console.error("Delete partner error:", err);
      alert(err.response?.data?.message || "Failed to delete partner");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPartner(null);
    setForm(defaultForm);
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (partner) => {
    setEditingPartner(partner);
    setForm({
      name: partner.name || "",
      code: partner.code || "",
      type: partner.type || "Bank",
      logo: partner.logo || "",
      status: partner.status || "active",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Partner name is required.");
      return;
    }

    if (!form.code.trim()) {
      setFormError("Partner code is required.");
      return;
    }

    if (!form.type) {
      setFormError("Please select a partner type.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
      logo: form.logo.trim(),
      status: form.status,
    };

    try {
      setSubmitting(true);
      if (editingPartner) {
        await updatePartner(editingPartner._id, payload);
      } else {
        await createPartner(payload);
      }
      setIsModalOpen(false);
      fetchPartners(true);
    } catch (err) {
      console.error("Save partner error:", err);
      setFormError(
        err.response?.data?.message || "Failed to save lending partner."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filter List
  const filteredPartners = partners.filter((partner) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      partner.name?.toLowerCase().includes(search) ||
      partner.code?.toLowerCase().includes(search);
    const matchesType = typeFilter === "all" || partner.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || partner.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate Metrics
  const activeCount = partners.filter((p) => p.status === "active").length;
  const bankCount = partners.filter((p) => p.type === "Bank").length;
  const nbfcCount = partners.filter((p) => p.type === "NBFC").length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl border border-slate-200 h-28" />
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xl shadow-rose-500/5">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Partner Service Unavailable</h3>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => fetchPartners()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all"
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lending Network Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lending Partners
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage banks and NBFC partners available across the FinPilot credit distribution network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchPartners(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>Sync Partners</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Partner</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          label="Total Partners"
          value={partners.length}
          subtitle="Configured institutions"
          icon={Handshake}
          iconClass="bg-indigo-50 text-indigo-600 border-indigo-100"
        />
        <MetricCard
          label="Active Partners"
          value={activeCount}
          subtitle="Available for offers"
          icon={BadgeCheck}
          iconClass="bg-emerald-50 text-emerald-600 border-emerald-100"
          valueClass="text-emerald-600"
        />
        <MetricCard
          label="Bank Partners"
          value={bankCount}
          subtitle="Registered banks"
          icon={Landmark}
          iconClass="bg-blue-50 text-blue-600 border-blue-100"
        />
        <MetricCard
          label="NBFC Partners"
          value={nbfcCount}
          subtitle="Non-bank institutions"
          icon={Building2}
          iconClass="bg-purple-50 text-purple-600 border-purple-100"
        />
      </div>

      {/* 3. Partner Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Partner Directory</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Showing {filteredPartners.length} of {partners.length} lending partners
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search partner or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none w-52"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Institutions</option>
              <option value="Bank">Banks</option>
              <option value="NBFC">NBFCs</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
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
                <th className="py-3.5 px-6">Institution</th>
                <th className="py-3.5 px-4">Partner Code</th>
                <th className="py-3.5 px-4">Institution Type</th>
                <th className="py-3.5 px-4">Network Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => {
                  const typeConfig = getPartnerTypeConfig(partner.type);
                  const Icon = typeConfig.icon;
                  const isActionLoading = actionLoadingId === partner._id;

                  return (
                    <tr key={partner._id} className="hover:bg-slate-50/60 transition-colors group">
                      
                      {/* Name & Logo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {partner.logo ? (
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.iconBg}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                              {partner.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Lending institution
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Partner Code */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {partner.code}
                        </span>
                      </td>

                      {/* Institution Type */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${typeConfig.badge}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {typeConfig.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          partner.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            partner.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`} />
                          {partner.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-slate-500">
                        {partner.createdAt
                          ? new Date(partner.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(partner)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                            title="Edit Partner"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeletePartner(partner)}
                            disabled={isActionLoading}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
                            title="Delete Partner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(partner)}
                            disabled={isActionLoading}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                              partner.status === "active"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                            }`}
                          >
                            {isActionLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : partner.status === "active" ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-rose-600" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-emerald-600" />
                                Activate
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
                  <td colSpan="6" className="py-16 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                        <Handshake className="w-7 h-7" />
                      </div>
                      <p className="font-semibold text-slate-700">No lending partners found</p>
                      <p className="text-slate-400 text-[11px]">
                        {searchQuery
                          ? `No results matching "${searchQuery}"`
                          : "Start building your lending network by adding a bank or NBFC partner."}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={handleOpenCreateModal}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          Add Partner
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
          <span>Partner Network Management</span>
          <span>FinPilot Financial Platform</span>
        </div>
      </div>

      {/* 4. Modal Dialog for Create / Edit Partner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingPartner ? "Edit Lending Partner" : "Add Lending Partner"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure a bank or NBFC for the lending network.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {formError}
                </div>
              )}

              {/* Institution Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Enter partner name (e.g. Partner Bank A)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              {/* Code & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Partner Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={handleCodeChange}
                    placeholder="e.g. PRTNR"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Institution Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                  >
                    <option value="Bank">Bank</option>
                    <option value="NBFC">NBFC</option>
                  </select>
                </div>
              </div>

              {/* Logo URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Logo Image URL
                </label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  Optional. Leave empty to use standard institution icon.
                </p>
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
                  <option value="active">Active — Available for Loan Offers</option>
                  <option value="inactive">Inactive — Hidden from Offer Assignment</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {editingPartner ? "Save Changes" : "Create Partner"}
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

const MetricCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  valueClass = "text-slate-900",
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {label}
        </span>
        <span className={`text-2xl font-extrabold mt-1 block ${valueClass}`}>
          {value}
        </span>
        <span className="text-[11px] text-slate-500 mt-0.5 block">
          {subtitle}
        </span>
      </div>
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Partners;
