import { PriceListStatus, PriceListType } from "../../../pricing"
import { AdminPrice } from "../../pricing"

export interface AdminPriceListPrice extends AdminPrice {
  variant_id: string
  rules: Record<string, unknown>
}

export interface AdminPriceList {
  id: string
  title: string
  description: string
  rules: Record<string, any>
  starts_at: string | null
  ends_at: string | null
  status: PriceListStatus
  type: PriceListType
  prices: AdminPriceListPrice[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
