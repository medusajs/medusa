import { BaseModel } from "medusa-interfaces"
import DiscountRule from "./schemas/discount-rule"

class DiscountModel extends BaseModel {
  static modelName = "Discount"

  static schema = {
    code: { type: String, required: true, unique: true },
    discount_rule: { type: DiscountRule, required: true },
    usage_count: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    starts_at: { type: Date },
    ends_at: { type: Date },
  }
}

export default DiscountModel
