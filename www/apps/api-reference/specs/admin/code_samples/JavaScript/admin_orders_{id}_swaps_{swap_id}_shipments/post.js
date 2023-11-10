import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orders.createSwapShipment(orderId, swapId, {
  fulfillment_id
})
.then(({ order }) => {
  console.log(order.id);
})
