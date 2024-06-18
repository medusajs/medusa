import { PricingTypes } from "../bundles"
import { PriceListStatus } from "./common"

export interface CreatePriceListPriceWorkflowDTO {
  amount: number
  currency_code: string
  variant_id: string
  max_quantity?: number | null
  min_quantity?: number | null
  rules?: Record<string, string>
}

export interface UpdatePriceListPriceWorkflowDTO {
  id: string
  variant_id: string
  amount?: number
  currency_code?: string
  max_quantity?: number | null
  min_quantity?: number | null
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
  description?: string | null
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  rules?: Record<string, string[]>
}

export interface UpdatePriceListPricesWorkflowDTO {
  id: string
  prices: UpdatePriceListPriceWorkflowDTO[]
}

export interface BatchPriceListPricesWorkflowDTO {
  id: string
  create: CreatePriceListPriceWorkflowDTO[]
  update: UpdatePriceListPriceWorkflowDTO[]
  delete: string[]
}

export interface BatchPriceListPricesWorkflowResult {
  created: PricingTypes.PriceDTO[]
  updated: PricingTypes.PriceDTO[]
  deleted: string[]
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
