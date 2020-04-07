import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class RegionModel extends BaseModel {
  static modelName = "Region"
  static schema = {
    name: { type: String, required: true },
    countries: { type: [String], required: true },
    currency_code: { type: String, required: true },
    tax_rate: { type: Number, required: true, default: 0 },
    payment_providers: { type: [String], default: [] },
    fulfillment_providers: { type: [String], default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default RegionModel
