import mongoose from "mongoose"

export default new mongoose.Schema({
  created: { type: String, default: Date.now },
  note: { type: String, default: "" },
  reason: { type: String, default: "" },
  amount: { type: Number, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
