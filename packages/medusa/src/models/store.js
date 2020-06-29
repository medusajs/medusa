import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class StoreModel extends BaseModel {
  static modelName = "Store"
  static schema = {
    name: { type: String, required: true, default: "Medusa Store" },
    currencies: { type: [String], default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default StoreModel
