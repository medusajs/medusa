import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchShippingProfile = async (
  shippingProfileId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [shippingProfile],
  } = await query.graph({
    entryPoint: "shipping_profile",
    variables: {
      filters: { id: shippingProfileId },
    },
    fields: fields,
  })

  return shippingProfile
}
