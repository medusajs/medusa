import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateShippingMethodDTO, ICartModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  shipping_methods: CreateShippingMethodDTO[]
}

export const addShippingMethodToCartStepId = "add-shipping-method-to-cart-step"
export const addShippingMethodToCartStep = createStep(
  addShippingMethodToCartStepId,
  async (data: StepInput, { container }) => {
    const cartService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const methods = await cartService.addShippingMethods(data.shipping_methods)

    return new StepResponse(methods, methods)
  },
  async (methods, { container }) => {
    const cartService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )
    if (!methods?.length) {
      return
    }

    await cartService.deleteShippingMethods(methods.map((m) => m.id))
  }
)
