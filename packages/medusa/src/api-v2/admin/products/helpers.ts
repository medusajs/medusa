import { MedusaContainer, ProductDTO, ProductVariantDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

const isPricing = (fieldName: string) =>
  fieldName.startsWith("variants.prices") ||
  fieldName.startsWith("*variants.prices") ||
  fieldName.startsWith("prices") ||
  fieldName.startsWith("*prices")

// The variant had prices before, but that is not part of the price_set money amounts. Do we remap the request and response or not?
export const remapKeysForProduct = (selectFields: string[]) => {
  const productFields = selectFields.filter(
    (fieldName: string) => !isPricing(fieldName)
  )
  const pricingFields = selectFields
    .filter((fieldName: string) => isPricing(fieldName))
    .map((fieldName: string) =>
      fieldName.replace("variants.prices.", "variants.price_set.prices.")
    )

  return [...productFields, ...pricingFields]
}

export const remapKeysForVariant = (selectFields: string[]) => {
  const variantFields = selectFields.filter(
    (fieldName: string) => !isPricing(fieldName)
  )
  const pricingFields = selectFields
    .filter((fieldName: string) => isPricing(fieldName))
    .map((fieldName: string) =>
      fieldName.replace("prices.", "price_set.prices.")
    )

  return [...variantFields, ...pricingFields]
}

export const remapProductResponse = (product: ProductDTO) => {
  return {
    ...product,
    variants: product.variants?.map(remapVariantResponse),
  }
}

export const remapVariantResponse = (variant: ProductVariantDTO) => {
  if (!variant) {
    return variant
  }

  return {
    ...variant,
    prices: (variant as any).price_set?.prices?.map((price) => ({
      id: price.id,
      amount: price.amount,
      currency_code: price.currency_code,
      min_quantity: price.min_quantity,
      max_quantity: price.max_quantity,
      variant_id: variant.id,
      created_at: price.created_at,
      updated_at: price.updated_at,
    })),
    price_set: undefined,
  }
}

export const refetchProduct = async (
  productId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve("remoteQuery")
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: { id: productId },
    },
    fields: remapKeysForProduct(fields ?? []),
  })

  const products = await remoteQuery(queryObject)
  return products[0]
}
