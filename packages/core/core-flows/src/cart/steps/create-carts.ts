import { CreateCartDTO, ICartModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createCartsStepId = "create-carts"
/**
 * This step creates a cart.
 */
export const createCartsStep = createStep(
  createCartsStepId,
  async (data: CreateCartDTO[], { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

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

    const service = container.resolve<ICartModuleService>(Modules.CART)

    await service.deleteCarts(createdCartsIds)
  }
)
