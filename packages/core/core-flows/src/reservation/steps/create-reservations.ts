import { IInventoryService, InventoryTypes } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"

export const createReservationsStepId = "create-reservations-step"
/**
 * This step creates one or more reservations.
 */
export const createReservationsStep = createStep(
  createReservationsStepId,
  async (data: InventoryTypes.CreateReservationItemInput[], { container }) => {
    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

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

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

    await service.deleteReservationItems(createdIds)
  }
)
