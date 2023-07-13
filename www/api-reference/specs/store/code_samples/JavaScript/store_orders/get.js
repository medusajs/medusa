import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.orders.lookupOrder({
  display_id: 1,
  email: 'user@example.com'
})
.then(({ order }) => {
  console.log(order.id);
});
