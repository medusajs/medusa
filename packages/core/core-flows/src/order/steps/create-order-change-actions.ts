import {
  CreateOrderChangeActionDTO,
  IOrderModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createOrderChangeActionsStepId = "create-order-change-actions"
export const createOrderChangeActionsStep = createStep(
  createOrderChangeActionsStepId,
  async (data: CreateOrderChangeActionDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const created = await service.addOrderAction(data)

    return new StepResponse(
      created,
      created.map((c) => c.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteOrderChangeActions(ids)
  }
)
