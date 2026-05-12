const express = require("express");
const cors = require("cors");
const path = require("path");
// Load environment variables from the root folder
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

// Configure CORS to allow your Heroku frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "simple-electronics-api" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments/stripe", paymentRoutes);

// 1. Serve the static frontend files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../../frontend')));

// 2. Catch-all route to serve index.html for any non-API requests
// Using '/*' is required for Express 5.x compatibility
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
