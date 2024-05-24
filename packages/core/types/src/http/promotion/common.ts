import { ApplicationMethodTypeValues } from "../../promotion"

export interface BasePromotion {
  id: string
  code?: string
  is_automatic?: boolean
  application_method?: {
    type?: ApplicationMethodTypeValues
    value?: number
    currency_code?: string
  }
}
