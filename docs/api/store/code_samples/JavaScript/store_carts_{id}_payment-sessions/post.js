import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.createPaymentSessions(cart_id)
.then(({ cart }) => {
  console.log(cart.id);
});
