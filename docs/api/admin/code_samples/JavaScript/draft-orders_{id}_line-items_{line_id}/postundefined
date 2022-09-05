import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.draftOrders.updateLineItem(draft_order_id, line_id, {
  quantity: 1
})
.then(({ draft_order }) => {
  console.log(draft_order.id);
});
