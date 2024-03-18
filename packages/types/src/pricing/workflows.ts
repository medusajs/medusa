import { PriceListStatus } from "./common"

export interface CreatePriceListPriceWorkflowDTO {
  amount: number
  currency_code: string
  variant_id: string
  max_quantity?: number
  min_quantity?: number
  rules?: Record<string, string>
}

export interface UpdatePriceListPriceWorkflowDTO {
  id: string
  amount?: number
  currency_code?: string
  variant_id?: string
  max_quantity?: number
  min_quantity?: number
  rules?: Record<string, string>
}

export interface CreatePriceListWorkflowInputDTO {
  title: string
  description: string
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  rules?: Record<string, string[]>
  prices?: CreatePriceListPriceWorkflowDTO[]
}

export interface UpdatePriceListWorkflowInputDTO {
  id: string
  title?: string
  description?: string
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  rules?: Record<string, string[]>
  prices?: (UpdatePriceListPriceWorkflowDTO | CreatePriceListPriceWorkflowDTO)[]
}
