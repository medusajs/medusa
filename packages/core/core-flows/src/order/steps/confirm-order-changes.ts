import { OrderChangeDTO } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export type ConfirmOrderChangesInput = {
  orderId: string
  changes: OrderChangeDTO[]
  confirmed_by?: string
}

/**
 * This step confirms changes of an order.
 */
export const confirmOrderChanges = createStep(
  "confirm-order-changes",
  async (input: ConfirmOrderChangesInput, { container }) => {
    const orderModuleService = container.resolve(Modules.ORDER)
    await orderModuleService.confirmOrderChange(
      input.changes.map((action) => ({
        id: action.id,
        confirmed_by: input.confirmed_by,
      }))
    )

    return new StepResponse(null, input.orderId)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const orderModuleService = container.resolve(Modules.ORDER)
    await orderModuleService.revertLastVersion(orderId)
  }
)
