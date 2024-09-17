import { CreateShippingMethodDTO, ICartModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface AddShippingMethodToCartStepInput {
  shipping_methods: CreateShippingMethodDTO[]
}

export const addShippingMethodToCartStepId = "add-shipping-method-to-cart-step"
/**
 * This step adds shipping methods to a cart.
 */
export const addShippingMethodToCartStep = createStep(
  addShippingMethodToCartStepId,
  async (data: AddShippingMethodToCartStepInput, { container }) => {
    const cartService = container.resolve<ICartModuleService>(Modules.CART)

    const methods = await cartService.addShippingMethods(data.shipping_methods)

    return new StepResponse(methods, methods)
  },
  async (methods, { container }) => {
    const cartService: ICartModuleService = container.resolve(Modules.CART)
    if (!methods?.length) {
      return
    }

    await cartService.deleteShippingMethods(methods.map((m) => m.id))
  }
)
