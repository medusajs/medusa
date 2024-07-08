import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { IInventoryService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export const deleteReservationsStepId = "delete-reservations"
export const deleteReservationsStep = createStep(
  deleteReservationsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await service.softDeleteReservationItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await service.restoreReservationItems(prevIds)
  }
)
