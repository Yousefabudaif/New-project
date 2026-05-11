const express = require("express");
const {
  initiatePayment,
  paymobCallback
} = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/initiate", protect, initiatePayment);
router.post("/callback", paymobCallback);
router.get("/callback", paymobCallback);

module.exports = router;
