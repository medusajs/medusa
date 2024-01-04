import { CreatePriceListRules, PriceListStatus } from "../../pricing"

import { UpdateProductVariantPricesInputDTO } from "../product"

export type PriceListVariantPriceDTO = UpdateProductVariantPricesInputDTO & {
  variant_id?: string
  price_set_id?: string
}

export interface UpdatePriceListWorkflowDTO {
  id: string
  name?: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  rules?: CreatePriceListRules
  prices?: PriceListVariantPriceDTO[]
  customer_groups?: {
    id: string
  }[]
}

export interface UpdatePriceListWorkflowInputDTO {
  price_lists: UpdatePriceListWorkflowDTO[]
}
