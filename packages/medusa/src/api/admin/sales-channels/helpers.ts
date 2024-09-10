import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchSalesChannel = async (
  salesChannelId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [salesChannel],
  } = await query.graph({
    entryPoint: "sales_channel",
    variables: {
      filters: { id: salesChannelId },
    },
    fields: fields,
  })

  return salesChannel
}
