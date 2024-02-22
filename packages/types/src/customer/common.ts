import { AddressDTO } from "../address"
import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

export interface CustomerAddressDTO {
  id: string
  address_name?: string
  is_default_shipping: boolean
  is_default_billing: boolean
  customer_id: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface FilterableCustomerAddressProps
  extends BaseFilterable<FilterableCustomerAddressProps> {
  id?: string | string[]
  address_name?: string | OperatorMap<string>
  is_default_shipping?: boolean | OperatorMap<boolean>
  is_default_billing?: boolean | OperatorMap<boolean>
  customer_id?: string | string[]
  customer?: FilterableCustomerProps | string | string[]
  company?: string | OperatorMap<string>
  first_name?: string | OperatorMap<string>
  last_name?: string | OperatorMap<string>
  address_1?: string | OperatorMap<string>
  address_2?: string | OperatorMap<string>
  city?: string | OperatorMap<string>
  country_code?: string | OperatorMap<string>
  province?: string | OperatorMap<string>
  postal_code?: string | OperatorMap<string>
  phone?: string | OperatorMap<string>
  metadata?: Record<string, unknown> | OperatorMap<Record<string, unknown>>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface FilterableCustomerGroupProps
  extends BaseFilterable<FilterableCustomerGroupProps> {
  id?: string | string[]
  name?: string | OperatorMap<string>
  customers?: FilterableCustomerProps | string | string[]
  created_by?: string | string[] | null
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface FilterableCustomerGroupCustomerProps
  extends BaseFilterable<FilterableCustomerGroupCustomerProps> {
  id?: string | string[]
  customer_id?: string | string[]
  customer_group_id?: string | string[]
  customer?: FilterableCustomerProps | string | string[]
  group?: FilterableCustomerGroupProps | string | string[]
  created_by?: string | string[] | null
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface FilterableCustomerProps
  extends BaseFilterable<FilterableCustomerProps> {
  id?: string | string[]
  email?: string | string[] | OperatorMap<string>
  groups?: FilterableCustomerGroupProps | string | string[]
  default_billing_address_id?: string | string[] | null
  default_shipping_address_id?: string | string[] | null
  company_name?: string | string[] | OperatorMap<string> | null
  first_name?: string | string[] | OperatorMap<string> | null
  last_name?: string | string[] | OperatorMap<string> | null
  has_account?: boolean | OperatorMap<boolean>
  created_by?: string | string[] | null
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface CustomerGroupDTO {
  id: string
  name: string
  customers?: Partial<CustomerDTO>[]
  metadata?: Record<string, unknown>
  created_by?: string | null
  deleted_at?: Date | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export interface CustomerGroupCustomerDTO {
  id: string
  customer_id: string
  customer_group_id: string
  customer?: Partial<CustomerDTO>
  group?: Partial<CustomerGroupDTO>
  created_by?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export interface CustomerDTO {
  id: string
  email: string
  default_billing_address_id?: string | null
  default_shipping_address_id?: string | null
  company_name?: string | null
  first_name?: string | null
  last_name?: string | null
  addresses?: CustomerAddressDTO[]
  phone?: string | null
  groups?: { id: string }[]
  metadata?: Record<string, unknown>
  created_by?: string | null
  deleted_at?: Date | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type GroupCustomerPair = {
  customer_id: string
  customer_group_id: string
}

export type legacy_CustomerDTO = {
  id: string
  email: string
  billing_address_id?: string | null
  shipping_address_id?: string | null
  first_name?: string | null
  last_name?: string | null
  billing_address?: AddressDTO
  shipping_address?: AddressDTO
  phone?: string | null
  has_account: boolean
  groups?: {
    id: string
  }[]
  orders: {
    id: string
  }[]
  metadata?: Record<string, unknown>
  deleted_at?: Date | string
  created_at?: Date | string
  updated_at?: Date | string
}
