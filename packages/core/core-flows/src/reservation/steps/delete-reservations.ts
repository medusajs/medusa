import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { IInventoryServiceNext } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const deleteReservationsStepId = "delete-reservations"
export const deleteReservationsStep = createStep(
  deleteReservationsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.softDeleteReservationItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.restoreReservationItems(prevIds)
  }
)
