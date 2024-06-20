import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateCartDTO, ICartModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const createCartsStepId = "create-carts"
export const createCartsStep = createStep(
  createCartsStepId,
  async (data: CreateCartDTO[], { container }) => {
    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const createdCarts = await service.createCarts(data)

    return new StepResponse(
      createdCarts,
      createdCarts.map((cart) => cart.id)
    )
  },
  async (createdCartsIds, { container }) => {
    if (!createdCartsIds?.length) {
      return
    }

    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    await service.deleteCarts(createdCartsIds)
  }
)
