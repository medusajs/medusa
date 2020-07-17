import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import LineItemSchema from "./schemas/line-item"
import PaymentMethodSchema from "./schemas/payment-method"
import ShippingMethodSchema from "./schemas/shipping-method"
import AddressSchema from "./schemas/address"
import DiscountSchema from "./schemas/discount"

class OrderModel extends BaseModel {
  static modelName = "Order"

  static schema = {
    // pending, completed, archived, cancelled
    status: { type: String, default: "pending" },
    // not_fulfilled, partially_fulfilled (some line items have been returned), fulfilled, returned,
    fulfillment_status: { type: String, default: "not_fulfilled" },
    // awaiting, captured, refunded
    payment_status: { type: String, default: "awaiting" },
    email: { type: String, required: true },
    cart_id: { type: String, unique: true, sparse: true },
    billing_address: { type: AddressSchema, required: true },
    shipping_address: { type: AddressSchema, required: true },
    items: { type: [LineItemSchema], required: true },
    currency_code: { type: String, required: true },
    region_id: { type: String, required: true },
    discounts: { type: [DiscountSchema], default: [] },
    customer_id: { type: String },
    payment_method: { type: PaymentMethodSchema, required: true },
    shipping_methods: { type: [ShippingMethodSchema], required: true },
    created: { type: String, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default OrderModel
