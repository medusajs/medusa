import { ICartModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "../../../../../modules-sdk/dist"

interface StepInput {
  cartIds: string[]
}

export const getCartsStepId = "validate-variants-exist"
export const getCartsStep = createStep(
  getCartsStepId,
  async (data: StepInput, { container }) => {
    const cartService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const carts = await cartService.list(
      {
        id: data.cartIds,
      },
      {
        select: ["id", "region_id", "currency_code"],
      }
    )

    return new StepResponse(carts)
  }
)
