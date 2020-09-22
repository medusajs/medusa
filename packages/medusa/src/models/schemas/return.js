import mongoose from "mongoose"

export default new mongoose.Schema({
  created: { type: String, default: Date.now },
  status: { type: String, default: "requested" },
  refund_amount: { type: Number, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
