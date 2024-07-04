import { ICartModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  shipping_method_ids: string[]
}

export const removeShippingMethodFromCartStepId =
  "remove-shipping-method-to-cart-step"
export const removeShippingMethodFromCartStep = createStep(
  removeShippingMethodFromCartStepId,
  async (data: StepInput, { container }) => {
    const cartService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const methods = await cartService.softDeleteShippingMethods(
      data.shipping_method_ids
    )

    return new StepResponse(methods, data.shipping_method_ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const cartService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    await cartService.restoreShippingMethods(ids)
  }
)
