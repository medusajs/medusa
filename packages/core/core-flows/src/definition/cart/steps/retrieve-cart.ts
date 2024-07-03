import { CartDTO, FindConfig, ICartModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  id: string
  config?: FindConfig<CartDTO>
}

export const retrieveCartStepId = "retrieve-cart"
export const retrieveCartStep = createStep(
  retrieveCartStepId,
  async (data: StepInput, { container }) => {
    const cartModuleService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const cart = await cartModuleService.retrieveCart(data.id, data.config)

    // TODO: remove this when cart handles totals calculation
    cart.items = cart.items?.map((item) => {
      item.subtotal = item.unit_price

      return item
    })

    // TODO: remove this when cart handles totals calculation
    cart.shipping_methods = cart.shipping_methods?.map((shipping_method) => {
      // TODO: should we align all amounts/prices fields to be unit_price?
      shipping_method.subtotal = shipping_method.amount

      return shipping_method
    })

    return new StepResponse(cart)
  }
)
