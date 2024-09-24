import { AdminOrder } from "../../order"
import { BaseClaim } from "../common"

export interface AdminClaim extends BaseClaim {
  order: AdminOrder
}
