import { AdminOrder, AdminOrderShippingMethod } from "../../order"
import { AdminReturn } from "../../return"
import { BaseClaim } from "../common"

export interface AdminClaim extends BaseClaim {
  /**
   * The order this claim is created for.
   */
  order: AdminOrder
  /**
   * The associated return.
   */
  return: AdminReturn
  /**
   * The shipping methods of the claim's additional items.
   */
  shipping_methods?: AdminOrderShippingMethod[]
}
