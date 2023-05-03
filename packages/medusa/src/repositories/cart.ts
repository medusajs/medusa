import { ExtendedFindConfig } from "@medusajs/types"
import { dataSource } from "../loaders/database"
import { Cart } from "../models"

export const CartRepository = dataSource.getRepository(Cart).extend({
  async findOne(options: ExtendedFindConfig<Cart>) {
    const [cart] = await this.find(options)

    if (cart?.payment_sessions?.length) {
      cart.payment_session = cart.payment_sessions.find((p) => p.is_selected)!
    }

    return cart
  },
})
export default CartRepository
