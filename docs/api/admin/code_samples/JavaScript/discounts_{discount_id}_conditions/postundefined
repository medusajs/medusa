import Medusa from "@medusajs/medusa-js"
import { DiscountConditionOperator } from "@medusajs/medusa"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.discounts.createCondition(discount_id, {
  operator: DiscountConditionOperator.IN
})
.then(({ discount }) => {
  console.log(discount.id);
});
