import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CompleteOrdersStepInput = {
  order_ids: string[]
}

export const completeOrdersStepId = "complete-orders"
export const completeOrdersStep = createStep(
  completeOrdersStepId,
  async (data: CompleteOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const completed = await service.completeOrder(data.order_ids)
    return new StepResponse(
      completed,
      completed.map((store) => {
        return {
          id: store.id,
          status: store.status,
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

    await service.update(completed)
  }
)
