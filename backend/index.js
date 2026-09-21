require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://admin-six-ochre-30.vercel.app",
  process.env.ADMIN_URL,
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      // Allow if explicitly listed or matches any *.vercel.app domain
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      
      // Allow all in development or fallback
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

// Health check endpoint for uptime monitoring & Render keep-alive
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finpilot API Running",
  });
});

// Self-ping service to prevent Render free tier from sleeping (inactivity timeout is 15 minutes)
const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
if (keepAliveUrl) {
  const PING_INTERVAL_MS = (parseInt(process.env.PING_INTERVAL_MINUTES, 10) || 14) * 60 * 1000;
  setInterval(() => {
    const healthUrl = `${keepAliveUrl.replace(/\/$/, "")}/api/health`;
    const client = healthUrl.startsWith("https") ? require("https") : require("http");
    
    client.get(healthUrl, (res) => {
      console.log(`[Keep-Alive] Pinged ${healthUrl} - Status: ${res.statusCode}`);
    }).on("error", (err) => {
      console.error("[Keep-Alive] Error pinging health URL:", err.message);
    });
  }, PING_INTERVAL_MS);
  
  console.log(`[Keep-Alive] Configured to ping ${keepAliveUrl} every ${PING_INTERVAL_MS / 60000} mins`);
}

module.exports = app;

// Global error handler — catches errors thrown from async middleware (multer, etc.)
app.use((err, req, res, next) => {
  console.error("[GLOBAL ERROR HANDLER]", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});
