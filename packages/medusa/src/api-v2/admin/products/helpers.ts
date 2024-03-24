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
      fieldName.replace(
        "variants.prices.",
        "variants.price_set.price_set_money_amounts."
      )
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
      fieldName.replace("prices.", "price_set.price_set_money_amounts.")
    )

  return [...variantFields, ...pricingFields]
}

export const remapProduct = (p: ProductDTO) => {
  return {
    ...p,
    variants: p.variants?.map(remapVariant),
  }
}

export const remapVariant = (v: ProductVariantDTO) => {
  return {
    ...v,
    prices: (v as any).price_set?.price_set_money_amounts?.map((psma) => ({
      ...psma,
      variant_id: v.id,
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
