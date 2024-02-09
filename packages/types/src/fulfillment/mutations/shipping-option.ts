import { CreateShippingOptionTypeDTO } from "./shipping-option-type"
import { ShippingOptionPriceType, ShippingOptionRuleDTO } from "../common"

export interface CreateShippingOptionDTO {
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  service_provider_id: string
  type: CreateShippingOptionTypeDTO
  data?: Record<string, unknown> | null
  rules?: Omit<ShippingOptionRuleDTO, "shipping_option_id">[]
}

export interface UpdateShippingOptionDTO
  extends Partial<CreateShippingOptionDTO> {
  id: string
}
