import mongoose from "mongoose"

export default new mongoose.Schema({
  method: { type: String },
  route: { type: String },
})
