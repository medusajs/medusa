import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.draftOrders.list()
.then(({ draft_orders, limit, offset, count }) => {
  console.log(draft_orders.length);
});
