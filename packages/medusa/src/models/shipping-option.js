import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import ShippingOptionPrice from "./schemas/shipping-option-price"
import ShippingOptionRequirement from "./schemas/shipping-option-requirement"

class ShippingOptionModel extends BaseModel {
  static modelName = "ShippingOption"
  static schema = {
    name: { type: String, required: true },
    region_id: { type: String, required: true },
    provider_id: { type: String, required: true },
    profile_id: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    price: { type: ShippingOptionPrice, required: true },
    requirements: { type: [ShippingOptionRequirement], default: [] },
    is_return: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default ShippingOptionModel
