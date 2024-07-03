import { CancelOrderClaimDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CancelOrderClaimStepInput = CancelOrderClaimDTO

export const cancelOrderClaimStepId = "cancel-order-claim"
export const cancelOrderClaimStep = createStep(
  cancelOrderClaimStepId,
  async (data: CancelOrderClaimStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.cancelClaim(data)
    return new StepResponse(void 0, data.return_id)
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
