import { IInventoryService } from "@medusajs/framework/types"
import { MathBN, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { BigNumberInput } from "@medusajs/types"

export interface ReserveVariantInventoryStepInput {
  items: {
    id?: string
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: BigNumberInput
    location_ids: string[]
  }[]
}

export const reserveInventoryStepId = "reserve-inventory-step"
/**
 * This step reserves the quantity of line items from the associated
 * variant's inventory.
 */
export const reserveInventoryStep = createStep(
  reserveInventoryStepId,
  async (data: ReserveVariantInventoryStepInput, { container }) => {
    const inventoryService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    const items = data.items.map((item) => ({
      line_item_id: item.id,
      inventory_item_id: item.inventory_item_id,
      quantity: MathBN.mult(item.required_quantity, item.quantity),
      allow_backorder: item.allow_backorder,
      location_id: item.location_ids[0],
    }))

    const reservations = await inventoryService.createReservationItems(items)

    return new StepResponse(reservations, {
      reservations: reservations.map((r) => r.id),
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const inventoryService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    await inventoryService.deleteReservationItems(data.reservations)

    return new StepResponse()
  }
)
