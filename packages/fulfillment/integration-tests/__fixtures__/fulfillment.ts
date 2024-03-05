import { CreateFulfillmentDTO } from "@medusajs/types"

export function generateCreateFulfillmentData(
  data: Partial<CreateFulfillmentDTO> & {
    provider_id: string
    shipping_option_id: string
  }
) {
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
      address_1: "test-address",
      address_2: "test-address",
      city: "test-city",
      postal_code: "test-postal-code",
      country_code: "test-country-code",
      province: "test-province",
      phone: "test-phone",
      full_name: "test-full-name",
    },
    items: data.items ?? [
      {
        title: "test-title",
        sku: "test-sku",
        quantity: 1,
        barcode: "test-barcode",
      },
    ],
    labels: data.labels ?? [
      {
        tracking_number: "test-tracking-number",
        tracking_url: "test-tracking-url",
        label_url: "test-label-url",
      },
    ],
    order: data.order ?? {},
  }
}
