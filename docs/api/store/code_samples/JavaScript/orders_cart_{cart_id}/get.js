import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.orders.retrieveByCartId(cart_id)
.then(({ order }) => {
  console.log(order.id);
});
