import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import LineItemSchema from "./schemas/line-item"
import ReturnSchema from "./schemas/return"
import FulfillmentSchema from "./schemas/fulfillment"
import PaymentMethodSchema from "./schemas/payment-method"
import ShippingMethodSchema from "./schemas/shipping-method"
import AddressSchema from "./schemas/address"

class SwapModel extends BaseModel {
  static modelName = "Swap"
  static schema = {
    fulfillment_status: { type: String, default: "not_fulfilled" },
    payment_status: { type: String, default: "awaiting" },
    is_paid: { type: Boolean, default: false },
    return: { type: ReturnSchema },
    return_items: { type: [mongoose.Schema.Types.Mixed], required: true },
    return_shipping: { type: mongoose.Schema.Types.Mixed },
    fulfillments: { type: [FulfillmentSchema] },
    additional_items: { type: [LineItemSchema], required: true },
    payment_method: { type: PaymentMethodSchema },
    shipping_methods: { type: [ShippingMethodSchema] },
    shipping_address: { type: AddressSchema },
    amount_paid: { type: Number },
    region_id: { type: String },
    currency_code: { type: String },
    order_id: { type: String },
    cart_id: { type: String },
    created: { type: String, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default SwapModel
