import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.discounts.getCondition(discount_id, condition_id)
.then(({ discount_condition }) => {
  console.log(discount_condition.id);
});
