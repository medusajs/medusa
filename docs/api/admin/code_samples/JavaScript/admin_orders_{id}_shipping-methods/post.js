import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orders.addShippingMethod(order_id, {
  price: 1000,
  option_id
})
.then(({ order }) => {
  console.log(order.id);
});
