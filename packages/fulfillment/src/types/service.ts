import { FulfillmentTypes } from "@medusajs/types"

export type UpdateShippingOptionsInput = Required<
  Pick<FulfillmentTypes.UpdateShippingOptionDTO, "id">
> &
  FulfillmentTypes.UpdateShippingOptionDTO
