import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of canceling the orders.
 */
export type CancelOrdersStepInput = {
  /**
   * The IDs of the orders to cancel.
   */
  orderIds: string[]
  /**
   * The ID of the user canceling the orders.
   */
  canceled_by?: string
}

export const cancelOrdersStepId = "cancel-orders"
/**
 * This step cancels one or more orders.
 */
export const cancelOrdersStep = createStep(
  cancelOrdersStepId,
  async (data: CancelOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const orders = await service.listOrders(
      {
        id: data.orderIds,
      },
      {
        select: ["id", "status"],
      }
    )

    const canceled = await service.cancel(data.orderIds)
    return new StepResponse(
      canceled,
      canceled.map((order) => {
        const prevData = orders.find((o) => o.id === order.id)!
        return {
          id: order.id,
          status: prevData.status,
          canceled_at: null,
          canceled_by: null,
        }
      })
    )
  },
  async (canceled, { container }) => {
    if (!canceled?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrders(canceled)
  }
)
