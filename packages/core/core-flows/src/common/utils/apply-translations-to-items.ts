import { ProductVariantDTO } from "@medusajs/framework/types"

const VARIANT_PREFIX = "variant_"
const PRODUCT_PREFIX = "product_"
const PRODUCT_TYPE_PREFIX = "type_"
const PRODUCT_COLLECTION_PREFIX = "collection_"

const TRANSLATABLE_ITEM_PROP_PREFIXES = [
  VARIANT_PREFIX,
  PRODUCT_PREFIX,
  PRODUCT_TYPE_PREFIX,
  PRODUCT_COLLECTION_PREFIX,
]

const entityGetterPerPrefix = {
  [VARIANT_PREFIX]: (variant: ProductVariantDTO) => variant,
  [PRODUCT_PREFIX]: (variant: ProductVariantDTO) => variant.product!,
  [PRODUCT_TYPE_PREFIX]: (variant: ProductVariantDTO) => variant.product?.type!,
  [PRODUCT_COLLECTION_PREFIX]: (variant: ProductVariantDTO) =>
    variant.product?.collection!,
}

function applyTranslation(
  itemAny: Record<string, any>,
  translatedInput: Record<string, any>,
  key: string,
  translationKey: string
) {
  if (typeof itemAny[key] === typeof translatedInput?.[translationKey]) {
    itemAny[key] = translatedInput?.[translationKey]
  }
}

/**
 * Applies translated variant/product fields to line items.
 */
export function applyTranslationsToItems<
  T extends { variant_id?: string; [key: string]: any }
>(items: T[], variants: Partial<ProductVariantDTO>[]): T[] {
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]))

  return items.map((item) => {
    if (!item.variant_id) {
      return item
    }

    const variant = variantMap.get(item.variant_id)
    if (!variant) {
      return item
    }

    const itemAny = item as Record<string, any>

    Object.entries(itemAny).forEach(([key, value]) => {
      for (const prefix of TRANSLATABLE_ITEM_PROP_PREFIXES) {
        if (key.startsWith(prefix)) {
          const translationKey = key.replace(prefix, "")
          const entity = entityGetterPerPrefix[prefix](variant)
          if (!entity) {
            break
          }
          applyTranslation(itemAny, entity, key, translationKey)
        }
      }
      itemAny.title = item.product_title ?? item.title
    })

    return item
  })
}
