# Backend Guide

This backend is intentionally small so each part can be discussed clearly.

## Main Folders

- `models/`: MongoDB collections through Mongoose
- `controllers/`: route logic
- `routes/`: public API paths
- `middleware/`: JWT protection and error handling
- `seed/`: demo data

## Stripe

Stripe Checkout is configured in test mode.

Required values in `.env`:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`

The backend creates Checkout Sessions and the payment result page confirms the session before marking an order as paid.
