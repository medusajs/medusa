import { ProductVariantDTO } from "@medusajs/types"

import { defaultStoreProductRemoteQueryObject } from "../api"

/**
 * Temp util for fetching variants needed for line item generation when isolated product module is on.
 *
 * @param remoteQuery
 * @param variantIds
 */
export async function retrieveVariantsWithIsolatedProductModule(
  remoteQuery,
  variantIds: string[]
) {
  const variantIdsMap = new Map(variantIds.map((id) => [id, true]))

  const variables = {
    filters: {
      variants: {
        id: [...variantIds],
      },
    },
  }

  const query = {
    product: {
      __args: variables,
      ...defaultStoreProductRemoteQueryObject,
    },
  }

  const products = await remoteQuery(query)

  const variants: ProductVariantDTO[] = []

  products.forEach((product) => {
    product.profile_id = product.profile?.id
    variants.push(...product.variants.filter((v) => variantIdsMap.has(v.id)))
  })

  return variants
}
