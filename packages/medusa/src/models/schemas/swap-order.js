import mongoose from "mongoose"

import LineItemSchema from "./line-item"
import PaymentMethodSchema from "./payment-method"
import ShippingMethodSchema from "./shipping-method"

export default new mongoose.Schema({
  status: { type: String, default: "pending" },
  fulfillment_status: { type: String, default: "not_fulfilled" },
  return_lines: { type: [LineItemSchema], required: true },
  additional_lines: { type: [LineItemSchema], required: true },
  payment_method: { type: PaymentMethodSchema },
  shipping_methods: { type: [ShippingMethodSchema] },
  created: { type: String, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
