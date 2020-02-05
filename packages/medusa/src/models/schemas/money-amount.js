/*******************************************************************************
 * models/money-amount.js
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  region_id: { type: String },
  currency_code: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
})
