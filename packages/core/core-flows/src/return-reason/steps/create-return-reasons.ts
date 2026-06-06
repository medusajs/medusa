import {
  CreateOrderReturnReasonDTO,
  IOrderModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createReturnReasonsStepId = "create-return-reasons"
/**
 * This step creates one or more return reasons.
 * 
 * @example
 * const data = createReturnReasonsStep([
 *   {
 *     label: "Damaged",
 *     value: "damaged",
 *   }
 * ])
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
