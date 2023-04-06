import { Address } from "@medusajs/medusa"
import { AddressPayload } from "../components/templates/address-form"
import { isoAlpha2Countries } from "./countries"

const mapAddressToForm = (address: Address): AddressPayload => {
  return {
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    company: address.company,
    address_1: address.address_1 || "",
    address_2: address.address_2,
    city: address.city || "",
    province: address.province,
    postal_code: address.postal_code || "",
    country_code: {
      label: isoAlpha2Countries[address.country_code?.toUpperCase()] || "",
      value: address.country_code || "",
    },
    phone: address.phone,
  }
}

export default mapAddressToForm
