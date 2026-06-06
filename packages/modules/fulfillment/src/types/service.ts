import { FulfillmentTypes } from "@zjedene-medusa/framework/types"

export type UpdateShippingOptionsInput = Required<
  Pick<FulfillmentTypes.UpdateShippingOptionDTO, "id">
> &
  FulfillmentTypes.UpdateShippingOptionDTO
