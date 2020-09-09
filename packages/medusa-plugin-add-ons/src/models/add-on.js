import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class AddOnModel extends BaseModel {
  static modelName = "AddOn"
  static schema = {
    name: { type: String, required: true },
    prices: { type: [], required: true },
    // Valid products
    valid_for: { type: [String], required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default AddOnModel
