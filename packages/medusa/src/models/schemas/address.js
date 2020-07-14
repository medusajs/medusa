/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  address_1: { type: String },
  address_2: { type: String },
  city: { type: String },
  country_code: { type: String },
  province: { type: String },
  postal_code: { type: String },
  phone: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
