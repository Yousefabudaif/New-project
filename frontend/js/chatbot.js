(function () {
  function productHtml(product) {
    if (!product) return "";
    return `
      <div class="chat-product">
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>${window.shopApi.money(product.price)}</p>
        <button data-chat-add="${product._id}">Add to cart</button>
      </div>
    `;
  }

  function addMessage(container, text, type, product) {
    const message = document.createElement("div");
    message.className = `chat-msg ${type}`;
    message.innerHTML = `<div>${text}</div>${productHtml(product)}`;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;

    const addButton = message.querySelector("[data-chat-add]");
    if (addButton && product) {
      addButton.addEventListener("click", () => {
        window.cart.addToCart(product);
        addButton.textContent = "Added";
      });
    }
  }

  function mountChatbot() {
    if (document.querySelector(".chatbot-toggle")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <button class="chatbot-toggle" aria-label="Open TechBot">💬</button>
      <section class="chatbot-panel" aria-label="TechBot chat">
        <div class="chatbot-head">
          <strong>TechBot</strong>
          <span>Ask for help or product suggestions</span>
        </div>
        <div class="chatbot-messages">
          <div class="chat-msg bot">Hi, I am TechBot. Tell me what you want to buy or what problem you have.</div>
        </div>
        <form class="chatbot-form">
          <input name="message" placeholder="Type a message..." autocomplete="off">
          <button>Send</button>
        </form>
      </section>
    `);

    const toggle = document.querySelector(".chatbot-toggle");
    const panel = document.querySelector(".chatbot-panel");
    const messages = document.querySelector(".chatbot-messages");
    const form = document.querySelector(".chatbot-form");

    toggle.addEventListener("click", () => panel.classList.toggle("open"));

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const input = form.message;
      const text = input.value.trim();
      if (!text) return;

      addMessage(messages, text, "user");
      input.value = "";

      try {
        const response = await window.shopApi.request("/chat", {
          method: "POST",
          body: JSON.stringify({ message: text })
        });
        addMessage(messages, response.reply, "bot", response.product);
      } catch {
        addMessage(messages, "Sorry for the inconvenience. Please try refreshing the page, and contact support@gmail.com for more assistance.", "bot");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", mountChatbot);
})();
