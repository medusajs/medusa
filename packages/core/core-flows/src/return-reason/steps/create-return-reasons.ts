import {
  CreateOrderReturnReasonDTO,
  IOrderModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createReturnReasonsStepId = "create-return-reasons"
/**
 * This step creates one or more return reasons.
 */
export const createReturnReasonsStep = createStep(
  createReturnReasonsStepId,
  async (data: CreateOrderReturnReasonDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const createdReturnReasons = await service.createReturnReasons(data)

    return new StepResponse(
      createdReturnReasons,
      createdReturnReasons.map(
        (createdReturnReasons) => createdReturnReasons.id
      )
    )
  },
  async (createdReturnReasonIds, { container }) => {
    if (!createdReturnReasonIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteReturnReasons(createdReturnReasonIds)
  }
)
