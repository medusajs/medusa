import { BaseCustomer } from "../customer/common"

export interface BaseCustomerGroup {
  /**
   * The customer group's ID.
   */
  id: string
  /**
   * The customer group's name.
   */
  name: string | null
  /**
   * The customers in the group.
   */
  customers: BaseCustomer[]
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the customer group was created.
   */
  created_at: string
  /**
   * The date the customer group was updated.
   */
  updated_at: string
}
