import { PaginatedResponse } from "../../common"
import { AdminCustomerGroup } from "./entities"

export interface AdminCustomerGroupResponse {
  /**
   * The customer group's details.
   */
  customer_group: AdminCustomerGroup
}

export type AdminCustomerGroupListResponse = PaginatedResponse<{
  /**
   * The list of customer groups.
   */
  customer_groups: AdminCustomerGroup[]
}>
