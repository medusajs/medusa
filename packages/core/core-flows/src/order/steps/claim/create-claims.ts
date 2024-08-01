import { CreateOrderClaimDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateOrderClaimsStepInput = CreateOrderClaimDTO[]

export const createOrderClaimsStepId = "create-order-claims"
export const createOrderClaimsStep = createStep(
  createOrderClaimsStepId,
  async (data: CreateOrderClaimsStepInput, { container }) => {
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
