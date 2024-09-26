import { CreateOrderDTO, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createOrdersStepId = "create-orders"
/**
 * This step creates one or more orders.
 */
export const createOrdersStep = createStep(
  createOrdersStepId,
  async (data: CreateOrderDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const created = await service.createOrders(data)
    return new StepResponse(
      created,
      created.map((store) => store.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrders(createdIds)
  }
)
