import { ItemTaxLineDTO, ShippingTaxLineDTO } from "@medusajs/framework/types"
import {
  applyTranslationsToTaxLines,
  FeatureFlag,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
export const getTranslatedTaxLinesStepId = "get-translated-tax-lines-step"

export interface GetTranslatedTaxLinesStepInput {
  /**
   * The item tax lines to be translated.
   */
  itemTaxLines: ItemTaxLineDTO[]
  /**
   * The shipping tax lines to be translated.
   */
  shippingTaxLines: ShippingTaxLineDTO[]
  /**
   * The locale code following the [IETF BCP 47 standard](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1).
   */
  locale: string
}

/**
 * This step retrieves translated tax lines for both item and shipping tax lines based on the provided locale.
 * It returns the translated tax lines in a structured format.
 * 
 * @since 2.13.0
 * 
 * @example
 * const translatedTaxLines = getTranslatedTaxLinesStep({
 *   itemTaxLines: [
 *     {
 *       line_item_id: "li_123",
 *       name: "VAT",
 *       // ...
 *     }
 *   ],
 *   shippingTaxLines: [
 *    {
 *       shipping_method_id: "sm_123",
 *       name: "GST",
 *       // ...
 *    }
 *  ],
 *  locale: "fr-FR"
 * })
 */
export const getTranslatedTaxLinesStep = createStep(
  getTranslatedTaxLinesStepId,
  async (
    { itemTaxLines, shippingTaxLines, locale }: GetTranslatedTaxLinesStepInput,
    { container }
  ) => {
    const isTranslationEnabled = FeatureFlag.isFeatureEnabled("translation")

    if (!isTranslationEnabled) {
      return new StepResponse({
        itemTaxLines,
        shippingTaxLines,
      })
    }

    const [translatedItemTaxLines, translatedShippingTaxLines] =
      await Promise.all([
        applyTranslationsToTaxLines(itemTaxLines, locale, container),
        applyTranslationsToTaxLines(shippingTaxLines, locale, container),
      ])

    return new StepResponse({
      itemTaxLines: translatedItemTaxLines,
      shippingTaxLines: translatedShippingTaxLines,
    })
  }
)
