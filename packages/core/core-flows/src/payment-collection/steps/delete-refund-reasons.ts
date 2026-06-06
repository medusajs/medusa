import type { IPaymentModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The refund reasons to delete.
 */
export type DeleteRefundReasonsStepInput = string[]

export const deleteRefundReasonsStepId = "delete-refund-reasons"
/**
 * This step deletes one or more refund reasons.
 */
export const deleteRefundReasonsStep = createStep(
  deleteRefundReasonsStepId,
  async (ids: DeleteRefundReasonsStepInput, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.softDeleteRefundReasons(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerIds, { container }) => {
    if (!prevCustomerIds?.length) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.restoreRefundReasons(prevCustomerIds)
  }
)
