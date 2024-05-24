import { BaseFilterable, OperatorMap } from "../../dal"

export interface BaseCustomerGroup {
  id: string
  name: string | null
  customers: BaseCustomer[]
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface BaseCustomerAddress {
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

export interface BaseCustomer {
  id: string
  email: string
  default_billing_address_id: string | null
  default_shipping_address_id: string | null
  company_name: string | null
  first_name: string | null
  last_name: string | null
  addresses: BaseCustomerAddress[]
  phone?: string | null
  metadata?: Record<string, unknown>
  created_by?: string | null
  deleted_at?: Date | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export interface CustomerGroupInCustomerFilters {
  id: string[] | string
  name: string[] | string
  created_at: OperatorMap<string>
  updated_at: OperatorMap<string>
  deleted_at: OperatorMap<string>
}

export interface BaseCustomerFilters
  extends BaseFilterable<BaseCustomerFilters> {
  q?: string
  id?: string[] | string | OperatorMap<string | string[]>
  email?: string[] | string | OperatorMap<string>
  company_name?: string[] | string | OperatorMap<string>
  first_name?: string[] | string | OperatorMap<string>
  last_name?: string[] | string | OperatorMap<string>
  created_by?: string[] | string | OperatorMap<string>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface BaseCustomerAddressFilters
  extends BaseFilterable<BaseCustomerAddressFilters> {
  q?: string
  company?: string[] | string
  city?: string[] | string
  country_code?: string[] | string
  province?: string[] | string
  postal_code?: string[] | string
}

export interface BaseCreateCustomer {
  email: string
  company_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface BaseUpdateCustomer {
  company_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}
