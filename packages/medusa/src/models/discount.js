import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"
import DiscountRule from "./schemas/discount-rule"

class DiscountModel extends BaseModel {
  static modelName = "Discount"

  static schema = {
    code: { type: String, required: true, unique: true },
    is_dynamic: { type: Boolean, default: false },
    is_giftcard: { type: Boolean, default: false },
    discount_rule: { type: DiscountRule, required: true },
    usage_count: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    starts_at: { type: Date },
    ends_at: { type: Date },
    regions: { type: [String], default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default DiscountModel
