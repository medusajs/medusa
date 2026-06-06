import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the return reasons to delete.
 */
export type DeleteReturnReasonStepInput = string[]

export const deleteReturnReasonStepId = "delete-return-reasons"
/**
 * This step deletes one or more return reasons.
 *
 * @example
 * const data = deleteReturnReasonStep(["rr_123"])
 */
export const deleteReturnReasonStep = createStep(
  deleteReturnReasonStepId,
  async (ids: DeleteReturnReasonStepInput, { container }) => {
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
