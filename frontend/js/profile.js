document.addEventListener("DOMContentLoaded", async () => {
  const user = window.auth.currentUser();
  const container = document.getElementById("ordersList");
  if (!user) {
    container.innerHTML = `<div class="panel" style="text-align:center;"><h2>Please login to view your orders.</h2><a class="primary-btn" href="login.html">Login</a></div>`;
    return;
  }

  try {
    const orders = await window.shopApi.request("/orders/my-orders");
    if (!orders.length) {
      container.innerHTML = `<div class="panel" style="text-align:center;"><h2>No orders yet</h2><a class="primary-btn" href="shop.html">Shop Now</a></div>`;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="panel" style="margin-bottom:18px;">
        <h2>Order #${order._id.slice(-6).toUpperCase()}</h2>
        <p>Status: <strong>${order.status}</strong></p>
        ${order.items.map(item => `<div class="summary-line"><span>${item.quantity} x ${item.name}</span><span>${window.shopApi.money(item.price * item.quantity)}</span></div>`).join("")}
        <div class="summary-line summary-total"><span>Total</span><span>${window.shopApi.money(order.total)}</span></div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = `<div class="panel"><p class="message">${error.message}</p></div>`;
  }
});
