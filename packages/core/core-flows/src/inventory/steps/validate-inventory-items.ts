import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the inventory items to validate.
 */
export type ValidateInventoryItemsStepInput = string[]

export const validateInventoryItemsId = "validate-inventory-items-step"
/**
 * This step ensures that the inventory items with the specified IDs exist.
 * If not valid, the step will throw an error.
 */
export const validateInventoryItems = createStep(
  validateInventoryItemsId,
  async (id: ValidateInventoryItemsStepInput, { container }) => {
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
