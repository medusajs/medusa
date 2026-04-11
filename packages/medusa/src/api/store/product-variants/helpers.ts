import {
  HttpTypes,
  ItemTaxLineDTO,
  TaxableItemDTO,
} from "@medusajs/framework/types"
import {
  calculateAmountsWithTax,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import { StoreRequestWithContext } from "../types"
import { applyTranslationsToTaxLines } from "@medusajs/framework/utils"
import TranslationFeatureFlag from "../../../feature-flags/translation"

export const wrapVariantsWithTaxPrices = async <T>(
  req: StoreRequestWithContext<T>,
  variants: HttpTypes.StoreProductVariant[]
) => {
  if (
    !req.taxContext?.taxInclusivityContext ||
    !req.taxContext?.taxLineContext
  ) {
    return
  }

  if (!variants?.length) {
    return
  }

  const items = variants
    .map(asTaxItem)
    .filter((item) => !!item) as TaxableItemDTO[]

  if (!items.length) {
    return
  }

  const taxService = req.scope.resolve(Modules.TAX)

  let taxLines = (await taxService.getTaxLines(
    items,
    req.taxContext.taxLineContext
  )) as unknown as ItemTaxLineDTO[]

  const isTranslationEnabled = FeatureFlag.isFeatureEnabled(
    TranslationFeatureFlag.key
  )
  if (isTranslationEnabled) {
    taxLines = (await applyTranslationsToTaxLines(
      taxLines,
      req.locale,
      req.scope
    )) as ItemTaxLineDTO[]
  }

  const taxRatesMap = new Map<string, ItemTaxLineDTO[]>()

  taxLines.forEach((taxLine) => {
    if (!taxRatesMap.has(taxLine.line_item_id)) {
      taxRatesMap.set(taxLine.line_item_id, [])
    }

    taxRatesMap.get(taxLine.line_item_id)!.push(taxLine)
  })

  variants.forEach((variant) => {
    if (!variant.calculated_price) {
      return
    }

    const taxRatesForVariant = taxRatesMap.get(variant.id) || []

    const { priceWithTax, priceWithoutTax } = calculateAmountsWithTax({
      taxLines: taxRatesForVariant,
      amount: variant.calculated_price.calculated_amount!,
      includesTax: variant.calculated_price.is_calculated_price_tax_inclusive!,
    })

    variant.calculated_price.calculated_amount_with_tax = priceWithTax
    variant.calculated_price.calculated_amount_without_tax = priceWithoutTax

    const {
      priceWithTax: originalPriceWithTax,
      priceWithoutTax: originalPriceWithoutTax,
    } = calculateAmountsWithTax({
      taxLines: taxRatesForVariant,
      amount: variant.calculated_price.original_amount!,
      includesTax: variant.calculated_price.is_original_price_tax_inclusive!,
    })

    variant.calculated_price.original_amount_with_tax = originalPriceWithTax
    variant.calculated_price.original_amount_without_tax =
      originalPriceWithoutTax
  })
}

const asTaxItem = (variant: HttpTypes.StoreProductVariant) => {
  if (!variant.calculated_price) {
    return
  }

  const productId = variant.product_id ?? variant.product?.id
  if (!productId) {
    return
  }

  return {
    id: variant.id,
    product_id: productId,
    product_type_id: variant.product?.type_id ?? undefined,
    quantity: 1,
    unit_price: variant.calculated_price.calculated_amount,
    currency_code: variant.calculated_price.currency_code,
  }
}
