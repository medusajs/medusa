import mongoose from "mongoose"

export default new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: Number, required: true },
})
