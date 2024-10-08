import {
  CreatePriceListRules,
  PriceListRuleDTO,
  PriceListStatus,
} from "../../pricing"

export interface CreatePriceListDTO {
  starts_at?: string
  ends_at?: string
  status?: PriceListStatus
  rules?: PriceListRuleDTO[]
  prices?: {
    amount: number
    currency_code: string
    region_id?: string
    max_quantity?: number
    min_quantity?: number
  }[]
  customer_groups?: {
    id: string
  }[]
}

export interface CreatePriceListRuleDTO {
  attribute: string
  value: string[]
}

export interface CreatePriceListPriceDTO {
  amount: number
  currency_code: string
  price_set_id: string | null
  region_id?: string
  max_quantity?: number
  min_quantity?: number
}

export interface CreatePriceListWorkflowInputDTO {
  price_lists: CreatePriceListWorkflowDTO[]
}

export interface RemovePriceListProductsWorkflowInputDTO {
  product_ids: string[]
  price_list_id: string
}

export interface RemovePriceListVariantsWorkflowInputDTO {
  variant_ids: string[]
  price_list_id: string
}

export interface RemovePriceListPricesWorkflowInputDTO {
  money_amount_ids: string[]
  price_list_id: string
}

export interface CreatePriceListWorkflowDTO {
  title?: string
  name: string
  description: string
  type?: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  rules_count?: number
  prices: InputPrice[]
  rules?: CreatePriceListRules
}

interface InputPrice {
  region_id?: string
  currency_code: string
  amount: number
  variant_id: string
  min_quantity?: number
  max_quantity?: number
}
