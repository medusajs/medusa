/*******************************************************************************
 * models/option.js
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  title: { type: String, required: true },
  values: { type: [String], default: [] },
})
