import mongoose from "mongoose"

import LineItemSchema from "./line-item"
import PaymentMethodSchema from "./payment-method"
import ShippingMethodSchema from "./shipping-method"
import AddressSchema from "./address"

export default new mongoose.Schema({
  status: { type: String, default: "pending" },
  return_status: { type: String, default: "requested" },
  fulfillment_status: { type: String, default: "not_fulfilled" },
  return_items: { type: [LineItemSchema], required: true },
  additional_items: { type: [LineItemSchema], required: true },
  shipping_address: { type: AddressSchema },
  payment_sessions: { type: [PaymentMethodSchema], default: [] },
  payment_method: { type: PaymentMethodSchema },
  shipping_methods: { type: [ShippingMethodSchema] },
  return_shipping_method: { type: ShippingMethodSchema },
  created: { type: String, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
