import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  ids: string[]
}

export const deleteOrderLineItems = createStep(
  "delete-order-line-items",
  async (input: StepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const deleted = await service.softDeleteLineItems(input.ids)

    return new StepResponse(deleted, input.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreLineItems(ids)
  }
)
