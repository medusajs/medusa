import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

export const validateInventoryItemsId = "validate-inventory-items-step"
/**
 * This step ensures that the inventory items with the specified IDs exist.
 */
export const validateInventoryItems = createStep(
  validateInventoryItemsId,
  async (id: string[], { container }) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const items = await remoteQuery({
      entryPoint: "inventory_item",
      variables: { id },
      fields: ["id"],
    })
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
