import mongoose from "mongoose"
import ShippingMethodSchema from "./shipping-method"

export default new mongoose.Schema({
  created: { type: String, default: Date.now },
  refund_amount: { type: Number, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], required: true },
  is_received: { type: Boolean, default: false },
  shipping_method: { type: ShippingMethodSchema, default: {} },
  documents: { type: [String], default: [] },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
