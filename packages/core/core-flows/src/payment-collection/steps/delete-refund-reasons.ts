import { IPaymentModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const deleteRefundReasonsStepId = "delete-refund-reasons"
/**
 * This step deletes one or more refund reasons.
 */
export const deleteRefundReasonsStep = createStep(
  deleteRefundReasonsStepId,
  async (ids: string[], { container }) => {
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
