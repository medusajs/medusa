import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

export const validateInventoryItemsId = "validate-inventory-items-step"
export const validateInventoryItems = createStep(
  validateInventoryItemsId,
  async (id: string[], { container }) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const query = remoteQueryObjectFromString({
      entryPoint: "inventory_item",
      variables: { id },
      fields: ["id"],
    })

    const items = await remoteQuery(query)
    const diff = arrayDifference(
      id,
      items.map(({ id }) => id)
    )

    if (diff.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Inventory Items with ids: ${diff.join(", ")} was not found`
      )
    }
  }
)
