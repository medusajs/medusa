import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cartId: string
}

export const retrieveCartStepId = "retrieve-cart"
export const retrieveCartStep = createStep(
  retrieveCartStepId,
  async (data: StepInput, { container }) => {
    const cartModuleService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const cart = await cartModuleService.retrieve(data.cartId, {
      relations: [
        "items",
        "items.adjustments",
        "shipping_methods",
        "shipping_methods.adjustments",
      ],
    })

    // TODO: remove this when cart handles totals calculation
    cart.items = cart.items?.map((item) => {
      item.subtotal = item.unit_price

      return item
    })

    cart.shipping_methods = cart.shipping_methods?.map((shipping_method) => {
      // TODO: should we align all amounts/prices to be unit_price?
      shipping_method.subtotal = shipping_method.amount

      return shipping_method
    })

    return new StepResponse(cart)
  }
)
