import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.orders.retrieve(orderId)
.then(({ order }) => {
  console.log(order.id);
})
