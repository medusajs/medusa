/**
 * Type definition for items that contain variant information with shipping profile data.
 * Used to type items when filtering by shipping profile.
 * 
 * @since 2.15.6
 */
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
 * 
 * @param items - Array of items to filter, each potentially containing variant and shipping profile information
 * @param shippingProfileId - The shipping profile ID to filter by
 * @returns Filtered array of items that match the specified shipping profile ID
 * 
 * @since 2.15.6
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
