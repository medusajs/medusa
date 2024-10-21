import { AdminCustomer } from "../../customer/admin"
import { BaseCustomerGroup } from "../common"

export interface AdminCustomerGroup extends BaseCustomerGroup {
  /**
   * The customers in the group.
   */
  customers: AdminCustomer[]
}
