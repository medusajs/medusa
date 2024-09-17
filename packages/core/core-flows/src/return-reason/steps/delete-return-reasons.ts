import { IOrderModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteReturnReasonStepId = "delete-return-reasons"
/**
 * This step deletes one or more return reasons.
 */
export const deleteReturnReasonStep = createStep(
  deleteReturnReasonStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.softDeleteReturnReasons(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevReturnReasons, { container }) => {
    if (!prevReturnReasons) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreReturnReasons(prevReturnReasons)
  }
)
