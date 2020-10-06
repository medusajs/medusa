import mongoose from "mongoose"

export default new mongoose.Schema({
  created: { type: String, default: Date.now },
  provider_id: { type: String, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], required: true },
  data: { type: [mongoose.Schema.Types.Mixed], default: {} },
  tracking_numbers: { type: [String], default: [] },
  shipped_at: { type: String },
  is_canceled: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
