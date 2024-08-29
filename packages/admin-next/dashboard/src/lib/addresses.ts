import { HttpTypes } from "@medusajs/types"

import { countries, getCountryByIso2 } from "./data/countries"

export const isSameAddress = (
  a: HttpTypes.AdminAddress | null,
  b: HttpTypes.AdminOrderAddress | null
) => {
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
    a.country_code === b.country_code
  )
}

export const getFormattedAddress = ({
  address,
}: {
  address?: HttpTypes.AdminOrderAddress | null
}) => {
  if (!address) {
    return []
  }

  const {
    first_name,
    last_name,
    company,
    address_1,
    address_2,
    city,
    postal_code,
    province,
    country_code,
  } = address

  const name = [first_name, last_name].filter(Boolean).join(" ")

  const formattedAddress: string[] = []

  if (name) {
    formattedAddress.push(name)
  }

  if (company) {
    formattedAddress.push(company)
  }

  if (address_1) {
    formattedAddress.push(address_1)
  }

  if (address_2) {
    formattedAddress.push(address_2)
  }

  const cityProvincePostal = [city, province, postal_code]
    .filter(Boolean)
    .join(" ")

  if (cityProvincePostal) {
    formattedAddress.push(cityProvincePostal)
  }

  if (country_code) {
    const country = getCountryByIso2(country_code)

    if (country) {
      formattedAddress.push(country.display_name)
    } else {
      formattedAddress.push(country_code.toUpperCase())
    }
  }

  return formattedAddress
}

export const getFormattedCountry = (countryCode: string | null | undefined) => {
  if (!countryCode) {
    return ""
  }

  const country = countries.find((c) => c.iso_2 === countryCode)
  return country ? country.display_name : countryCode
}
