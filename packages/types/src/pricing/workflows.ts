import { PriceListStatus } from "./common"

export interface CreatePriceListPriceWorkflowDTO {
  amount: number
  currency_code: string
  variant_id: string
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
  prices: CreatePriceListPriceWorkflowDTO[]
}

export interface UpdatePriceListWorkflowInputDTO {
  id: string
  title?: string
  description?: string
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  rules?: Record<string, string[]>
}

export interface UpdatePriceListPricesWorkflowDTO {
  id: string
  prices: {
    id: string
    variant_id: string
    amount?: number
    currency_code?: string
    max_quantity?: number
    min_quantity?: number
    rules?: Record<string, string>
  }[]
}

export interface CreatePriceListPricesWorkflowDTO {
  id: string
  prices: CreatePriceListPriceWorkflowDTO[]
}

export interface UpdatePriceListPriceWorkflowStepDTO {
  data?: UpdatePriceListPricesWorkflowDTO[]
  variant_price_map: Record<string, string>
}

export interface CreatePriceListsWorkflowStepDTO {
  data: CreatePriceListWorkflowInputDTO[]
  variant_price_map: Record<string, string>
}

export interface CreatePriceListPricesWorkflowStepDTO {
  data: (Pick<CreatePriceListWorkflowInputDTO, "prices"> & { id: string })[]
  variant_price_map: Record<string, string>
}
