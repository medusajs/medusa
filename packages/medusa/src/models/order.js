/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import LineItemSchema from "./schemas/line-item"
import PaymentMethodSchema from "./schemas/payment-method"
import ShippingMethodSchema from "./schemas/shipping-method"
import AddressSchema from "./schemas/address"

class OrderModel extends BaseModel {
  static modelName = "Order"

  static schema = {
    canceled: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    email: { type: String, required: true },
    billing_address: { type: AddressSchema, required: true },
    shipping_address: { type: AddressSchema, required: true },
    items: { type: [LineItemSchema], required: true },
    region: { type: String, required: true },
    discounts: { type: [String], default: [] },
    customer_id: { type: String, required: true },
    payment_method: { type: PaymentMethodSchema, required: true },
    shipping_methods: { type: [ShippingMethodSchema], required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default OrderModel
