/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  provider_id: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
})
