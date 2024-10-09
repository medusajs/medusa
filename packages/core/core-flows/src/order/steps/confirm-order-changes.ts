import { OrderChangeDTO } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

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

    const currentChanges: Partial<OrderChangeDTO>[] = []
    await orderModuleService.confirmOrderChange(
      input.changes.map((action) => {
        const update = {
          id: action.id,
          confirmed_by: input.confirmed_by,
        }

        currentChanges.push({
          ...update,
          order_id: input.orderId,
          status: action.status,
        })

        return update
      })
    )

    return new StepResponse(null, currentChanges)
  },
  async (currentChanges, { container }) => {
    if (!currentChanges?.length) {
      return
    }

    const orderModuleService = container.resolve(Modules.ORDER)
    await orderModuleService.undoLastChange(
      currentChanges[0].order_id!,
      currentChanges[0]
    )
  }
)
