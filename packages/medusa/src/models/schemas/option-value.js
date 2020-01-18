import mongoose from "mongoose"

export default new mongoose.Schema({
  option_id: { type: mongoose.Types.ObjectId, required: true },
  value: { type: String, required: true },
})
