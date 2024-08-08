import { IPaymentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteRefundReasonsStepId = "delete-refund-reasons"
export const deleteRefundReasonsStep = createStep(
  deleteRefundReasonsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    await service.softDeleteRefundReasons(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerIds, { container }) => {
    if (!prevCustomerIds?.length) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    await service.restoreRefundReasons(prevCustomerIds)
  }
)
