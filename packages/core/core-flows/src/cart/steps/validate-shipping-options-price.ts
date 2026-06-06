import { isDefined, MedusaError } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the shipping options to validate.
 */
export type ValidateCartShippingOptionsPriceInput = {
  /**
   * The shipping option's details. Should have a `calculated_price.calculated_amount`
   * to be considered valid.
   */
  shippingOptions: any[]
}

export const validateCartShippingOptionsPriceStepId =
  "validate-cart-shipping-options"
/**
 * This step validates shipping options to ensure they have a price.
 * If not valid, the step throws an error.
 * 
 * @example
 * const data = validateCartShippingOptionsPriceStep({
 *   shippingOptions: [
 *     {
 *       id: "so_123",
 *     },
 *     {
 *       id: "so_321",
 *       calculated_price: {
 *         calculated_amount: 10,
 *       }
 *     }
 *   ]
 * })
 */
export const validateCartShippingOptionsPriceStep = createStep(
  "validate-cart-shipping-options-price",
  async (data: ValidateCartShippingOptionsPriceInput, { container }) => {
    const { shippingOptions = [] } = data
    const optionsMissingPrices: string[] = []

    for (const shippingOption of shippingOptions) {
      const { calculated_price, ...options } = shippingOption

      if (
        shippingOption?.id &&
        !isDefined(calculated_price?.calculated_amount)
      ) {
        optionsMissingPrices.push(options.id)
      }
    }

    if (optionsMissingPrices.length) {
      const ids = optionsMissingPrices.join(", ")

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Shipping options with IDs ${ids} do not have a price`
      )
    }

    return new StepResponse(void 0)
  }
)
