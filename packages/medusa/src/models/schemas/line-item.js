/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },

  // mongoose doesn't allow multi-type validation but this field allows both
  // an object containing:
  // {
  //   variant: (ProductVariantSchema),
  //   product: (ProductSchema)
  // }
  //
  // and and array containing:
  // [
  //   {
  //     variant: (ProductVariantSchema),
  //     product: (ProductSchema)
  //   }
  // ]
  // validation is done in the cart service.
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
