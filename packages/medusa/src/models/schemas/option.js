/*******************************************************************************
 * models/option.js
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  product_id: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String, required: true },
  values: { type: [String], default: [] },
})
