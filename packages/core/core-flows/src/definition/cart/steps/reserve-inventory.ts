import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IInventoryService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  items: {
    id?: string
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: number
    location_ids: string[]
  }[]
}

export const reserveInventoryStepId = "reserve-inventory-step"
export const reserveInventoryStep = createStep(
  reserveInventoryStepId,
  async (data: StepInput, { container }) => {
    const inventoryService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    const items = data.items.map((item) => ({
      line_item_id: item.id,
      inventory_item_id: item.inventory_item_id,
      quantity: item.required_quantity * item.quantity,
      allow_backorder: item.allow_backorder,
      location_id: item.location_ids[0],
    }))

    const reservations = await inventoryService.createReservationItems(items)

    return new StepResponse(void 0, {
      reservations: reservations.map((r) => r.id),
    })
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const inventoryService = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await inventoryService.deleteReservationItems(data.reservations)

    return new StepResponse()
  }
)
