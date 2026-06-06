import { MedusaError } from "@zjedene-medusa/framework/utils"
import {
  CartLineItemDTO,
  CartWorkflowDTO,
  ProductVariantDTO,
  ShippingOptionDTO,
} from "@zjedene-medusa/framework/types"
import { createStep, StepResponse } from "@zjedene-medusa/workflows-sdk"

/**
 * The data to validate shipping data when cart is completed.
 */
export type ValidateShippingInput = {
  /**
   * The cart's details.
   */
  cart: Omit<CartWorkflowDTO, "items"> & {
    /**
     * The cart's line items.
     */
    items: (CartLineItemDTO & {
      /**
       * The item's variant.
       */
      variant: ProductVariantDTO
    })[]
  }
  /**
   * The selected shipping options.
   */
  shippingOptions: ShippingOptionDTO[]
}

export const validateShippingStepId = "validate-shipping"
/**
 * This step validates shipping data when cart is completed.
 *
 * It ensures that a shipping method is selected if there is an item in the cart that requires shipping.
 * It also ensures that product's shipping profile mathes the selected shipping options. If the
 * conditions are not met, an error is thrown.
 *
 * :::note
 *
 * You can retrieve cart or shipping option's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * validateShippingStep({
 *   cart: {
 *     id: "cart_123",
 *     items: [
 *       {
 *         id: "item_123",
 *         variant: {
 *           id: "variant_123",
 *           // other item details...
 *         },
 *       }
 *     ],
 *     // other cart details...
 *   },
 *   shippingOptions: [
 *     {
 *       id: "option_123",
 *       shipping_profile_id: "sp_123",
 *       // other option details...
 *     }
 *   ]
 * })
 */
export const validateShippingStep = createStep(
  validateShippingStepId,
  async (data: ValidateShippingInput) => {
    const { cart, shippingOptions } = data

    const optionProfileMap: Map<string, string> = new Map(
      shippingOptions.map((option) => [option.id, option.shipping_profile_id])
    )

    const cartItemsWithShipping =
      cart.items?.filter((item) => item.requires_shipping) || []

    const cartShippingMethods = cart.shipping_methods || []

    if (cartItemsWithShipping.length > 0 && cartShippingMethods.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No shipping method selected but the cart contains items that require shipping."
      )
    }

    const requiredShippingPorfiles = cartItemsWithShipping.map(
      (item) => (item.variant.product as any)?.shipping_profile?.id
    )

    const availableShippingPorfiles = cartShippingMethods.map((method) =>
      optionProfileMap.get(method.shipping_option_id!)
    )

    const missingShippingPorfiles = requiredShippingPorfiles.filter(
      (profile) => !availableShippingPorfiles.includes(profile)
    )

    if (missingShippingPorfiles.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The cart items require shipping profiles that are not satisfied by the current shipping methods"
      )
    }

    return new StepResponse(void 0)
  }
)
