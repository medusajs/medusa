import mongoose from "mongoose"

export default new mongoose.Schema({
  file: { type: String, required: true },
  name: { type: String, required: true },
  created: { type: String, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
