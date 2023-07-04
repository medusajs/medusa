import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orders.createSwap(order_id, {
  return_items: [
    {
      item_id,
      quantity: 1
    }
  ]
})
.then(({ order }) => {
  console.log(order.id);
});
