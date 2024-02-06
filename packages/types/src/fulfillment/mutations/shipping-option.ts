import { ShippingOptionPriceType } from "../common"

export interface CreateShippingOptionDTO {
  name: string
  price_type: ShippingOptionPriceType
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  // TODO relations
}

export interface UpdateShippingOptionDTO
  extends Partial<CreateShippingOptionDTO> {
  id: string
}
