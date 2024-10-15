import { MathBN, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
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
    const inventoryService = container.resolve(Modules.INVENTORY)

    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds: string[] = []

    const items = data.items.map((item) => {
      inventoryItemIds.push(item.inventory_item_id)

      return {
        line_item_id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: MathBN.mult(item.required_quantity, item.quantity),
        allow_backorder: item.allow_backorder,
        location_id: item.location_ids[0],
      }
    })

    const reservations = await locking.execute(inventoryItemIds, async () => {
      return await inventoryService.createReservationItems(items)
    })

    return new StepResponse(reservations, {
      reservations: reservations.map((r) => r.id),
      inventoryItemIds,
    })
  },
  async (data, { container }) => {
    if (!data?.reservations?.length) {
      return
    }

    const inventoryService = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)

    const inventoryItemIds = data.inventoryItemIds
    await locking.execute(inventoryItemIds, async () => {
      await inventoryService.deleteReservationItems(data.reservations)
    })

    return new StepResponse()
  }
)
