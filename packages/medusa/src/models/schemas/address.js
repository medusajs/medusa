/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  country_code: { type: String, required: true },
  province: { type: String },
  postal_code: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
