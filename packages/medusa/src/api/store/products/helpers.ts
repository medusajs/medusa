import { refetchEntity } from "@medusajs/framework/http"
import {
  HttpTypes,
  ItemTaxLineDTO,
  MedusaContainer,
  TaxableItemDTO,
} from "@medusajs/framework/types"
import {
  applyTranslationsToTaxLines,
  calculateAmountsWithTax,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import { StoreRequestWithContext } from "../types"
import TranslationFeatureFlag from "../../../feature-flags/translation"

export type RequestWithContext<
  Body,
  QueryFields = Record<string, unknown>
> = StoreRequestWithContext<Body, QueryFields>

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity({ entity: "product", idOrFilter, scope, fields })
}

export const filterOutInternalProductCategories = (
  products: HttpTypes.StoreProduct[]
) => {
  return products.forEach((product: HttpTypes.StoreProduct) => {
    if (!product.categories) {
      return
    }

    product.categories = product.categories.filter(
      (category) =>
        !(category as HttpTypes.StoreProductCategory & { is_internal: boolean })
          .is_internal
    )
  })
}

export const wrapProductsWithTaxPrices = async <T>(
  req: RequestWithContext<T>,
  products: HttpTypes.StoreProduct[]
) => {
  // If we are missing the necessary context, we can't calculate the tax, so only `calculated_amount` will be available
  if (
    !req.taxContext?.taxInclusivityContext ||
    !req.taxContext?.taxLineContext
  ) {
    return
  }

  // If automatic taxes are not enabled, we should skip calculating any tax
  if (!req.taxContext.taxInclusivityContext.automaticTaxes) {
    return
  }

  const taxService = req.scope.resolve(Modules.TAX)

  let taxLines = (await taxService.getTaxLines(
    products.map(asTaxItem).flat(),
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
  taxLines.forEach((taxRate) => {
    if (!taxRatesMap.has(taxRate.line_item_id)) {
      taxRatesMap.set(taxRate.line_item_id, [])
    }

    taxRatesMap.get(taxRate.line_item_id)?.push(taxRate)
  })

  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      if (!variant.calculated_price) {
        return
      }

      const taxRatesForVariant = taxRatesMap.get(variant.id) || []
      const { priceWithTax, priceWithoutTax } = calculateAmountsWithTax({
        taxLines: taxRatesForVariant,
        amount: variant.calculated_price!.calculated_amount!,
        includesTax:
          variant.calculated_price!.is_calculated_price_tax_inclusive!,
      })

      variant.calculated_price.calculated_amount_with_tax = priceWithTax
      variant.calculated_price.calculated_amount_without_tax = priceWithoutTax

      const {
        priceWithTax: originalPriceWithTax,
        priceWithoutTax: originalPriceWithoutTax,
      } = calculateAmountsWithTax({
        taxLines: taxRatesForVariant,
        amount: variant.calculated_price!.original_amount!,
        includesTax: variant.calculated_price!.is_original_price_tax_inclusive!,
      })

      variant.calculated_price.original_amount_with_tax = originalPriceWithTax
      variant.calculated_price.original_amount_without_tax =
        originalPriceWithoutTax
    })
  })
}

const asTaxItem = (product: HttpTypes.StoreProduct): TaxableItemDTO[] => {
  return product.variants
    ?.map((variant) => {
      if (!variant.calculated_price) {
        return
      }

      return {
        id: variant.id,
        product_id: product.id,
        product_type_id: product.type_id,
        quantity: 1,
        unit_price: variant.calculated_price.calculated_amount,
        currency_code: variant.calculated_price.currency_code,
      }
    })
    .filter((v) => !!v) as unknown as TaxableItemDTO[]
}
