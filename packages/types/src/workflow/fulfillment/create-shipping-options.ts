import { ShippingOptionPriceType } from "../../fulfillment"
import { RuleOperatorType } from "../../common"

export interface CreateShippingOptionsWorkflowInput {
  name: string
  service_zone_id: string
  profile_id: string
  data?: Record<string, unknown>
  price_type: ShippingOptionPriceType
  prices: (
    | {
        currency_code: string
        amount: number
      }
    | {
        region_id: string
        amount: number
      }
  )[]
  rules?: {
    attribute: string
    operator: RuleOperatorType
    value: string | string[]
  }[]
}
