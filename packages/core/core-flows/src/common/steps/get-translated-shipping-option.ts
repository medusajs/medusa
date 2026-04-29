import { applyTranslations } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ShippingOptionDTO } from "@medusajs/types"

export const getTranslatedShippingOptionsStepId =
  "get-translated-shipping-options"

export interface GetTranslatedShippingOptionsStepInput {
  /**
   * The shipping options to be translated.
   */
  shippingOptions: ShippingOptionDTO[]
  /**
   * The locale code following the [IETF BCP 47 standard](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1).
   */
  locale: string
}

/**
 * This step applies translations to a list of shipping options based on the provided locale.
 * It modifies the shipping options in place and returns them.
 *
 * @since 2.12.4
 *
 * @example
 * const translatedShippingOptions = getTranslatedShippingOptionsStep({
 *   shippingOptions: [
 *     {
 *       id: "so_123",
 *       name: "Standard Shipping",
 *       // ...
 *     }
 *   ],
 *   locale: "fr-FR"
 * })
 */
export const getTranslatedShippingOptionsStep = createStep(
  getTranslatedShippingOptionsStepId,
  async (data: GetTranslatedShippingOptionsStepInput, { container }) => {
    await applyTranslations({
      localeCode: data.locale,
      objects: data.shippingOptions,
      container,
    })

    return new StepResponse(data.shippingOptions)
  }
)
