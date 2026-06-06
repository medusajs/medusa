import {
  IPaymentModuleService,
  UpdateRefundReasonDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The refund reasons to update.
 */
export type UpdateRefundReasonStepInput = UpdateRefundReasonDTO[]

export const updateRefundReasonStepId = "update-refund-reasons"
/**
 * This step updates one or more refund reasons.
 */
export const updateRefundReasonsStep = createStep(
  updateRefundReasonStepId,
  async (data: UpdateRefundReasonStepInput, { container }) => {
    const ids = data.map((d) => d.id)

    if (!data.length) {
      return new StepResponse([], [])
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

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

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await promiseAll(
      previousData.map((refundReason) =>
        service.updateRefundReasons(refundReason)
      )
    )
  }
)
