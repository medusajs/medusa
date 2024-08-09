import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export type ArchiveOrdersStepInput = {
  orderIds: string[]
}

export const archiveOrdersStepId = "archive-orders"
/**
 * This step archives one or more orders.
 */
export const archiveOrdersStep = createStep(
  archiveOrdersStepId,
  async (data: ArchiveOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const archived = await service.archive(data.orderIds)
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

    await service.updateOrders(archived)
  }
)
