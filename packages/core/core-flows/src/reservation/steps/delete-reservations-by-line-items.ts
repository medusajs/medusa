import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IInventoryServiceNext } from "@medusajs/types"

export const deleteReservationsByLineItemsStepId =
  "delete-reservations-by-line-items"
export const deleteReservationsByLineItemsStep = createStep(
  deleteReservationsByLineItemsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.deleteReservationItemsByLineItem(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.restoreReservationItemsByLineItem(prevIds)
  }
)
