require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5000;

const authRoutes = require("./src/routes/auth.route");
const profileRoutes = require("./src/routes/profile.route");
const kycRoutes = require("./src/routes/kyc.route");
const eligibilityRoutes = require("./src/routes/eligibility.routes");
const customerLoanRoutes = require("./src/routes/loan.route");
const customerOfferRoutes = require("./src/routes/loanOffer.route");

const adminAuthRoutes = require("./src/routes/admin/adminAuth.route");
const adminLoanRoutes = require("./src/routes/admin/loan.route");
const adminPartnerRoutes = require("./src/routes/admin/partner.route");
const adminOfferRoutes = require("./src/routes/admin/loanOffer.route");
const adminCustomerRoutes = require("./src/routes/admin/customer.route");
const adminDashboardRoutes = require("./src/routes/admin/dashboard.route");



app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/loans", customerLoanRoutes);
app.use("/api/offers", customerOfferRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/loans", adminLoanRoutes);
app.use("/api/admin/partners", adminPartnerRoutes);
app.use("/api/admin/offers", adminOfferRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch(console.error);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finpilot API Running",
  });
});

module.exports = app;

// Global error handler — catches errors thrown from async middleware (multer, etc.)
app.use((err, req, res, next) => {
  console.error("[GLOBAL ERROR HANDLER]", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});
