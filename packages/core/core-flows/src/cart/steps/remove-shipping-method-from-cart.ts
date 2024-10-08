import { ICartModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface RemoveShippingMethodFromCartStepInput {
  shipping_method_ids: string[]
}

export const removeShippingMethodFromCartStepId =
  "remove-shipping-method-to-cart-step"
/**
 * This step removes shipping methods from a cart.
 */
export const removeShippingMethodFromCartStep = createStep(
  removeShippingMethodFromCartStepId,
  async (data: RemoveShippingMethodFromCartStepInput, { container }) => {
    const cartService = container.resolve<ICartModuleService>(Modules.CART)

    const methods = await cartService.softDeleteShippingMethods(
      data.shipping_method_ids
    )

    return new StepResponse(methods, data.shipping_method_ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const cartService: ICartModuleService = container.resolve(Modules.CART)

    await cartService.restoreShippingMethods(ids)
  }
)
