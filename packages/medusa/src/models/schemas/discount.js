import mongoose from "mongoose"

import DiscountRule from "./discount-rule"

export default new mongoose.Schema({
  is_giftcard: { type: Boolean },
  code: { type: String },
  discount_rule: { type: DiscountRule },
  usage_count: { type: Number },
  disabled: { type: Boolean },
  starts_at: { type: Date },
  ends_at: { type: Date },
  regions: { type: [String], default: [] },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
