import { AdminCustomer } from "../../customer/admin"
import { BaseCustomerGroup } from "../common"

export interface AdminCustomerGroup extends BaseCustomerGroup {
  customers: AdminCustomer[]
}
