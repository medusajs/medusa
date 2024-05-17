import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CompleteOrdersStepInput = {
  order_ids: string[]
}

export const archiveOrdersStepId = "archive-orders"
export const archiveOrdersStep = createStep(
  archiveOrdersStepId,
  async (data: CompleteOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const archived = await service.archive(data.order_ids)
    return new StepResponse(
      archived,
      archived.map((store) => {
        return {
          id: store.id,
          status: store.status,
        }
      })
    )
  },
  async (archived, { container }) => {
    if (!archived?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.update(archived)
  }
)
