/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address_1: { type: String, required: true },
  address_2: { type: String },
  city: { type: String, required: true },
  country_code: { type: String, required: true },
  province: { type: String },
  postal_code: { type: String, required: true },
  phone: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
