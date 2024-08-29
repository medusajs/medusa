import { PaginatedResponse } from "../../common"
import { AdminCustomerGroup } from "./entities"

export interface AdminCustomerGroupResponse {
  customer_group: AdminCustomerGroup
}

export type AdminCustomerGroupListResponse = PaginatedResponse<{
  customer_groups: AdminCustomerGroup[]
}>
