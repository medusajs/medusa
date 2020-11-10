import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import LineItemSchema from "./schemas/line-item"
import ReturnSchema from "./schemas/return"
import FulfillmentSchema from "./schemas/fulfillment"

class SwapModel extends BaseModel {
  static modelName = "Swap"
  static schema = {
    status: { type: String, default: "pending" },
    fulfillment_status: { type: String, default: "not_fulfilled" },
    return: { type: ReturnSchema },
    fulfillments: { type: [FulfillmentSchema] },
    additional_items: { type: [LineItemSchema], required: true },
    cart_id: { type: String },
    created: { type: String, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default SwapModel
