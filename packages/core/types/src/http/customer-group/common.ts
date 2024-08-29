import { BaseCustomer } from "../customer/common"

export interface BaseCustomerGroup {
  id: string
  name: string | null
  customers: BaseCustomer[]
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}
