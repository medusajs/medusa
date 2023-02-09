import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.discounts.createDynamicCode(discount_id, {
  code: 'TEST',
  usage_limit: 1
})
.then(({ discount }) => {
  console.log(discount.id);
});
