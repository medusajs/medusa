import { PaginatedResponse } from "../../../common"

/**
 * @experimental
 */
export interface CustomerGroupResponse {
  id: string
  name: string | null
  customers: CustomerResponse[]
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

/**
 * @experimental
 */
export interface CustomerAddressResponse {
  id: string
  address_name: string | null
  is_default_shipping: boolean
  is_default_billing: boolean
  customer_id: string
  company: string | null
  first_name: string | null
  last_name: string | null
  address_1: string | null
  address_2: string | null
  city: string | null
  country_code: string | null
  province: string | null
  postal_code: string | null
  phone: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

/**
 * @experimental
 */
interface CustomerResponse {
  id: string
  email: string
  default_billing_address_id: string | null
  default_shipping_address_id: string | null
  company_name: string | null
  first_name: string | null
  last_name: string | null
  has_account: boolean
  addresses: CustomerAddressResponse[]
  phone?: string | null
  groups?: CustomerGroupResponse[]
  metadata?: Record<string, unknown>
  created_by?: string | null
  deleted_at?: Date | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

/**
 * @experimental
 */
export interface AdminCustomerResponse {
  customer: CustomerResponse
}

/**
 * @experimental
 */
export interface AdminCustomerListResponse extends PaginatedResponse {
  customers: CustomerResponse[]
}

/**
 * @experimental
 */
export interface AdminCustomerGroupResponse {
  customer_group: CustomerGroupResponse
}

/**
 * @experimental
 */
export interface AdminCustomerGroupListResponse extends PaginatedResponse {
  customer_groups: CustomerGroupResponse[]
}
