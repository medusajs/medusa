import { IPaymentModuleService, UpdateRefundReasonDTO } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateRefundReasonStepId = "update-refund-reasons"
export const updateRefundReasonsStep = createStep(
  updateRefundReasonStepId,
  async (data: UpdateRefundReasonDTO[], { container }) => {
    const ids = data.map((d) => d.id)
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const prevRefundReasons = await service.listRefundReasons(
      { id: ids },
      { select: selects, relations }
    )

    const reasons = await service.updateRefundReasons(data)

    return new StepResponse(reasons, prevRefundReasons)
  },
  async (previousData, { container }) => {
    if (!previousData) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    await promiseAll(
      previousData.map((refundReason) =>
        service.updateRefundReasons(refundReason)
      )
    )
  }
)
