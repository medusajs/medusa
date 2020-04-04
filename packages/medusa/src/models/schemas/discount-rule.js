import mongoose from "mongoose"

export default new mongoose.Schema({
  description: { type: String },
  // Fixed, percentage or free shipping is allowed as type.
  // The fixed discount type can be used as normal coupon code, giftcards,
  // store credits and possibly more.
  // The percentage discount type can be used as normal coupon code, giftcards
  // and possibly more.
  // The free shipping discount type is used only to give free shipping.
  type: { type: String, required: true }, // Fixed, percent, free shipping
  // The value is simply the amount of discount a customer or user will have.
  // This depends on the type above, since percentage can not be above 100.
  value: { type: Number, required: true },
  // This is either total, meaning that the discount will be applied to the
  // total price of the cart
  // or item, meaning that the discount can be applied to the product variants
  // in the valid_for array. Lastly the allocation is completely ignored if
  // discount type is free shipping.
  allocation: { type: String, required: true },
  // Id's of product variants. Depends on allocation.
  // If total is set, then the valid_for will not be used for anything,
  // since the discount will work for the cart total. Else if item allocation
  // is chosen, then we will go through the cart and apply the coupon code to
  // all the valid product variants.
  valid_for: { type: [String], default: [] },
  usage_limit: { type: Number },
})
