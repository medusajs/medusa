import { BigNumberInput, IInventoryService } from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface ConfirmVariantInventoryStepInput {
  items: {
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: BigNumberInput
    location_ids: string[]
  }[]
}

export const confirmInventoryStepId = "confirm-inventory-step"
/**
 * This step confirms for one or more variants that their inventory has a required quantity.
 */
export const confirmInventoryStep = createStep(
  confirmInventoryStepId,
  async (data: ConfirmVariantInventoryStepInput, { container }) => {
    const inventoryService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    // TODO: Should be bulk
    const promises = data.items.map(async (item) => {
      if (item.allow_backorder) {
        return true
      }

      const itemQuantity = MathBN.mult(item.quantity, item.required_quantity)

      return await inventoryService.confirmInventory(
        item.inventory_item_id,
        item.location_ids,
        itemQuantity
      )
    })

    const inventoryCoverage = await promiseAll(promises)

    if (inventoryCoverage.some((hasCoverage) => !hasCoverage)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Some variant does not have the required inventory`,
        MedusaError.Codes.INSUFFICIENT_INVENTORY
      )
    }

    return new StepResponse(null)
  }
)
