import type { ICartModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the shipping methods to remove.
 */
export interface RemoveShippingMethodFromCartStepInput {
  /**
   * The IDs of the shipping methods to remove.
   */
  shipping_method_ids: string[]
}

/**
 * The shipping methods removed from the cart, along with IDs of related records
 * that were removed.
 */
export type RemoveShippingMethodFromCartStepOutput = Record<
  string,
  string[]
> | void

export const removeShippingMethodFromCartStepId =
  "remove-shipping-method-to-cart-step"
/**
 * This step removes shipping methods from a cart.
 */
export const removeShippingMethodFromCartStep = createStep(
  removeShippingMethodFromCartStepId,
  async (data: RemoveShippingMethodFromCartStepInput, { container }) => {
    const cartService = container.resolve<ICartModuleService>(Modules.CART)

    if (!data?.shipping_method_ids?.length) {
      return new StepResponse(null, [])
    }

    const methods = await cartService.softDeleteShippingMethods(
      data.shipping_method_ids
    )

    return new StepResponse(
      methods as RemoveShippingMethodFromCartStepOutput,
      data.shipping_method_ids
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const cartService: ICartModuleService = container.resolve(Modules.CART)

    await cartService.restoreShippingMethods(ids)
  }
)
