import { ProductDTO, ProductVariantDTO } from "@medusajs/types"

// The variant had prices before, but that is not part of the price_set money amounts. Do we remap the request and response or not?
export const remapKeysForProduct = (selectFields: string[]) => {
  const productFields = selectFields.filter(
    (fieldName: string) => !fieldName.startsWith("variants.prices")
  )
  const pricingFields = selectFields
    .filter((fieldName: string) => fieldName.startsWith("variants.prices"))
    .map((fieldName: string) =>
      fieldName.replace(
        "variants.prices.",
        "variants.price_set.price_set_money_amounts.money_amount."
      )
    )

  return [...productFields, ...pricingFields]
}

export const remapKeysForVariant = (selectFields: string[]) => {
  const variantFields = selectFields.filter(
    (fieldName: string) => !fieldName.startsWith("prices")
  )
  const pricingFields = selectFields
    .filter((fieldName: string) => fieldName.startsWith("prices"))
    .map((fieldName: string) =>
      fieldName.replace(
        "prices.",
        "price_set.price_set_money_amounts.money_amount."
      )
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
      ...psma.money_amount,
      variant_id: v.id,
    })),
    price_set: undefined,
  }
}
