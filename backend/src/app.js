const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "simple-electronics-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments/stripe", paymentRoutes);
// Serve the static frontend files
app.use(express.static(path.join(__dirname, '../../frontend')));

// Catch-all route to serve index.html for any other requests (useful if you add client-side routing later)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;
