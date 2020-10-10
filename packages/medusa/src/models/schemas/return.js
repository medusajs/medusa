import mongoose from "mongoose"
import ReturnLineItemSchema from "./return-line-item"
import ShippingMethodSchema from "./shipping-method"

export default new mongoose.Schema({
  status: { type: String, default: "requested" },
  refund_amount: { type: Number, required: true },
  items: { type: [ReturnLineItemSchema], required: true },
  shipping_method: { type: ShippingMethodSchema, default: {} },
  shipping_data: { type: mongoose.Schema.Types.Mixed, default: {} },
  documents: { type: [String], default: [] },
  received_at: { type: String },
  created: { type: String, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
