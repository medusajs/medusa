import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orders.refundPayment(order_id, {
  amount: 1000,
  reason: 'Do not like it'
})
.then(({ order }) => {
  console.log(order.id);
});
