import { ShippingOptionPriceType } from "../../../fulfillment"
import { BaseFulfillmentProvider } from "../../fulfillment-provider/common"

export interface StoreShippingOptionType {
  id: string
  label: string
  description: string
  code: string
  shipping_option_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface StoreShippingOption {
  id: string
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  provider_id: string
  provider: BaseFulfillmentProvider
  shipping_option_type_id: string | null
  type: StoreShippingOptionType
  shipping_profile_id: string
  amount: number
  is_tax_inclusive: boolean
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
}
