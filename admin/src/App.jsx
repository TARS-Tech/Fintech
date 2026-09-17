import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Loans from './pages/loan/Loans';
import Partners from './pages/partner/Partners';
import LoanOffers from './pages/offer/LoanOffers';
import Customers from './pages/customer/Customers';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Admin Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/admin/loans"
              element={<Loans />}
            />
            <Route
              path="/admin/partners"
              element={<Partners />}
            />
            <Route
              path="/admin/offers"
              element={<LoanOffers />}
            />
            <Route
              path="/admin/applications"
              element={
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">Loan Applications</h2>
                  <p className="text-sm text-slate-500 mt-1">Review user loan requests and underwriting decisions.</p>
                </div>
              }
            />
            <Route
              path="/admin/customers"
              element={<Customers />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


