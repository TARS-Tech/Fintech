import { useEffect, useMemo, useState } from "react";
import {
  getLoanOffers,
  createLoanOffer,
  updateLoanOffer,
  updateLoanOfferStatus,
} from "../../services/loanOffer.service";
import { getLoans } from "../../services/loan.service";
import { getPartners } from "../../services/partner.service";

import {
  BadgeIndianRupee,
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
  Landmark,
  Building2,
  Star,
  Percent,
  Clock3,
  WalletCards,
  Sparkles,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

const LoanOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [loanFilter, setLoanFilter] = useState("all");
  const [partnerFilter, setPartnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const defaultForm = {
    loanId: "",
    partnerId: "",
    amountMin: "",
    amountMax: "",
    interestRate: "",
    tenureMin: "",
    tenureMax: "",
    tenureUnit: "months",
    processingFee: "Up to 2%",
    minCibilScore: "650",
    minMonthlySalary: "25000",
    status: "active",
    displayOrder: "0",
    isFeatured: false,
  };

  const [form, setForm] = useState(defaultForm);

  // Fetch Data
  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const [offersResponse, loansResponse, partnersResponse] =
        await Promise.all([getLoanOffers(), getLoans(), getPartners()]);

      setOffers(offersResponse.data || []);
      setLoans(loansResponse.data || []);
      setPartners(partnersResponse.data || []);
    } catch (err) {
      console.error("Fetch loan offers error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch loan offer data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "active");
  }, [loans]);

  const activePartners = useMemo(() => {
    return partners.filter((partner) => partner.status === "active");
  }, [partners]);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const loanName = offer.loanId?.name?.toLowerCase() || "";
      const partnerName = offer.partnerId?.name?.toLowerCase() || "";
      const partnerCode = offer.partnerId?.code?.toLowerCase() || "";
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        loanName.includes(search) ||
        partnerName.includes(search) ||
        partnerCode.includes(search);

      const matchesLoan =
        loanFilter === "all" || offer.loanId?._id === loanFilter;
      const matchesPartner =
        partnerFilter === "all" || offer.partnerId?._id === partnerFilter;
      const matchesStatus =
        statusFilter === "all" || offer.status === statusFilter;

      return matchesSearch && matchesLoan && matchesPartner && matchesStatus;
    });
  }, [offers, searchQuery, loanFilter, partnerFilter, statusFilter]);

  const totalOffers = offers.length;
  const activeOffersCount = offers.filter((offer) => offer.status === "active").length;
  const featuredOffersCount = offers.filter((offer) => offer.isFeatured).length;
  const activePartnerCount = partners.filter((partner) => partner.status === "active").length;

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "—";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const handleOpenCreateModal = () => {
    setEditingOffer(null);
    setForm(defaultForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (offer) => {
    setEditingOffer(offer);
    setForm({
      loanId: offer.loanId?._id || "",
      partnerId: offer.partnerId?._id || "",
      amountMin: offer.amount?.min?.toString() || "",
      amountMax: offer.amount?.max?.toString() || "",
      interestRate: offer.interestRate?.toString() || "",
      tenureMin: offer.tenure?.min?.toString() || "",
      tenureMax: offer.tenure?.max?.toString() || "",
      tenureUnit: offer.tenure?.unit || "months",
      processingFee: offer.processingFee || "",
      minCibilScore: offer.eligibilityCriteria?.minCibilScore?.toString() || "650",
      minMonthlySalary: offer.eligibilityCriteria?.minMonthlySalary?.toString() || "25000",
      status: offer.status || "active",
      displayOrder: offer.displayOrder?.toString() || "0",
      isFeatured: offer.isFeatured || false,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (offer) => {
    const newStatus = offer.status === "active" ? "inactive" : "active";
    try {
      setActionLoadingId(offer._id);
      await updateLoanOfferStatus(offer._id, newStatus);
      setOffers((prev) =>
        prev.map((item) =>
          item._id === offer._id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Offer status update error:", err);
      alert(err.response?.data?.message || "Failed to update offer status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (offer) => {
    try {
      setActionLoadingId(offer._id);
      await updateLoanOffer(offer._id, {
        isFeatured: !offer.isFeatured,
      });
      setOffers((prev) =>
        prev.map((item) =>
          item._id === offer._id ? { ...item, isFeatured: !item.isFeatured } : item
        )
      );
    } catch (err) {
      console.error("Featured update error:", err);
      alert(err.response?.data?.message || "Failed to update featured status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.loanId || !form.partnerId) {
      setFormError("Please select both a loan product and lending partner.");
      return;
    }

    const amountMin = Number(form.amountMin);
    const amountMax = Number(form.amountMax);
    if (!amountMin || !amountMax || amountMin > amountMax) {
      setFormError("Please enter a valid offer amount range.");
      return;
    }

    const interestRate = Number(form.interestRate);
    if (!interestRate || interestRate <= 0) {
      setFormError("Please enter a valid interest rate.");
      return;
    }

    const tenureMin = Number(form.tenureMin);
    const tenureMax = Number(form.tenureMax);
    if (!tenureMin || !tenureMax || tenureMin > tenureMax) {
      setFormError("Please enter a valid tenure range.");
      return;
    }

    const selectedLoan = loans.find((loan) => loan._id === form.loanId);
    if (!selectedLoan) {
      setFormError("Selected loan product could not be found.");
      return;
    }

    if (
      amountMin < selectedLoan.amount?.min ||
      amountMax > selectedLoan.amount?.max
    ) {
      setFormError(
        `Offer amount must stay within the selected loan product bounds: ${formatCurrency(
          selectedLoan.amount?.min
        )} – ${formatCurrency(selectedLoan.amount?.max)}.`
      );
      return;
    }

    const payload = {
      loanId: form.loanId,
      partnerId: form.partnerId,
      amount: {
        min: amountMin,
        max: amountMax,
      },
      interestRate,
      tenure: {
        min: tenureMin,
        max: tenureMax,
        unit: form.tenureUnit,
      },
      processingFee: form.processingFee.trim() || "Up to 2%",
      eligibilityCriteria: {
        minCibilScore: Number(form.minCibilScore),
        minMonthlySalary: Number(form.minMonthlySalary),
      },
      displayOrder: Number(form.displayOrder || 0),
      isFeatured: form.isFeatured,
    };

    try {
      setSubmitting(true);
      if (editingOffer) {
        await updateLoanOffer(editingOffer._id, payload);
      } else {
        await createLoanOffer({
          ...payload,
          status: form.status,
        });
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Save loan offer error:", err);
      setFormError(
        err.response?.data?.message || "Failed to save loan offer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-white border border-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 bg-white border border-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-white border border-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xl">
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-rose-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Loan Offer Service Unavailable</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
        <button
          onClick={() => fetchData()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              Lending Marketplace Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Loan Offers
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Configure partner-specific lending offers, eligibility requirements, interest rates, processing fees, and credit limits.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Sync Offers
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              Create Offer
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          label="Total Offers"
          value={totalOffers}
          subtitle="Configured marketplace offers"
          icon={WalletCards}
          iconClass="bg-indigo-50 text-indigo-600 border-indigo-100"
        />
        <MetricCard
          label="Active Offers"
          value={activeOffersCount}
          subtitle="Currently available"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <MetricCard
          label="Featured Offers"
          value={featuredOffersCount}
          subtitle="Priority marketplace placement"
          icon={Star}
          iconClass="bg-amber-50 text-amber-600 border-amber-100"
        />
        <MetricCard
          label="Active Partners"
          value={activePartnerCount}
          subtitle="Banks and NBFCs available"
          icon={Building2}
          iconClass="bg-blue-50 text-blue-600 border-blue-100"
        />
      </div>

      {/* 3. Main Offer Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Marketplace Offer Directory
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Showing {filteredOffers.length} of {offers.length} configured offers
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search loan or partner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-56 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <select
                value={loanFilter}
                onChange={(e) => setLoanFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Loans</option>
                {loans.map((loan) => (
                  <option key={loan._id} value={loan._id}>
                    {loan.name}
                  </option>
                ))}
              </select>

              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Partners</option>
                {partners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Loan & Partner</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Rate</th>
                <th className="px-4 py-4">Tenure</th>
                <th className="px-4 py-4">Eligibility</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOffers.length > 0 ? (
                filteredOffers.map((offer) => {
                  const isLoading = actionLoadingId === offer._id;

                  return (
                    <tr key={offer._id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Loan Product & Partner */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <Landmark className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-900">
                              {offer.loanId?.name || "Deleted Loan"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-500">
                            <Building2 className="w-3.5 h-3.5" />
                            <span className="font-semibold">
                              {offer.partnerId?.name || "Deleted Partner"}
                            </span>
                            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                              {offer.partnerId?.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amount Range */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 font-mono">
                          {formatCurrency(offer.amount?.min)}
                          <span className="text-slate-400"> – </span>
                          {formatCurrency(offer.amount?.max)}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {offer.processingFee}
                        </p>
                      </td>

                      {/* Interest Rate */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold">
                          <Percent className="w-3.5 h-3.5" />
                          {offer.interestRate}% p.a.
                        </span>
                      </td>

                      {/* Tenure */}
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center gap-1.5 text-slate-700">
                          <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold">
                            {offer.tenure?.min} – {offer.tenure?.max} {offer.tenure?.unit}
                          </span>
                        </div>
                      </td>

                      {/* Eligibility */}
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>CIBIL <strong className="text-slate-900">≥ {offer.eligibilityCriteria?.minCibilScore}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <BriefcaseBusiness className="w-3.5 h-3.5" />
                            <span>Salary ≥ {formatCurrency(offer.eligibilityCriteria?.minMonthlySalary)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status & Featured */}
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${
                            offer.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              offer.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                            }`} />
                            {offer.status}
                          </span>

                          {offer.isFeatured && (
                            <div className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              Featured
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(offer)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                            title="Edit offer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(offer)}
                            disabled={isLoading}
                            className={`p-2 rounded-xl transition-colors ${
                              offer.isFeatured
                                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                            title="Toggle featured status"
                          >
                            <Star className={`w-3.5 h-3.5 ${offer.isFeatured ? "fill-amber-400 text-amber-400" : ""}`} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(offer)}
                            disabled={isLoading}
                            className={`p-2 rounded-xl transition-colors ${
                              offer.status === "active"
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                            title={offer.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : offer.status === "active" ? (
                              <ToggleRight className="w-4 h-4" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <WalletCards className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700">No loan offers found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery ? `No offers matching "${searchQuery}"` : "Create your first partner lending offer."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 4. Modal Dialog for Create / Edit Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingOffer ? "Edit Loan Offer" : "Create Loan Offer"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Connect a lending product with an active financial partner.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Loan + Partner Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Loan Product *"
                  value={form.loanId}
                  onChange={(val) => setForm({ ...form, loanId: val })}
                >
                  <option value="">Select loan product</option>
                  {activeLoans.map((loan) => (
                    <option key={loan._id} value={loan._id}>
                      {loan.name}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="Lending Partner *"
                  value={form.partnerId}
                  onChange={(val) => setForm({ ...form, partnerId: val })}
                >
                  <option value="">Select bank or NBFC</option>
                  {activePartners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name} — {partner.code}
                    </option>
                  ))}
                </FormSelect>
              </div>

              {/* Amount Range */}
              <FormSection title="Offer Amount Range" icon={BadgeIndianRupee}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Minimum Amount (₹)"
                    type="number"
                    value={form.amountMin}
                    onChange={(val) => setForm({ ...form, amountMin: val })}
                  />
                  <FormInput
                    label="Maximum Amount (₹)"
                    type="number"
                    value={form.amountMax}
                    onChange={(val) => setForm({ ...form, amountMax: val })}
                  />
                </div>
              </FormSection>

              {/* Interest + Processing Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSection title="Interest Rate" icon={Percent}>
                  <FormInput
                    label="Interest Rate (% p.a.)"
                    type="number"
                    step="0.01"
                    value={form.interestRate}
                    onChange={(val) => setForm({ ...form, interestRate: val })}
                  />
                </FormSection>

                <FormSection title="Processing Fee" icon={WalletCards}>
                  <FormInput
                    label="Fee Description"
                    value={form.processingFee}
                    onChange={(val) => setForm({ ...form, processingFee: val })}
                  />
                </FormSection>
              </div>

              {/* Tenure Range */}
              <FormSection title="Repayment Tenure" icon={Clock3}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="Minimum Tenure"
                    type="number"
                    value={form.tenureMin}
                    onChange={(val) => setForm({ ...form, tenureMin: val })}
                  />
                  <FormInput
                    label="Maximum Tenure"
                    type="number"
                    value={form.tenureMax}
                    onChange={(val) => setForm({ ...form, tenureMax: val })}
                  />
                  <FormSelect
                    label="Tenure Unit"
                    value={form.tenureUnit}
                    onChange={(val) => setForm({ ...form, tenureUnit: val })}
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </FormSelect>
                </div>
              </FormSection>

              {/* Eligibility Criteria */}
              <FormSection title="Minimum Eligibility Criteria" icon={ShieldCheck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Minimum CIBIL Score"
                    type="number"
                    value={form.minCibilScore}
                    onChange={(val) => setForm({ ...form, minCibilScore: val })}
                  />
                  <FormInput
                    label="Minimum Monthly Salary (₹)"
                    type="number"
                    value={form.minMonthlySalary}
                    onChange={(val) => setForm({ ...form, minMonthlySalary: val })}
                  />
                </div>
              </FormSection>

              {/* Order & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Display Order"
                  type="number"
                  value={form.displayOrder}
                  onChange={(val) => setForm({ ...form, displayOrder: val })}
                />

                {!editingOffer && (
                  <FormSelect
                    label="Initial Status"
                    value={form.status}
                    onChange={(val) => setForm({ ...form, status: val })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                )}
              </div>

              {/* Featured Switch */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    Featured Marketplace Offer
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Prioritize this offer in the customer-facing loan marketplace.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
              </label>

              {/* Submit Buttons */}
              <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-500/25"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {editingOffer ? "Save Changes" : "Create Offer"}
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

/* Helper Subcomponents */

const MetricCard = ({ label, value, subtitle, icon: Icon, iconClass }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-sm">
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
      <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
        {title}
      </span>
    </div>
    {children}
  </div>
);

const FormInput = ({ label, type = "text", value, onChange, step }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500"
    />
  </div>
);

const FormSelect = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default LoanOffers;
