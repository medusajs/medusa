import { CreateShippingOptionDTO } from "@medusajs/types"

export function generateCreateShippingOptionsData({
  name,
  service_zone_id,
  shipping_profile_id,
  provider_id,
  price_type,
  rules,
  type,
  data,
}: Omit<CreateShippingOptionDTO, "name" | "price_type" | "type"> & {
  price_type?: CreateShippingOptionDTO["price_type"]
  name?: string
  type?: CreateShippingOptionDTO["type"]
}): Required<CreateShippingOptionDTO> {
  const randomString = Math.random().toString(36).substring(7)

  return {
    service_zone_id: service_zone_id,
    shipping_profile_id: shipping_profile_id,
    provider_id: provider_id,
    type: type ?? {
      code: "test-type_" + randomString,
      description: "test-description_" + randomString,
      label: "test-label_" + randomString,
    },
    data: data ?? {
      amount: 1000,
    },
    name: name ?? Math.random().toString(36).substring(7),
    price_type: price_type ?? "flat",
    rules: rules ?? [
      {
        attribute: "weight",
        operator: "eq",
        value: "test",
      },
    ],
  }
}
