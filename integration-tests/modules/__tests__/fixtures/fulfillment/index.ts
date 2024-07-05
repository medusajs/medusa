import {
  CreateFulfillmentDTO,
  CreateShippingOptionDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"

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
      first_name: "test-first-name_" + randomString,
      last_name: "test-last-name_" + randomString,
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

export async function setupFullDataFulfillmentStructure(
  service: IFulfillmentModuleService,
  {
    providerId,
  }: {
    providerId: string
  }
) {
  const randomString = Math.random().toString(36).substring(7)

  const shippingProfile = await service.createShippingProfiles({
    // generate random string
    name: "test_" + randomString,
    type: "default",
  })
  const fulfillmentSet = await service.create({
    name: "test_" + randomString,
    type: "test-type",
  })
  const serviceZone = await service.createServiceZones({
    name: "test_" + randomString,
    fulfillment_set_id: fulfillmentSet.id,
    geo_zones: [
      {
        type: "country",
        country_code: "US_" + randomString,
      },
    ],
  })

  const shippingOption = await service.createShippingOptions(
    generateCreateShippingOptionsData({
      provider_id: providerId,
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
    })
  )

  await service.createFulfillment(
    generateCreateFulfillmentData({
      provider_id: providerId,
      shipping_option_id: shippingOption.id,
    })
  )
}
