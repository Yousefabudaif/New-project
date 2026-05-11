# Simplified Electronics Ecommerce

A clean classroom-friendly ecommerce project inspired by the visual style of the Singitronic electronics shop, rebuilt from scratch with a simple structure.

## Stack

- `frontend/`: plain HTML, CSS, and JavaScript
- `backend/`: Node.js, Express, MongoDB, Mongoose, JWT
- Payments: Paymob Egypt sandbox card payment flow

## Run Locally

```bash
npm install
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

The local env files are already created. For a fresh copy:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

On Windows PowerShell, copy them manually or use:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item backend/.env.example backend/.env
```

## Team Ownership

- Person 1: `frontend/src/components`, layout, header, footer, theme
- Person 2: `frontend/src/app/page.jsx`, home page
- Person 3: `frontend/src/app/shop/page.jsx`, shop/search/filter page
- Person 4: `frontend/src/app/product/[id]/page.jsx`, product details page
- Person 5: `frontend/src/app/cart/page.jsx`, cart page
- Person 6: `frontend/src/app/checkout/page.jsx`, checkout and payment UI
- Person 7: `backend/src/controllers/auth.controller.js`, auth/JWT/users
- Person 8: products, categories, and orders backend files
- Person 9: `backend/src/controllers/payment.controller.js`, Paymob integration

## Demo Accounts

Seed creates:

- Email: `user1@student.com`
- Password: `123456`

## Simplified API

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
GET    /api/products/:id
GET    /api/categories
POST   /api/orders
GET    /api/orders/my-orders
POST   /api/payments/paymob/initiate
POST   /api/payments/paymob/callback
```

## Paymob Sandbox

The backend is set to sandbox/card-only. Add `PAYMOB_CARD_INTEGRATION_ID` in `backend/.env` from the Paymob dashboard before testing a real card redirect.
