import { AddressDTO } from "../address"

export interface CustomerDTO {
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
