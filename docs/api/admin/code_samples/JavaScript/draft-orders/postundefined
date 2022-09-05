import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.draftOrders.create({
  email: 'user@example.com',
  region_id,
  items: [
    {
      quantity: 1
    }
  ],
  shipping_methods: [
    {
      option_id
    }
  ],
})
.then(({ draft_order }) => {
  console.log(draft_order.id);
});
