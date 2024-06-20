import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type CompleteOrdersStepInput = {
  orderIds: string[]
}

export const completeOrdersStepId = "complete-orders"
export const completeOrdersStep = createStep(
  completeOrdersStepId,
  async (data: CompleteOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

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

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrders(completed)
  }
)
