import { AddressDTO } from "../address"

export type CustomerDTO = {
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
  deleted_at?: Date | string
  created_at?: Date | string
  updated_at?: Date | string
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
