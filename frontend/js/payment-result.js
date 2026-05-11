const params = new URLSearchParams(location.search);
const success = params.get("success");
const pending = params.get("pending");
const text = document.getElementById("paymentResultText");

if (success === "true") {
  text.textContent = "Your card payment was completed successfully.";
} else if (pending === "true") {
  text.textContent = "Your payment is still pending.";
} else if (success === "false") {
  text.textContent = "Payment was not completed.";
}
