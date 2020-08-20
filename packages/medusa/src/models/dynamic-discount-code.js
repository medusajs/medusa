import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class DynamicDiscountCode extends BaseModel {
  static modelName = "DynamicDiscountCode"

  static schema = {
    code: { type: String, required: true, unique: true },
    discount_id: { type: String, required: true },
    usage_count: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default DynamicDiscountCode
