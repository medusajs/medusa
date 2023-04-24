import { Address } from "@medusajs/medusa"
import { AddressCreatePayload } from "@medusajs/medusa/dist/types/common"

export const addressToAddressPayload = (
  address?: Address
): AddressCreatePayload | null => {
  if (!address) {
    return null
  }

  const addressPayload = [
    "first_name",
    "last_name",
    "phone",
    "metadata",
    "company",
    "address_1",
    "address_2",
    "city",
    "country_code",
    "province",
    "postal_code",
  ].reduce((acc, curr) => {
    acc[curr] = address[curr] || (curr === "metadata" ? {} : "")
    return acc
  }, {} as AddressCreatePayload)

  return addressPayload
}
