import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type CompleteOrdersStepInput = {
  orderIds: string[]
}

export const cancelOrdersStepId = "cancel-orders"
export const cancelOrdersStep = createStep(
  cancelOrdersStepId,
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

    const canceled = await service.cancel(data.orderIds)
    return new StepResponse(
      canceled,
      canceled.map((order) => {
        const prevData = orders.find((o) => o.id === order.id)!
        return {
          id: order.id,
          status: prevData.status,
          canceled_at: null,
        }
      })
    )
  },
  async (canceled, { container }) => {
    if (!canceled?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateOrders(canceled)
  }
)
