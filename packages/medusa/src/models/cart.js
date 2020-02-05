/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import LineItemSchema from "./schemas/line-item"
import PaymentMethodSchema from "./schemas/payment-method"
import ShippingMethodSchema from "./schemas/shipping-method"
import AddressSchema from "./schemas/address"

class CartModel extends BaseModel {
  static modelName = "Cart"

  static schema = {
    email: { type: String },
    billing_address: { type: AddressSchema },
    shipping_address: { type: AddressSchema },
    items: { type: [LineItemSchema], default: [] },
    region_id: { type: String },
    discounts: { type: [String], default: [] },
    customer_id: { type: String },
    payment_method: { type: PaymentMethodSchema },
    shipping_methods: { type: [ShippingMethodSchema] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default CartModel
