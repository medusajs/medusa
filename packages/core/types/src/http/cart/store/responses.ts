import { DeleteResponseWithParent } from "../../common"
import { StoreOrder } from "../../order"
import { StoreCart } from "./entities"

export interface StoreCartResponse {
  /**
   * The cart's details.
   */
  cart: StoreCart
}

export type StoreCompleteCartResponse =
  | {
    /**
     * The response's type. If `cart`, then an error has occurred.
     */
      type: "cart"
      /**
       * The cart's details.
       */
      cart: StoreCart
      /**
       * The error that occurred while completing the cart.
       */
      error: {
        /**
         * The error message.
         */
        message: string
        /**
         * The error name.
         */
        name: string
        /**
         * The error type.
         */
        type: string
      }
    }
  | {
    /**
     * The response's type. If `order`, then the cart
     * was completed and an order was placed.
     */
      type: "order"
      /**
       * The order's details.
       */
      order: StoreOrder
    }

export type StoreLineItemDeleteResponse = DeleteResponseWithParent<
  "line-item",
  StoreCart
>
