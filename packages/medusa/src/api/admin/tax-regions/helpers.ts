import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchTaxRegion = async (
  taxRegionId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const taxRegions = await query.graph({
    entryPoint: "taxRegion",
    variables: { id: taxRegionId },
    fields: fields,
  })

  return taxRegions[0]
}
