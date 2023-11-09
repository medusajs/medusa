import {
  CreatePriceListRules,
  PriceListRuleDTO,
  PriceListStatus,
} from "../../pricing"

export interface CreatePriceListDTO {
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
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
  rule_attribute: string
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
  priceLists: CreatePriceListWorkflowDTO[]
}

export interface RemovePriceListProductsWorkflowInputDTO {
  productIds: string[]
  priceListId: string
}

export interface RemovePriceListVariantsWorkflowInputDTO {
  variantIds: string[]
  priceListId: string
}

export interface RemovePriceListPricesWorkflowInputDTO {
  moneyAmountIds: string[]
  priceListId: string
}

export interface CreatePriceListWorkflowDTO {
  title?: string
  name: string
  description: string
  customer_groups?: {
    id: string
  }[]
  type?: string
  includes_tax?: boolean
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
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
