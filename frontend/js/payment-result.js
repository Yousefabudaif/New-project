const params = new URLSearchParams(location.search);
const success = params.get("success");
const pending = params.get("pending");
const text = document.getElementById("paymentResultText");

if (success === "true") {
  text.textContent = "Your card payment was completed successfully.";
  localStorage.removeItem("cart");
  sessionStorage.removeItem("lastCheckoutCart");
} else if (pending === "true") {
  text.textContent = "Your payment is still pending. Please start a new checkout if you want to try again.";
} else if (success === "false") {
  text.textContent = "Payment was not completed. Please start a new checkout to try another payment attempt.";
}

const savedCart = sessionStorage.getItem("lastCheckoutCart");
if (success !== "true" && savedCart) {
  localStorage.setItem("cart", savedCart);
}
