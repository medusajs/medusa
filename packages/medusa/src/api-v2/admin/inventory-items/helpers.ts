import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchInventoryItem = async (
  inventoryItemId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "inventory_item",
    variables: {
      filters: { id: inventoryItemId },
      skip: 0,
      take: 1,
    },
    fields: fields,
  })

  // TODO: Why does the response type change if you pass skip and take, vs not passing it?
  // Also, why does the data change (in this case, not doing skip and take will not return the lazy fields of stockedQuantity and reserved_quantity)
  const { rows } = await remoteQuery(queryObject)

  return rows[0]
}
