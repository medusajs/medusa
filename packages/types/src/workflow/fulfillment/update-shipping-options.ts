import { ShippingOptionPriceType } from "../../fulfillment"
import { RuleOperatorType } from "../../common"

export interface UpdateShippingOptionsWorkflowInput {
  id: string
  name?: string
  service_zone_id?: string
  shipping_profile_id?: string
  data?: Record<string, unknown>
  price_type?: ShippingOptionPriceType
  provider_id?: string
  type?: {
    label: string
    description: string
    code: string
  }
  prices?: (
    | {
        id?: string
        currency_code?: string
        amount?: number
      }
    | {
        id?: string
        region_id?: string
        amount?: number
      }
  )[]
  rules?: {
    attribute: string
    operator: RuleOperatorType
    value: string | string[]
  }[]
}

export type UpdateShippingOptionsWorkflowOutput = {
  id: string
}[]
