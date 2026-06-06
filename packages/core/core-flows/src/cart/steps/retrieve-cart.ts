import {
  CartDTO,
  FindConfig,
  ICartModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the cart to retrieve.
 */
export interface RetrieveCartStepInput {
  /**
   * The ID of the cart to retrieve.
   */
  id: string
  config?: FindConfig<CartDTO>
}

export const retrieveCartStepId = "retrieve-cart"
/**
 * This step retrieves a cart's details.
 */
export const retrieveCartStep = createStep(
  retrieveCartStepId,
  async (data: RetrieveCartStepInput, { container }) => {
    const cartModuleService = container.resolve<ICartModuleService>(
      Modules.CART
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
