# Backend Guide

This backend is intentionally small so each part can be discussed clearly.

## Main Folders

- `models/`: MongoDB collections through Mongoose
- `controllers/`: route logic
- `routes/`: public API paths
- `middleware/`: JWT protection and error handling
- `seed/`: demo data

## Paymob

Paymob is configured for sandbox card payments only.

Required values in `.env`:

- `PAYMOB_SECRET_KEY`
- `PAYMOB_PUBLIC_KEY`
- `PAYMOB_CARD_INTEGRATION_ID`
- `PAYMOB_HMAC_SECRET`

The card integration ID comes from the Paymob dashboard. Without it, checkout returns a clear missing-settings message.
