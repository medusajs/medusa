import { PriceListStatus, PriceListType } from "../../../pricing"
import { AdminPrice } from "../../pricing"

export interface AdminPriceList {
  id: string
  title: string
  description: string
  rules: Record<string, any>
  starts_at: string | null
  ends_at: string | null
  status: PriceListStatus
  type: PriceListType
  prices: AdminPrice[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
