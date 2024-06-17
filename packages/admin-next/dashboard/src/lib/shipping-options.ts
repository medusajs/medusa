import { ShippingOptionDTO } from "@medusajs/types"

export function isReturnOption(shippingOption: ShippingOptionDTO) {
  return !!shippingOption.rules?.find(
    (r) =>
      r.attribute === "is_return" && r.value === "true" && r.operator === "eq"
  )
}

export function isOptionEnabledInStore(shippingOption: ShippingOptionDTO) {
  return !!shippingOption.rules?.find(
    (r) =>
      r.attribute === "enabled_in_store" &&
      r.value === "true" &&
      r.operator === "eq"
  )
}
