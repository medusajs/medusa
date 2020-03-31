import mongoose from "mongoose"

export default new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
})
