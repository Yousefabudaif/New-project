const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/Order");

const PAYMOB_BASE_URL = "https://accept.paymob.com";

function requiredPaymobEnv() {
  const required = ["PAYMOB_SECRET_KEY", "PAYMOB_PUBLIC_KEY", "PAYMOB_CARD_INTEGRATION_ID"];
  return required.filter(key => !process.env[key]);
}

function backendBaseUrl(req) {
  const publicBaseUrl = process.env.BACKEND_PUBLIC_URL;
  if (publicBaseUrl) return publicBaseUrl.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

function frontendResultUrl(orderId) {
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${frontend}/payment-result.html?orderId=${orderId}`;
}

function unifiedCheckoutUrl(clientSecret) {
  const publicKey = encodeURIComponent(process.env.PAYMOB_PUBLIC_KEY);
  const secret = encodeURIComponent(clientSecret);
  return `${PAYMOB_BASE_URL}/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${secret}`;
}

async function initiatePayment(req, res, next) {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Payment can only start for pending orders." });
    }

    const missing = requiredPaymobEnv();
    if (missing.length) {
      return res.status(400).json({
        message: `Missing Paymob card payment settings: ${missing.join(", ")}`
      });
    }

    const names = (order.shipping.fullName || req.user.name || "Shop Customer").split(" ");
    const firstName = names[0] || "Shop";
    const lastName = names.slice(1).join(" ") || "Customer";
    const paymobItems = order.items.map(item => ({
      name: item.name,
      amount: Math.round(item.price * 100),
      quantity: item.quantity,
      description: item.name
    }));

    if (order.shippingFee > 0) {
      paymobItems.push({
        name: "Shipping",
        amount: Math.round(order.shippingFee * 100),
        quantity: 1,
        description: "Delivery fee"
      });
    }

    const intentionResponse = await axios.post(
      `${PAYMOB_BASE_URL}/v1/intention/`,
      {
        amount: Math.round(order.total * 100),
        currency: process.env.CURRENCY || "EGP",
        payment_methods: [Number(process.env.PAYMOB_CARD_INTEGRATION_ID)],
        items: paymobItems,
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          email: req.user.email,
          phone_number: order.shipping.phone || "01000000000",
          apartment: "NA",
          floor: "NA",
          street: order.shipping.address || "NA",
          building: "NA",
          city: order.shipping.city || "Cairo",
          state: order.shipping.city || "Cairo",
          country: "EG"
        },
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: req.user.email
        },
        extras: {
          local_order_id: String(order._id)
        },
        special_reference: String(order._id),
        notification_url: `${backendBaseUrl(req)}/api/payments/paymob/callback`,
        redirection_url: frontendResultUrl(order._id)
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const clientSecret = intentionResponse.data.client_secret;
    const intentionId = intentionResponse.data.id || intentionResponse.data.intention_id;
    const paymentUrl = unifiedCheckoutUrl(clientSecret);

    order.payment.mode = "sandbox";
    order.payment.paymobIntentionId = intentionId ? String(intentionId) : "";
    order.payment.clientSecret = clientSecret;
    order.payment.paymentUrl = paymentUrl;
    await order.save();

    res.json({
      mode: "sandbox",
      method: "card",
      paymentUrl
    });
  } catch (error) {
    next(error);
  }
}

function legacyCallbackValues(payload) {
  const keys = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "order",
    "owner",
    "pending",
    "source_data.pan",
    "source_data.sub_type",
    "source_data.type",
    "success"
  ];

  const getValue = key => key.split(".").reduce((value, part) => value?.[part], payload) ?? "";
  return keys.map(getValue).join("");
}

function verifyPaymobHmac(payload) {
  if (!process.env.PAYMOB_HMAC_SECRET || !payload.hmac) return true;

  const raw = legacyCallbackValues(payload.obj || payload);
  const hmac = crypto.createHmac("sha512", process.env.PAYMOB_HMAC_SECRET).update(raw).digest("hex");

  return hmac === payload.hmac;
}

function callbackOrderReference(payload) {
  const obj = payload.obj || payload;
  return (
    obj.special_reference ||
    obj.merchant_order_id ||
    obj.order?.merchant_order_id ||
    obj.order?.special_reference ||
    obj.payment_key_claims?.extra?.local_order_id ||
    obj.extras?.local_order_id ||
    payload.orderId ||
    ""
  );
}

async function paymobCallback(req, res, next) {
  try {
    const payload = { ...req.query, ...req.body };

    if (!verifyPaymobHmac(payload)) {
      return res.status(400).json({ message: "Invalid Paymob callback signature." });
    }

    const obj = payload.obj || payload;
    const orderReference = String(callbackOrderReference(payload));
    const transactionId = String(obj.id || payload.id || "");
    const success = String(obj.success ?? payload.success) === "true" || obj.success === true;
    const pending = String(obj.pending ?? payload.pending) === "true" || obj.pending === true;

    const order = await Order.findById(orderReference);

    if (!order) {
      return res.status(404).json({ message: "Related order not found." });
    }

    order.status = success ? "paid" : pending ? "pending" : "failed";
    order.payment.transactionId = transactionId;
    order.payment.rawCallback = payload;
    await order.save();

    res.json({ message: "Payment callback saved.", orderStatus: order.status });
  } catch (error) {
    next(error);
  }
}

module.exports = { initiatePayment, paymobCallback };
