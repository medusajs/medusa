import type {
  CreateCartDTO,
  ICartModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the carts to create.
 */
export type CreateCartsStepInput = CreateCartDTO[]

export const createCartsStepId = "create-carts"
/**
 * This step creates a cart.
 */
export const createCartsStep = createStep(
  createCartsStepId,
  async (data: CreateCartsStepInput, { container }) => {
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
