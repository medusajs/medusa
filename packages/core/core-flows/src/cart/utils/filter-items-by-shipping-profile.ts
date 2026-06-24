type ItemWithShippingProfile = {
  variant?:
    | {
        product?: { shipping_profile?: { id?: string } | null } | null
      }
    | null
}

/**
 * Returns the subset of cart/order items whose product is linked to the given
 * shipping profile. Used to project an item list to the items that actually
 * ship under a specific shipping option, so calculated-price providers only
 * see the items they will price.
 *
 * Items with no linked shipping profile are excluded (unprofiled products
 * aren't shippable in Medusa's link-module model). A falsy `shippingProfileId`
 * returns `[]` rather than the full list to fail closed.
 */
export const filterCartItemsByShippingProfile = <T extends ItemWithShippingProfile>(
  items: T[] | undefined | null,
  shippingProfileId: string | undefined | null
): T[] => {
  if (!items?.length || !shippingProfileId) {
    return []
  }

  return items.filter(
    (item) => item.variant?.product?.shipping_profile?.id === shippingProfileId
  )
}
