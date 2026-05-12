# Team Task Division

## Person 1: Home Page
Files:
- `frontend/index.html`
- `frontend/js/home.js`
- `frontend/css/home.css`

Task:
Keep the hero, introduction, categories section, and featured products looking polished.

## Person 2: Shop Page
Files:
- `frontend/shop.html`
- `frontend/js/shop.js`
- `frontend/js/api.js`
- `frontend/css/products.css`

Task:
Handle product listing, frontend search, category filter, sorting, and product cards.

## Person 3: Product Details
Files:
- `frontend/product.html`
- `frontend/js/product.js`
- `frontend/js/render.js`
- `frontend/css/products.css`

Task:
Handle single product display and add-to-cart from product details.

## Person 4: Cart
Files:
- `frontend/cart.html`
- `frontend/js/cart.js`
- `frontend/js/cart-page.js`
- `frontend/css/cart-checkout.css`

Task:
Handle cart storage, quantity changes, remove buttons, and cart totals.

## Person 5: Checkout Frontend
Files:
- `frontend/checkout.html`
- `frontend/js/checkout.js`
- `frontend/payment-result.html`
- `frontend/js/payment-result.js`

Task:
Handle checkout form, order summary, redirect to Stripe, and payment result screen.

## Person 6: Shared Frontend Style
Files:
- `frontend/css/base.css`
- `frontend/css/header.css`
- `frontend/css/footer.css`
- `frontend/css/responsive.css`

Task:
Handle the main look, header, footer, font, spacing, buttons, and responsive behavior.

## Person 7: Authentication
Files:
- `frontend/login.html`
- `frontend/register.html`
- `frontend/js/login.js`
- `frontend/js/register.js`
- `frontend/js/auth.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/models/User.js`
- `backend/src/middleware/auth.middleware.js`

Task:
Handle login, register, JWT storage, logout, and protected backend routes.

## Person 8: Products and Orders Backend
Files:
- `backend/src/models/Product.js`
- `backend/src/models/Order.js`
- `backend/src/controllers/product.controller.js`
- `backend/src/controllers/order.controller.js`
- `backend/src/routes/product.routes.js`
- `backend/src/routes/order.routes.js`
- `backend/src/seed/seed.js`

Task:
Handle products, database seed data, order creation, totals, and shipping fee.

## Person 9: Stripe Payment Backend
Files:
- `backend/src/controllers/payment.controller.js`
- `backend/src/routes/payment.routes.js`
- `backend/.env`

Task:
Handle Stripe Checkout Session creation, session confirmation, and payment-related order updates.
