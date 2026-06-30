import { ProductTypes } from "@medusajs/framework/types"

export interface OptionLinkChanges {
  linkPairs: ProductTypes.ProductOptionProductPair[]
  unlinkPairs: ProductTypes.ProductOptionProductPair[]
  expectedOptionIdsMap: Map<string, Set<string>>
}

/**
 * Computes the option link/unlink pairs needed when updating products with option_ids.
 * Also tracks which products have variant updates for validation filtering.
 */
export function computeOptionLinkChanges(
  data: Array<{ id: string; option_ids?: string[]; variants?: any }>,
  originalProducts: Array<{ id: string; options?: { id: string }[] }>
): OptionLinkChanges {
  const linkPairs: ProductTypes.ProductOptionProductPair[] = []
  const unlinkPairs: ProductTypes.ProductOptionProductPair[] = []
  const expectedOptionIdsMap = new Map<string, Set<string>>()

  for (const product of data) {
    if (!product.option_ids) {
      continue
    }

    const newOptionIds = new Set(product.option_ids)

    if (product.variants) {
      expectedOptionIdsMap.set(product.id, newOptionIds)
    }

    const existingOptionIds = new Set(
      originalProducts
        .find((p) => p.id === product.id)
        ?.options?.map((o) => o.id) ?? []
    )

    for (const optionId of newOptionIds) {
      if (!existingOptionIds.has(optionId)) {
        linkPairs.push({
          product_id: product.id,
          product_option_id: optionId,
        })
      }
    }

    for (const optionId of existingOptionIds) {
      if (!newOptionIds.has(optionId)) {
        unlinkPairs.push({
          product_id: product.id,
          product_option_id: optionId,
        })
      }
    }
  }

  return { linkPairs, unlinkPairs, expectedOptionIdsMap }
}
