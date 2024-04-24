import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  MedusaContainer,
  MedusaPricingContext,
  PricingTypes,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isPresent,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { refetchEntity } from "../../utils/refetch-entity"
import { StoreGetProductsParamsType } from "./validators"

export async function wrapProductsWithPrices(
  products,
  container: MedusaContainer,
  pricingContext: MedusaPricingContext
) {
  if (!isPresent(pricingContext)) {
    return products
  }

  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const pricingModule = container.resolve(ModuleRegistrationName.PRICING)
  const variants = products.map((product) => product.variants).flat(1)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_variant_price_set",
    fields: ["variant_id", "price_set_id"],
    variables: {
      variant_id: variants.map((variantKeys) => variantKeys.id),
      take: null,
    },
  })

  const links = await remoteQuery(queryObject)

  const variantPriceSetMap: Record<string, string> = {}
  const priceSetCalculatedPriceMap: Record<
    string,
    PricingTypes.CalculatedPriceSet[]
  > = {}

  for (const link of links) {
    variantPriceSetMap[link.variant_id] = link.price_set_id
  }

  const calculatedPrices = await pricingModule.calculatePrices(
    { id: links.map((link) => link.price_set_id) },
    { context: pricingContext }
  )

  for (const calculatedPrice of calculatedPrices) {
    priceSetCalculatedPriceMap[calculatedPrice.id] = calculatedPrice
  }

  for (const product of products) {
    for (const variant of product.variants || []) {
      const priceSetId = variantPriceSetMap[variant.id]

      variant.price = priceSetCalculatedPriceMap[priceSetId] || null
    }
  }

  return products
}

// For category filters, we only allow showcasing public and active categories
// TODO: This should ideally be done in the middleware, write a generic
export function wrapWithCategoryFilters(filters: StoreGetProductsParamsType) {
  const categoriesFilter = isPresent(filters.category_id)
    ? {
        categories: {
          ...filters.category_id,
          is_internal: false,
          is_active: true,
        },
      }
    : {}

  delete filters.category_id

  return {
    ...filters,
    ...categoriesFilter,
  }
}

export const refetchProduct = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("product", id, scope, fields)
}
