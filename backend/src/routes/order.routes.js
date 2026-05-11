const express = require("express");
const { createOrder, myOrders, getOrder } = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, myOrders);
router.get("/:id", protect, getOrder);

module.exports = router;
