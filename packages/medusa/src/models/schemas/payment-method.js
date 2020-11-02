/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  provider_id: { type: String },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
})
