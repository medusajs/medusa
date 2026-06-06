import {
  CreateOrderReturnDTO,
  IOrderModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createReturnsStepId = "create-returns"
/**
 * This step creates returns.
 */
export const createReturnsStep = createStep(
  createReturnsStepId,
  async (data: CreateOrderReturnDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const orderReturns = await service.createReturns(data)

    const returnIds = orderReturns.map((ret) => ret.id)

    return new StepResponse(orderReturns, returnIds)
  },
  async (returnIds, { container }) => {
    if (!returnIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteReturns(returnIds)
  }
)
