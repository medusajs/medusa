import { IInventoryService } from "@medusajs/types"
import {
  MedusaError,
  ModuleRegistrationName,
  promiseAll,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  items: {
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: number
    location_ids: string[]
  }[]
}

export const confirmInventoryStepId = "confirm-inventory-step"
export const confirmInventoryStep = createStep(
  confirmInventoryStepId,
  async (data: StepInput, { container }) => {
    const inventoryService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    // TODO: Should be bulk
    const promises = data.items.map(async (item) => {
      if (item.allow_backorder) {
        return true
      }

      const itemQuantity = item.required_quantity * item.quantity

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
