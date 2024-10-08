import { AdminOrder, AdminOrderShippingMethod } from "../../order"
import { AdminReturn } from "../../return"
import { BaseClaim } from "../common"

export interface AdminClaim extends BaseClaim {
  order: AdminOrder
  return: AdminReturn
  shipping_methods?: AdminOrderShippingMethod[]
}
