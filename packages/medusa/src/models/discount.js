/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class DiscountModel extends BaseModel {
  static modelName = "Discount"

  static schema = {
    code: { type: String, required: true, unique: true },
    discount_value: { type: Number, required: true },
    type: { String, required: true, required: true },
    valid_for: { type: [String] },
    usage_count: { type: Number, default: 0 },
    limit: { type: Number },
    starts_at: { type: Date },
    ends_at: { type: Date },
  }
}

export default DiscountModel
