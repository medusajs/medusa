import { ShippingOptionDTO } from "@medusajs/types"

export function isReturnOption(shippingOption: ShippingOptionDTO) {
  return !!shippingOption.rules?.find(
    (r) =>
      r.attribute === "is_return" && r.value === true && r.operator === "eq"
  )
}
