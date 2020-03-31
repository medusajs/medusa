import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class ShippingProfileModel extends BaseModel {
  static modelName = "ShippingProfile"
  static schema = {
    name: { type: String, required: true },
    products: { type: [String], default: [] },
    shipping_options: { type: [String], default: [] },
  }
}

export default ShippingProfileModel
