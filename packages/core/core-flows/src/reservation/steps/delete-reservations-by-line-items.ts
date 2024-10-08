import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const deleteReservationsByLineItemsStepId =
  "delete-reservations-by-line-items"
/**
 * This step deletes reservations by their associated line items.
 */
export const deleteReservationsByLineItemsStep = createStep(
  deleteReservationsByLineItemsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

    await service.deleteReservationItemsByLineItem(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

    await service.restoreReservationItemsByLineItem(prevIds)
  }
)
