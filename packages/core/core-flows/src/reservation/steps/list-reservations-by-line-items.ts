import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import type { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const listReservationsByLineItemsStepId =
  "list-reservations-by-line-items"

export const listReservationsByLineItemsStep = createStep(
  listReservationsByLineItemsStepId,
  async (ids: string[], { container }) => {
    if (!ids?.length) {
      return new StepResponse<string[]>([])
    }

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
    const reservations = await service.listReservationItems(
      { line_item_id: ids },
      { select: ["line_item_id"] }
    )

    const lineItemIds = reservations
      .map((reservation) => reservation.line_item_id)
      .filter((id): id is string => !!id)

    return new StepResponse(Array.from(new Set(lineItemIds)))
  }
)