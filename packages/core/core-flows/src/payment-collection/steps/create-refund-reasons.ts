import {
  CreateRefundReasonDTO,
  IPaymentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createRefundReasonStepId = "create-refund-reason"
/**
 * This step creates one or more refund reasons.
 */
export const createRefundReasonStep = createStep(
  createRefundReasonStepId,
  async (data: CreateRefundReasonDTO[], { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const refundReasons = await service.createRefundReasons(data)

    return new StepResponse(
      refundReasons,
      refundReasons.map((rr) => rr.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.deleteRefundReasons(ids)
  }
)
