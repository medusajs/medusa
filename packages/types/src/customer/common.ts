import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { AddressDTO } from "../address"

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

export interface FilterableCustomerGroupProps
  extends BaseFilterable<FilterableCustomerGroupProps> {
  id?: string | string[]
  name?: OperatorMap<string>
  customers?: FilterableCustomerProps | string | string[]
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
  created_by?: string | string[] | null
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface CustomerDTO {
  id: string
  email: string
  default_billing_address_id?: string | null
  default_shipping_address_id?: string | null
  company_name?: string | null
  first_name?: string | null
  last_name?: string | null
  default_billing_address?: AddressDTO
  default_shipping_address?: AddressDTO
  addresses?: AddressDTO[]
  phone?: string | null
  groups?: { id: string }[]
  metadata?: Record<string, unknown>
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
