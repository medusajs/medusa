import { AdminFulfillmentSetResponse } from "../fulfillment"

export type AdminStockLocationAddressResponse = {
  id?: string
  address_1: string
  address_2?: string | null
  company?: string | null
  country_code: string
  city?: string | null
  phone?: string | null
  postal_code?: string | null
  province?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

export interface AdminStockLocationResponse {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  address_id: string
  address?: AdminStockLocationAddressResponse
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null

  fulfillment_sets?: AdminFulfillmentSetResponse[]
}
