import { PriceListRuleDTO, PriceListStatus } from "../../pricing"

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
  customer_groups?: { id: string }[]
}

export interface CreatePriceListRuleDTO {
  rule_attribute: string
  value: string[]
}

export interface CreatePriceListPriceDTO  {
  amount: number
  currency_code: string
  price_set_id: string
  region_id?: string 
  max_quantity?: number
  min_quantity?: number
}

export interface CreatePriceListWorkflowInputDTO {
  priceLists: CreatePriceListDTO[]
}
