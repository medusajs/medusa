import { CreateOrderClaimDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createOrderClaimsStepId = "create-order-claims"
/**
 * This step creates one or more order claims.
 */
export const createOrderClaimsStep = createStep(
  createOrderClaimsStepId,
  async (data: CreateOrderClaimDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const orderClaims = await service.createOrderClaims(data)

    const claimIds = orderClaims.map((claim) => claim.id)

    return new StepResponse(orderClaims, claimIds)
  },
  async (claimIds, { container }) => {
    if (!claimIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteOrderClaims(claimIds)
  }
)
