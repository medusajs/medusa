import { CreateFulfillmentDTO } from "@medusajs/types"

export function generateCreateFulfillmentData(
  data: Partial<CreateFulfillmentDTO> & {
    provider_id: string
    shipping_option_id: string
  }
) {
  const randomString = Math.random().toString(36).substring(7)

  return {
    location_id: "test-location",
    packed_at: null,
    shipped_at: null,
    delivered_at: null,
    canceled_at: null,
    data: null,
    provider_id: data.provider_id,
    shipping_option_id: data.shipping_option_id,
    metadata: data.metadata ?? null,
    delivery_address: data.delivery_address ?? {
      address_1: "test-address_" + randomString,
      address_2: "test-address_" + randomString,
      city: "test-city_" + randomString,
      postal_code: "test-postal-code_" + randomString,
      country_code: "test-country-code_" + randomString,
      province: "test-province_" + randomString,
      phone: "test-phone_" + randomString,
      full_name: "test-full-name_" + randomString,
    },
    items: data.items ?? [
      {
        title: "test-title_" + randomString,
        sku: "test-sku_" + randomString,
        quantity: 1,
        barcode: "test-barcode_" + randomString,
      },
    ],
    labels: data.labels ?? [
      {
        tracking_number: "test-tracking-number_" + randomString,
        tracking_url: "test-tracking-url_" + randomString,
        label_url: "test-label-url_" + randomString,
      },
    ],
    order: data.order ?? {},
  }
}
