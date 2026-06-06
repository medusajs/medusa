import { MedusaContainer } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const refetchShippingOptionType = async (
  shippingOptionTypeId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: shippingOptionTypes } = await query.graph({
    entity: "shipping_option_type",
    fields: fields,
    filters: { id: shippingOptionTypeId },
  })
  return shippingOptionTypes[0]
}
