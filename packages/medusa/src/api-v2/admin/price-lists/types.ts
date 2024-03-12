import { PriceListStatus, PriceListType } from "@medusajs/types"

export type AdminPriceListRemoteQueryDTO = {
  id: string
  type?: PriceListType
  description?: string
  title?: string
  status?: PriceListStatus
  starts_at?: string
  ends_at?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
  prices?: {
    id: string
    variant_id: string
    currency_code?: string
    amount?: number
    min_quantity?: number
    max_quantity?: number
  }[]
}
