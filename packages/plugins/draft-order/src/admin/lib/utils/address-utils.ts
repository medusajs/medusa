import { HttpTypes } from "@medusajs/types"

/**
 * Unlike the dashboard's `isSameAddress`, this also compares `phone` and
 * `company`, so a billing address that only differs by those fields is still
 * rendered separately from the shipping address.
 */
export function isSameAddress(
  a?: HttpTypes.AdminOrderAddress | null,
  b?: HttpTypes.AdminOrderAddress | null
) {
  if (!a || !b) {
    return false
  }

  return (
    a.first_name === b.first_name &&
    a.last_name === b.last_name &&
    a.address_1 === b.address_1 &&
    a.address_2 === b.address_2 &&
    a.city === b.city &&
    a.postal_code === b.postal_code &&
    a.province === b.province &&
    a.country_code === b.country_code &&
    a.phone === b.phone &&
    a.company === b.company
  )
}
