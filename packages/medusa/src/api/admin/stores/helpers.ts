import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
} from "@medusajs/utils"

export const refetchStore = async (
  storeId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY))

  const { data: [store] } = await query.graph({
    entryPoint: "store",
    variables: {
      filters: { id: storeId },
    },
    fields: fields,
  })

  return store
}
