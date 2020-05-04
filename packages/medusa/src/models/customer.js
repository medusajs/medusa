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
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    billing_address: { type: AddressSchema },
    has_account: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default CustomerModel
