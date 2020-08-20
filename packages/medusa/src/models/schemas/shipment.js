import mongoose from "mongoose"

export default new mongoose.Schema({
  item_ids: { type: [String], required: true },
  tracking_number: { type: String, default: "" },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
