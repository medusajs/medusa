import Medusa from "@medusajs/medusa-js"
import { AllocationType, DiscountRuleType } from "@medusajs/medusa"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.discounts.create({
  code: 'TEST',
  rule: {
    type: DiscountRuleType.FIXED,
    value: 10,
    allocation: AllocationType.ITEM
  },
  regions: ["reg_XXXXXXXX"],
  is_dynamic: false,
  is_disabled: false
})
.then(({ discount }) => {
  console.log(discount.id);
});
