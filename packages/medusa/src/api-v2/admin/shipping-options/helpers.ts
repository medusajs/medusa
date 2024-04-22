import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchShippingOption = async (
  shippingOptionId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_option",
    variables: {
      filters: { id: shippingOptionId },
    },
    fields: fields,
  })

  const shippingOptions = await remoteQuery(queryObject)
  return shippingOptions[0]
}
