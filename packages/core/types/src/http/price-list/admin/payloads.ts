import { PriceListStatus, PriceListType } from "../../../pricing"

export interface AdminCreatePriceListPrice {
  currency_code: string
  amount: number
  variant_id: string
  min_quantity?: number | null
  max_quantity?: number | null
  rules?: Record<string, string>
}

export interface AdminCreatePriceList {
  title: string
  description?: string | null
  starts_at?: string | null
  ends_at?: string | null
  status: PriceListStatus
  type: PriceListType
  rules?: Record<string, string[]>
  prices?: AdminCreatePriceListPrice[]
}

export interface AdminUpdatePriceListPrice {
  id: string
  currency_code?: string
  amount?: number
  variant_id: string
  min_quantity?: number | null
  max_quantity?: number | null
  rules?: Record<string, string>
}

export interface AdminUpdatePriceList {
  title?: string
  description?: string
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  type?: PriceListType
  rules?: Record<string, string[]>
}

export interface AdminBatchPriceListPrice {
  create?: AdminCreatePriceListPrice[]
  update?: AdminUpdatePriceListPrice[]
  delete?: string[]
}

export interface AdminLinkPriceListProducts {
  remove?: string[]
}
