import { CreateOrderTaxLineDTO, UpdateOrderTaxLineDTO } from "./tax-line"

export interface CreateOrderShippingMethodTaxLineDTO
  extends CreateOrderTaxLineDTO {
  shipping_method_id: string
}

export interface UpdateOrderShippingMethodTaxLineDTO
  extends UpdateOrderTaxLineDTO {
  shipping_method_id: string
}
