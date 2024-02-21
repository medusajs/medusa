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
      // TODO: add all the needed relations
      relations: ["items", "items.adjustments"],
    })

    // TODO: remove this when cart handles totals calculation
    cart.items = cart.items?.map((item) => {
      item.subtotal = item.unit_price

      return item
    })

    return new StepResponse(cart)
  }
)
