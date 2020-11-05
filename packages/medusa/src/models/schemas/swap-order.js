import mongoose from "mongoose"

import LineItemSchema from "./line-item"
import PaymentMethodSchema from "./payment-method"
import ShippingMethodSchema from "./shipping-method"
import AddressSchema from "./address"
import ReturnSchema from "./return"
import FulfillmentSchema from "./fulfillment"

export default new mongoose.Schema({
  status: { type: String, default: "pending" },
  fulfillment_status: { type: String, default: "not_fulfilled" },
  return: { type: ReturnSchema },
  fulfillment: { type: FulfillmentSchema },
  additional_items: { type: [LineItemSchema], required: true },
  cart_id: { type: String },
  created: { type: String, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
