/*******************************************************************************
 * models/product-variant.js
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "../interfaces"

import LineItemSchema from "./schemas/line-item"
import AddressSchema from "./schemas/address"

class CartModel extends BaseModel {
  static modelName = "Cart"

  static schema = {
    email: { type: String },
    billingAddress: { type: AddressSchema },
    shippingAddress: { type: AddressSchema },
    items: { type: [LinetItemSchema], default: [] },
    region: { type: String, required: true },
    discounts: { type: [String], default: true },
    customer_id: { type: String },
  }
}

export default CartModel
