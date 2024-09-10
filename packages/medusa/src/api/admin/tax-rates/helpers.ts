import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchTaxRate = async (
  taxRateId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [taxRate],
  } = await query.graph({
    entryPoint: "tax_rate",
    variables: {
      filters: { id: taxRateId },
    },
    fields: fields,
  })

  return taxRate
}
