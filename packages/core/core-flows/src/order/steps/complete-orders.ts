import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type CompleteOrdersStepInput = {
  orderIds: string[]
}

export const completeOrdersStepId = "complete-orders"
/**
 * This step completes one or more orders.
 */
export const completeOrdersStep = createStep(
  completeOrdersStepId,
  async (data: CompleteOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const orders = await service.listOrders(
      {
        id: data.orderIds,
      },
      {
        select: ["id", "status"],
      }
    )

    const completed = await service.completeOrder(data.orderIds)
    return new StepResponse(
      completed,
      completed.map((order) => {
        const prevData = orders.find((o) => o.id === order.id)!
        return {
          id: order.id,
          status: prevData.status,
        }
      })
    )
  },
  async (completed, { container }) => {
    if (!completed?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrders(completed)
  }
)
