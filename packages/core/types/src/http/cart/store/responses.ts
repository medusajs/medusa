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
      type: "cart"
      cart: StoreCart
      error: {
        message: string
        name: string
        type: string
      }
    }
  | {
      type: "order"
      order: StoreOrder
    }

export type StoreLineItemDeleteResponse = DeleteResponseWithParent<
  "line-item",
  StoreCart
>
