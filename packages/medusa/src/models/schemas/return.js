import mongoose from "mongoose"

export default new mongoose.Schema({
  created: { type: String, default: Date.now },
  refund_amount: { type: Number, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
