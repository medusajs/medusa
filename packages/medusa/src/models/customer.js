/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import AddressSchema from "./schemas/address"

class CustomerModel extends BaseModel {
  static modelName = "Customer"

  static schema = {
    email: { type: String, required: true, unique: true },
    first_name: { type: String },
    last_name: { type: String },
    billing_address: { type: AddressSchema },
    payment_methods: { type: [mongoose.Schema.Types.Mixed], default: [] },
    shipping_addresses: { type: [AddressSchema], default: [] },
    password_hash: { type: String },
    phone: { type: String, default: "" },
    has_account: { type: Boolean, default: false },
    orders: { type: [String], default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default CustomerModel
