import { CancelOrderClaimDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const cancelOrderClaimStepId = "cancel-order-claim"
/**
 * This step cancels a claim.
 */
export const cancelOrderClaimStep = createStep(
  cancelOrderClaimStepId,
  async (data: CancelOrderClaimDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.cancelClaim(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.revertLastVersion(orderId)
  }
)
