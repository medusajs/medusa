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
  const variables = {
    filters: {
      id: variantIds,
    },
  }

  const query = {
    variants: {
      __args: variables,
      fields: [
        "id",
        "title",
        "product_id",
        "metadata",
        "allow_backorder",
        "manage_inventory",
        "inventory_quantity",
      ],

      product: {
        fields: ["id", "title", "thumbnail", "discountable", "is_giftcard"],
      },
    },
  }

  return await remoteQuery(query)
}
