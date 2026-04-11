import { applyTranslations } from "./apply-translations"
import {
  ItemTaxLineDTO,
  MedusaContainer,
  ShippingTaxLineDTO,
} from "@medusajs/types"

/**
 * Applies translations to tax lines. If you are using a tax provider that doesn't have TaxRates defined in the database,
 * you should apply the translations inside of your tax provider's `getTaxLines` method, using the `locale` provided in the context.
 *
 * @param taxLines - The tax lines to apply translations to.
 * @param locale - The locale to apply translations to.
 * @param container - The container to use for the translations.
 * @returns The tax lines with translations applied.
 */
export const applyTranslationsToTaxLines = async (
  taxLines: ItemTaxLineDTO[] | ShippingTaxLineDTO[],
  locale: string | undefined,
  container: MedusaContainer
) => {
  const translatedTaxRates = taxLines.map(
    (taxLine: ItemTaxLineDTO | ShippingTaxLineDTO) => ({
      id: taxLine.rate_id,
      name: taxLine.name,
    })
  )

  await applyTranslations({
    localeCode: locale,
    objects: translatedTaxRates,
    container,
  })

  const rateTranslationMap = new Map<string, string>()
  for (const translatedRate of translatedTaxRates) {
    if (!!translatedRate.id) {
      rateTranslationMap.set(translatedRate.id, translatedRate.name)
    }
  }

  for (const taxLine of taxLines) {
    if (taxLine.rate_id) {
      taxLine.name = rateTranslationMap.get(taxLine.rate_id)!
    }
  }

  return taxLines
}
