/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

export default new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  is_giftcard: { type: Boolean, default: false },
  should_merge: { type: Boolean, default: true },
  has_shipping: { type: Boolean, default: false },

  // mongoose doesn't allow multi-type validation but this field allows both
  // an object containing:
  // {
  //   unit_price: (MoneyAmount),
  //   variant: (ProductVariantSchema),
  //   product: (ProductSchema)
  // }
  //
  // and and array containing:
  // [
  //   {
  //     unit_price: (MoneyAmount),
  //     quantity: (Number),
  //     variant: (ProductVariantSchema),
  //     product: (ProductSchema)
  //   }
  // ]
  // validation is done in the cart service.
  //
  // The unit_price field can be used to override the default pricing mechanism.
  // By default the price will be set based on the variant(s) in content,
  // however, to allow line items with variable pricing e.g. limited sales, gift
  // cards etc. the unit_price field is provided to give more granular control.
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true },
  returned: { type: Boolean, default: false },
  fulfilled: { type: Boolean, default: false },
  fulfilled_quantity: { type: Number, default: 0 },
  returned_quantity: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
