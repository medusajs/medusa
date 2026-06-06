import type { OrderChangeDTO } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The input for the confirm order changes step.
 */
export type ConfirmOrderChangesInput = {
  /**
   * The ID of the order to confirm changes for.
   */
  orderId: string
  /**
   * The changes to confirm.
   */
  changes: OrderChangeDTO[]
  /**
   * The ID of the user confirming the changes.
   */
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
    const orderChanges = await orderModuleService.confirmOrderChange(
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

    return new StepResponse(orderChanges, currentChanges)
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
