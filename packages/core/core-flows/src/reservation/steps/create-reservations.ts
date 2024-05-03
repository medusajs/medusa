import { IInventoryServiceNext, InventoryNext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createReservationsStepId = "create-reservations-step"
export const createReservationsStep = createStep(
  createReservationsStepId,
  async (data: InventoryNext.CreateReservationItemInput[], { container }) => {
    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    const created = await service.createReservationItems(data)

    return new StepResponse(
      created,
      created.map((reservation) => reservation.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.deleteReservationItems(createdIds)
  }
)
