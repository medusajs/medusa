import {
  CancelOrderClaimDTO,
  IOrderModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const cancelOrderClaimStepId = "cancel-order-claim"
/**
 * This step cancels a claim.
 */
export const cancelOrderClaimStep = createStep(
  cancelOrderClaimStepId,
  async (data: CancelOrderClaimDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.cancelClaim(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.revertLastVersion(orderId)
  }
)
