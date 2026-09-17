import { useEffect, useState } from "react";
import {
    Users,
    Search,
    RefreshCw,
    UserRound,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Clock3,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    BriefcaseBusiness,
    IndianRupee,
    CreditCard,
    FileCheck2,
    X,
    AlertCircle,
    Loader2,
    ChevronRight,
    BadgeCheck,
    CircleDollarSign,
    Activity,
} from "lucide-react";

import {
    getCustomers,
    getCustomerById,
} from "../../services/customer.service";

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");

    const fetchCustomers = async (isRefresh = false, search = searchQuery) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getCustomers(search.trim());

            setCustomers(response.data || []);
        } catch (err) {
            console.error("Get customers error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch customers from server."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(false, searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        fetchCustomers(false, "");
    };

    const handleOpenCustomer = async (customer) => {
        try {
            setSelectedCustomer(null);
            setDetailsError("");
            setDetailsLoading(true);

            const response = await getCustomerById(customer._id);

            setSelectedCustomer(response.data);
        } catch (err) {
            console.error("Get customer details error:", err);

            setDetailsError(
                err.response?.data?.message ||
                "Failed to load customer details."
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null || value === "") {
            return "—";
        }

        return `₹${Number(value).toLocaleString("en-IN")}`;
    };

    const getInitials = (name) => {
        if (!name) return "CU";

        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    const getProfileStatus = (customer) => {
        if (customer.profileCompleted) {
            return {
                label: "Complete",
                className:
                    "bg-emerald-50 text-emerald-700 border-emerald-200/70",
                icon: CheckCircle2,
            };
        }

        return {
            label: "Incomplete",
            className: "bg-amber-50 text-amber-700 border-amber-200/70",
            icon: Clock3,
        };
    };

    const getKycStatus = (customer) => {
        if (customer.kycCompleted) {
            return {
                label: "Verified",
                className:
                    "bg-emerald-50 text-emerald-700 border-emerald-200/70",
                icon: ShieldCheck,
            };
        }

        return {
            label: "Pending",
            className: "bg-amber-50 text-amber-700 border-amber-200/70",
            icon: ShieldAlert,
        };
    };

    const totalCustomers = customers.length;

    const completedProfiles = customers.filter(
        (customer) => customer.profileCompleted
    ).length;

    const completedKyc = customers.filter(
        (customer) => customer.kycCompleted
    ).length;

    const incompleteCustomers = customers.filter(
        (customer) => !customer.profileCompleted || !customer.kycCompleted
    ).length;

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse pb-10">
                <div className="bg-white rounded-3xl border border-slate-200/80 h-36" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="bg-white rounded-2xl border border-slate-200/80 h-28"
                        />
                    ))}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 h-[500px]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto my-16 bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-xl shadow-rose-500/5">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-4">
                    <AlertCircle className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                    Customer Service Unavailable
                </h3>

                <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
                    {error}
                </p>

                <button
                    onClick={() => fetchCustomers()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-800">
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
                            <Users className="w-3.5 h-3.5" />
                            <span>Customer Management</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
                            Customers
                        </h1>

                        <p className="text-sm text-slate-300/90 max-w-2xl mt-2 leading-relaxed">
                            Review registered customers, profile completion,
                            KYC verification, financial information and loan
                            eligibility.
                        </p>
                    </div>

                    <button
                        onClick={() => fetchCustomers(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""
                                }`}
                        />
                        {refreshing ? "Syncing..." : "Sync Customers"}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    label="Total Customers"
                    value={totalCustomers}
                    description="Registered customer accounts"
                    icon={Users}
                    iconClass="bg-indigo-50 text-indigo-600 border-indigo-100"
                />

                <MetricCard
                    label="Profiles Complete"
                    value={completedProfiles}
                    description="Completed customer profiles"
                    icon={CheckCircle2}
                    iconClass="bg-emerald-50 text-emerald-600 border-emerald-100"
                />

                <MetricCard
                    label="KYC Verified"
                    value={completedKyc}
                    description="Customers with completed KYC"
                    icon={ShieldCheck}
                    iconClass="bg-blue-50 text-blue-600 border-blue-100"
                />

                <MetricCard
                    label="Needs Attention"
                    value={incompleteCustomers}
                    description="Profile or KYC incomplete"
                    icon={Activity}
                    iconClass="bg-amber-50 text-amber-600 border-amber-100"
                />
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Customer Directory
                            </h2>

                            <p className="text-xs text-slate-400 font-medium mt-1">
                                {searchQuery
                                    ? `Search results for "${searchQuery}"`
                                    : "All registered FinPilot customers"}
                            </p>
                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search name, email or phone..."
                                    className="w-full sm:w-72 pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                                <th className="py-3.5 px-6">
                                    Customer
                                </th>

                                <th className="py-3.5 px-4">
                                    Contact
                                </th>

                                <th className="py-3.5 px-4">
                                    Profile
                                </th>

                                <th className="py-3.5 px-4">
                                    KYC
                                </th>

                                <th className="py-3.5 px-4">
                                    Joined
                                </th>

                                <th className="py-3.5 px-4 text-right pr-6">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {customers.length > 0 ? (
                                customers.map((customer) => {
                                    const profileStatus =
                                        getProfileStatus(customer);

                                    const kycStatus =
                                        getKycStatus(customer);

                                    const ProfileIcon =
                                        profileStatus.icon;

                                    const KycIcon = kycStatus.icon;

                                    return (
                                        <tr
                                            key={customer._id}
                                            className="hover:bg-slate-50/60 transition-colors group"
                                        >
                                            {/* Customer */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                                                        {customer.profileImage ? (
                                                            <img
                                                                src={
                                                                    customer.profileImage
                                                                }
                                                                alt=""
                                                                className="w-full h-full rounded-xl object-cover"
                                                            />
                                                        ) : (
                                                            getInitials(
                                                                customer.name
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm text-slate-900 truncate">
                                                            {customer.name ||
                                                                "Unnamed Customer"}
                                                        </p>

                                                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                            ID:{" "}
                                                            {customer._id?.slice(
                                                                -8
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    {customer.email && (
                                                        <div className="flex items-center gap-1.5 text-slate-600">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="truncate max-w-[180px]">
                                                                {
                                                                    customer.email
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                    {customer.phone && (
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />

                                                            <span>
                                                                {customer.countryCode ||
                                                                    "+91"}{" "}
                                                                {
                                                                    customer.phone
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Profile */}
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${profileStatus.className}`}
                                                >
                                                    <ProfileIcon className="w-3.5 h-3.5" />
                                                    {profileStatus.label}
                                                </span>
                                            </td>

                                            {/* KYC */}
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${kycStatus.className}`}
                                                >
                                                    <KycIcon className="w-3.5 h-3.5" />
                                                    {kycStatus.label}
                                                </span>
                                            </td>

                                            {/* Joined */}
                                            <td className="py-4 px-4 text-slate-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                                    {formatDate(
                                                        customer.createdAt
                                                    )}
                                                </div>
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-4 text-right pr-6">
                                                <button
                                                    onClick={() =>
                                                        handleOpenCustomer(
                                                            customer
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold transition-colors"
                                                >
                                                    View
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-16 text-center"
                                    >
                                        <div className="max-w-sm mx-auto">
                                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                                                <Users className="w-7 h-7" />
                                            </div>

                                            <h3 className="mt-4 font-bold text-slate-800 text-sm">
                                                No customers found
                                            </h3>

                                            <p className="text-xs text-slate-400 mt-1.5">
                                                {searchQuery
                                                    ? "Try a different name, email or phone number."
                                                    : "No customer accounts are available yet."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>
                        Showing {customers.length} customer
                        {customers.length !== 1 ? "s" : ""}
                    </span>

                    <span>FinPilot Customer Registry</span>
                </div>
            </div>

            {/* Customer Details Modal */}
            {(selectedCustomer || detailsLoading || detailsError) && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedCustomer(null);
                            setDetailsError("");
                        }
                    }}
                >
                    <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                    <UserRound className="w-5 h-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Customer Details
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Read-only customer information
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedCustomer(null);
                                    setDetailsError("");
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto p-6">
                            {detailsLoading ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />

                                    <p className="text-sm font-semibold text-slate-700 mt-4">
                                        Loading customer profile...
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Fetching KYC, financial and eligibility
                                        information.
                                    </p>
                                </div>
                            ) : detailsError ? (
                                <div className="py-16 text-center">
                                    <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
                                        <AlertCircle className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 mt-4">
                                        Unable to load details
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-1">
                                        {detailsError}
                                    </p>
                                </div>
                            ) : selectedCustomer ? (
                                <CustomerDetails
                                    data={selectedCustomer}
                                    formatDate={formatDate}
                                    formatCurrency={formatCurrency}
                                    getInitials={getInitials}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MetricCard = ({
    label,
    value,
    description,
    icon: Icon,
    iconClass,
}) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {label}
                </span>

                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                    {value}
                </span>

                <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {description}
                </span>
            </div>

            <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${iconClass}`}
            >
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
};

const CustomerDetails = ({
    data,
    formatDate,
    formatCurrency,
    getInitials,
}) => {
    const customer = data.customer;
    const kyc = data.kyc;
    const financial = data.financialProfile;
    const eligibility = data.eligibility;

    const eligibilityStatus =
        eligibility?.status?.toLowerCase() || "not calculated";

    const isEligible =
        eligibilityStatus === "eligible" ||
        eligibilityStatus === "approved";

    return (
        <div className="space-y-6">
            {/* Identity Header */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-extrabold text-lg">
                            {customer.profileImage ? (
                                <img
                                    src={customer.profileImage}
                                    alt=""
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                getInitials(customer.name)
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">
                                {customer.name || "Unnamed Customer"}
                            </h3>

                            <p className="text-xs text-slate-400 font-mono mt-1">
                                Customer ID: {customer._id}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <StatusBadge
                                    active={customer.profileCompleted}
                                    activeLabel="Profile Complete"
                                    inactiveLabel="Profile Incomplete"
                                />

                                <StatusBadge
                                    active={customer.kycCompleted}
                                    activeLabel="KYC Complete"
                                    inactiveLabel="KYC Pending"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Registered
                        </p>

                        <p className="text-sm font-bold text-slate-800 mt-1">
                            {formatDate(customer.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <Section title="Basic Information" icon={UserRound}>
                <InfoItem
                    icon={Mail}
                    label="Email"
                    value={customer.email}
                />

                <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={
                        customer.phone
                            ? `${customer.countryCode || "+91"} ${customer.phone
                            }`
                            : null
                    }
                />

                <InfoItem
                    icon={CalendarDays}
                    label="Date of Birth"
                    value={formatDate(customer.dob)}
                />

                <InfoItem
                    icon={UserRound}
                    label="Gender"
                    value={customer.gender}
                />

                <InfoItem
                    icon={MapPin}
                    label="City"
                    value={customer.city}
                />

                <InfoItem
                    icon={MapPin}
                    label="State"
                    value={customer.state}
                />

                <InfoItem
                    icon={MapPin}
                    label="Pincode"
                    value={customer.pincode}
                />

                <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={customer.address}
                    fullWidth
                />
            </Section>

            {/* KYC */}
            <Section title="KYC Verification" icon={ShieldCheck}>
                {kyc ? (
                    <>
                        <InfoItem
                            icon={ShieldCheck}
                            label="KYC Status"
                            value={kyc.status}
                            valueClass={
                                kyc.kycCompleted
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                            }
                        />

                        <InfoItem
                            icon={BadgeCheck}
                            label="Aadhaar"
                            value={
                                kyc.aadhaar?.masked ||
                                (kyc.aadhaarVerified
                                    ? "Verified"
                                    : "Not verified")
                            }
                        />

                        <InfoItem
                            icon={BadgeCheck}
                            label="PAN"
                            value={
                                kyc.pan?.masked ||
                                (kyc.panVerified
                                    ? "Verified"
                                    : "Not verified")
                            }
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="Verified At"
                            value={formatDate(kyc.verifiedAt)}
                        />
                    </>
                ) : (
                    <EmptySection
                        icon={ShieldAlert}
                        text="No KYC record available."
                    />
                )}
            </Section>

            {/* Financial Profile */}
            <Section
                title="Financial Profile"
                icon={CircleDollarSign}
            >
                {financial ? (
                    <>
                        <InfoItem
                            icon={IndianRupee}
                            label="Monthly Salary"
                            value={formatCurrency(
                                financial.monthlySalary
                            )}
                            valueClass="text-slate-900 font-bold"
                        />

                        <InfoItem
                            icon={BriefcaseBusiness}
                            label="Employment Type"
                            value={financial.employmentType}
                        />

                        <InfoItem
                            icon={BriefcaseBusiness}
                            label="Company"
                            value={financial.company}
                        />

                        <InfoItem
                            icon={CreditCard}
                            label="Existing Loans"
                            value={financial.existingLoans}
                        />

                        <InfoItem
                            icon={IndianRupee}
                            label="Existing EMI"
                            value={formatCurrency(
                                financial.existingEmi
                            )}
                        />

                        <InfoItem
                            icon={Activity}
                            label="CIBIL Score"
                            value={financial.cibilScore}
                            valueClass="text-indigo-600 font-bold"
                        />

                        <InfoItem
                            icon={FileCheck2}
                            label="CIBIL Source"
                            value={financial.cibilSource}
                        />

                        <InfoItem
                            icon={BadgeCheck}
                            label="CIBIL Verified"
                            value={
                                financial.cibilVerified
                                    ? "Verified"
                                    : "Not Verified"
                            }
                        />
                    </>
                ) : (
                    <EmptySection
                        icon={CircleDollarSign}
                        text="No financial profile available."
                    />
                )}
            </Section>

            {/* Eligibility */}
            <Section title="Loan Eligibility" icon={CreditCard}>
                {eligibility ? (
                    <>
                        <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Eligibility Score
                                </p>

                                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                    {eligibility.score ?? "—"}
                                </p>
                            </div>

                            <span
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${isEligible
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}
                            >
                                {isEligible ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <XCircle className="w-4 h-4" />
                                )}

                                {eligibility.status || "Not calculated"}
                            </span>
                        </div>

                        <InfoItem
                            icon={CalendarDays}
                            label="Calculated At"
                            value={formatDate(
                                eligibility.calculatedAt
                            )}
                        />

                        <InfoItem
                            icon={Activity}
                            label="Status"
                            value={eligibility.status}
                        />

                        {eligibility.breakdown && (
                            <div className="sm:col-span-2">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                                    Score Breakdown
                                </p>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                    <pre className="text-[11px] text-slate-600 whitespace-pre-wrap font-mono overflow-x-auto">
                                        {JSON.stringify(
                                            eligibility.breakdown,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <EmptySection
                        icon={CreditCard}
                        text="Eligibility has not been calculated."
                    />
                )}
            </Section>
        </div>
    );
};

const Section = ({ title, icon: Icon, children }) => {
    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center gap-2">
                <Icon className="w-4 h-4 text-indigo-600" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {title}
                </h3>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {children}
            </div>
        </div>
    );
};

const InfoItem = ({
    icon: Icon,
    label,
    value,
    fullWidth = false,
    valueClass = "",
}) => {
    return (
        <div className={fullWidth ? "sm:col-span-2" : ""}>
            <div className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />

                <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                        {label}
                    </p>

                    <p
                        className={`text-xs font-semibold text-slate-700 mt-1 break-words ${valueClass || ""
                            }`}
                    >
                        {value !== undefined &&
                            value !== null &&
                            value !== ""
                            ? value
                            : "—"}
                    </p>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({
    active,
    activeLabel,
    inactiveLabel,
}) => {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
        >
            {active ? (
                <CheckCircle2 className="w-3 h-3" />
            ) : (
                <Clock3 className="w-3 h-3" />
            )}

            {active ? activeLabel : inactiveLabel}
        </span>
    );
};

const EmptySection = ({ icon: Icon, text }) => {
    return (
        <div className="sm:col-span-2 py-8 text-center">
            <Icon className="w-7 h-7 text-slate-300 mx-auto" />

            <p className="text-xs text-slate-400 mt-2">
                {text}
            </p>
        </div>
    );
};

export default Customers;