import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { IInventoryService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export const deleteReservationsByLineItemsStepId =
  "delete-reservations-by-line-items"
export const deleteReservationsByLineItemsStep = createStep(
  deleteReservationsByLineItemsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await service.deleteReservationItemsByLineItem(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await service.restoreReservationItemsByLineItem(prevIds)
  }
)
