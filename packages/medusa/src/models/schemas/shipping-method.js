import mongoose from "mongoose"

export default new mongoose.Schema({
  provider_id: { type: String, required: true },
  profile_id: { type: String, required: true },
  price: { type: Number, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  items: { type: [mongoose.Schema.Types.Mixed], default: [] },
})
