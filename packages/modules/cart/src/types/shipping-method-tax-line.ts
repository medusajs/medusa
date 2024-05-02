import { CreateTaxLineDTO, UpdateTaxLineDTO } from "./tax-line"

export interface CreateShippingMethodTaxLineDTO extends CreateTaxLineDTO {
  shipping_method_id: string
}

export interface UpdateShippingMethodTaxLineDTO extends UpdateTaxLineDTO {
  shipping_method_id: string
}
