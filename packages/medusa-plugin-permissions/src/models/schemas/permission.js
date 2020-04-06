import mongoose from "mongoose"

export default new mongoose.Schema({
  method: { type: String },
  endpoint: { type: String },
})
