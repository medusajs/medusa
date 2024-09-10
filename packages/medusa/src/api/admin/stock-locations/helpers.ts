import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchStockLocation = async (
  stockLocationId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [stockLocation],
  } = await query.graph({
    entryPoint: "stock_location",
    variables: {
      filters: { id: stockLocationId },
    },
    fields: fields,
  })

  return stockLocation
}
