import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"

export function isReturnOption(shippingOption: HttpTypes.AdminShippingOption) {
  return !!shippingOption.rules?.find(
    (r) =>
      r.attribute === "is_return" && r.value === "true" && r.operator === "eq"
  )
}

export function isOptionEnabledInStore(
  shippingOption: HttpTypes.AdminShippingOption
) {
  return !!shippingOption.rules?.find(
    (r) =>
      r.attribute === "enabled_in_store" &&
      r.value === "true" &&
      r.operator === "eq"
  )
}

/**
 * Return a name for the shipping option location or generate one based on the locations address
 */
export function getFormattedShippingOptionLocationName(
  shippingOption: HttpTypes.AdminShippingOption,
  t: TFunction
) {
  const location = shippingOption.service_zone.fulfillment_set.location

  if (!location) {
    return t("general.notAvailable")
  }

  if (location.name) {
    return `${location.name}`
  }

  let name = ""

  if (location.address) {
    if (location.address.address_1) {
      name += `${location.address.address_1}`
    }

    if (location.address.address_2) {
      name += `${location.address.address_2}`
    }

    if (location.address.city) {
      name += `${location.address.city}`
    }

    if (location.address.postal_code) {
      name += `${location.address.postal_code}`
    }

    if (location.address.country_code) {
      name += `, ${location.address.country_code}`
    }
  }

  return name || t("general.notAvailable")
}
