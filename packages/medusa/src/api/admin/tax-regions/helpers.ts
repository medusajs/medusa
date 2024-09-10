import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchTaxRegion = async (
  taxRegionId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [taxRegion],
  } = await query.graph({
    entryPoint: "tax_region",
    variables: { filters: { id: taxRegionId } },
    fields: fields,
  })

  return taxRegion
}
