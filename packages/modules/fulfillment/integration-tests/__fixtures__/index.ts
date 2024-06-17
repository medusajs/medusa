import { generateCreateShippingOptionsData } from "./shipping-options"
import { generateCreateFulfillmentData } from "./fulfillment"
import { IFulfillmentModuleService } from "@medusajs/types"

export * from "./shipping-options"
export * from "./fulfillment"
export * from "./events"

export async function createFullDataStructure(
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
