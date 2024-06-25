import { MedusaRequest } from "../../../types/routing"
import { refetchEntities, refetchEntity } from "../../utils/refetch-entity"
import {
  MedusaContainer,
  HttpTypes,
  TaxableItemDTO,
  ItemTaxLineDTO,
  TaxCalculationContext,
} from "@medusajs/types"
import { ModuleRegistrationName, calculateTaxTotal } from "@medusajs/utils"

export type RequestWithContext<T> = MedusaRequest<T> & {
  taxContext: {
    taxLineContext?: TaxCalculationContext
    taxInclusivityContext?: {
      automaticTaxes: boolean
      isTaxInclusive: boolean
    }
  }
}

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("product", idOrFilter, scope, fields)
}

export const maybeApplyStockLocationId = async (req: MedusaRequest, ctx) => {
  const withInventoryQuantity = req.remoteQueryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (!withInventoryQuantity) {
    return
  }

  const salesChannelId = req.filterableFields.sales_channel_id || []

  const entities = await refetchEntities(
    "sales_channel_location",
    { sales_channel_id: salesChannelId },
    req.scope,
    ["stock_location_id"]
  )

  return entities.map((entity) => entity.stock_location_id)
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

  const { isTaxInclusive } = req.taxContext.taxInclusivityContext
  const taxService = req.scope.resolve(ModuleRegistrationName.TAX)

  const taxRates = (await taxService.getTaxLines(
    products.map(asTaxItem).flat(),
    req.taxContext.taxLineContext
  )) as unknown as ItemTaxLineDTO[]

  const taxRatesAsMap = new Map<string, ItemTaxLineDTO[]>()
  taxRates.forEach((taxRate) => {
    if (!taxRatesAsMap.has(taxRate.line_item_id)) {
      taxRatesAsMap.set(taxRate.line_item_id, [])
    }

    taxRatesAsMap.get(taxRate.line_item_id)?.push(taxRate)
  })

  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      const taxRatesForVariant = taxRatesAsMap.get(variant.id) || []
      const { priceWithTax, priceWithoutTax } = getTaxPricesForVariant(
        variant,
        taxRatesForVariant,
        isTaxInclusive
      )

      ;(variant.calculated_price as any).calculated_amount_with_tax =
        priceWithTax
      ;(variant.calculated_price as any).calculated_amount_without_tax =
        priceWithoutTax
    })
  })
}

const getTaxPricesForVariant = (
  variant: HttpTypes.StoreProductVariant,
  taxRatesForVariant: ItemTaxLineDTO[],
  isTaxInclusive: boolean
) => {
  const tax = calculateTaxTotal({
    // TODO: See why rate is nullable in tax
    taxLines: taxRatesForVariant as any,
    taxableAmount: variant.calculated_price!.calculated_amount!,
    includesTax: isTaxInclusive,
  })

  const priceWithoutTax = isTaxInclusive
    ? tax.minus(variant.calculated_price!.calculated_amount!).abs().toNumber()
    : variant.calculated_price!.calculated_amount

  const priceWithTax = isTaxInclusive
    ? variant.calculated_price!.calculated_amount
    : tax.plus(variant.calculated_price!.calculated_amount!).abs().toNumber()

  return { priceWithTax, priceWithoutTax }
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
        product_name: product.title,
        product_categories: product.categories?.map((c) => c.name),
        product_category_id: product.categories?.[0]?.id,
        product_sku: variant.sku,
        product_type: product.type,
        product_type_id: product.type_id,
        quantity: 1,
        unit_price: variant.calculated_price.calculated_amount,
        currency_code: variant.calculated_price.currency_code,
      }
    })
    .filter((v) => !!v) as unknown as TaxableItemDTO[]
}
