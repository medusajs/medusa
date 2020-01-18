/*******************************************************************************
 * models/cart-item.js
 *
 ******************************************************************************/
import { BaseModel } from "../interfaces"

class CartItemModel extends BaseModel {
  static modelName = "CartItem"
  static schema = {
    type: {
      type: String,
      enum: ["product", "bundle"],
      default: "product",
      required: true,
    },
    quantity: { type: Number, min: 0, required: true },
  }
}

export default CartItemModel
