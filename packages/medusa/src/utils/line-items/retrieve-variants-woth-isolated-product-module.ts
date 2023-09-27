import { ProductVariantDTO } from "@medusajs/types"

/**
 * Retrieve variants for generating line items when isolated product module flag is on.
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
      fields: ["id", "title", "thumbnail", "discountable", "is_giftcard"],
      variants: {
        fields: ["id", "title", "product_id", "metadata"],
      },
    },
  }

  const products = await remoteQuery(query)

  const variants: ProductVariantDTO[] = []

  products.forEach((product) => {
    variants.push(
      ...product.variants
        .filter((v) => variantIdsMap.has(v.id))
        .map((v) => {
          v.product = { ...product }
          return v
        })
    )
  })

  return variants
}
