import { countryLookup } from "./countries"

/**
 * Formats a shipping or billing address using the postal code, city, province, and country name
 * @param shippingOrBillingAddress
 * @returns {string} Returns a formatted string of the address
 */
const formatAddress = (shippingOrBillingAddress) => {
  const postalCode = shippingOrBillingAddress.postal_code || ""
  const city = shippingOrBillingAddress.city || ""
  const province = shippingOrBillingAddress.province || ""
  const countryCode = shippingOrBillingAddress.country_code || ""
  const countryName = countryLookup(countryCode)

  const spaceIfProvince = province ? " " : ""
  return `${postalCode} ${city}${spaceIfProvince}${province}, ${countryName}`
}

export { formatAddress }
