import type { CartWorkflowDTO } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the validate cart tax country step.
 *
 * @since 2.23.0
 */
export interface ValidateCartTaxCountryStepInput {
  /**
   * The cart to validate.
   */
  cart: CartWorkflowDTO
}

/**
 * The ID of the validate cart tax country step.
 *
 * @since 2.23.0
 */
export const validateCartTaxCountryStepId = "validate-cart-tax-country"
/**
 * This step validates that the shipping address of a cart whose region calculates
 * taxes automatically has a country before completing the cart and placing an order.
 * If the region has countries, and the cart has taxable items or shipping methods
 * and a shipping address without a country, the step throws an error.
 *
 * @example
 * validateCartTaxCountryStep({
 *   cart
 * })
 *
 * @since 2.23.0
 */
export const validateCartTaxCountryStep = createStep(
  validateCartTaxCountryStepId,
  async (data: ValidateCartTaxCountryStepInput) => {
    const { cart } = data

    const isTaxable =
      !!cart.shipping_methods?.length ||
      !!cart.items?.some((item) => !item.is_giftcard)

    if (
      cart.region?.automatic_taxes &&
      cart.region.countries?.length &&
      isTaxable &&
      cart.shipping_address &&
      !cart.shipping_address.country_code
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot complete a cart whose shipping address has no country, as it's required to calculate taxes`
      )
    }

    return new StepResponse(void 0)
  }
)
