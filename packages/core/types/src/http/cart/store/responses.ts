import { DeleteResponseWithParent } from "../../common"
import { StoreOrder } from "../../order"
import { StoreCart } from "./entities"

export interface StoreCartResponse {
  /**
   * The cart's details.
   */
  cart: StoreCart
  skipped_promo_codes?: {
    /**
     * The promotion code that was not applied.
     */
    code: string
    /**
     * The reason the promotion code was skipped.
     * - `promotion_limit_exceeded`: the promotion's usage limit has been reached.
     * - `campaign_budget_exceeded`: the promotion's campaign budget has been exhausted.
     */
    reason: "promotion_limit_exceeded" | "campaign_budget_exceeded"
  }[]
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
