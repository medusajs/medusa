import {
  AdminShippingProfile,
  AdminStockLocation,
  AdminSalesChannel,
  MedusaContainer,
} from "@zjedene-medusa/types"
import { adminHeaders } from "../../../helpers/create-admin-user"

export async function createShippingOptionSeeder({
  api,
  container,
  salesChannelOverride,
  stockLocationOverride,
  shippingProfileOverride,
  countries = ["us"],
}: {
  api: any
  container: MedusaContainer
  salesChannelOverride?: AdminSalesChannel
  stockLocationOverride?: AdminStockLocation
  shippingProfileOverride?: AdminShippingProfile
  countries?: string[]
}) {
  const salesChannel =
    salesChannelOverride ??
    (
      await api.post(
        "/admin/sales-channels",
        { name: "first channel", description: "channel" },
        adminHeaders
      )
    ).data.sales_channel

  const stockLocation =
    stockLocationOverride ??
    (
      await api.post(
        `/admin/stock-locations`,
        { name: "test location" },
        adminHeaders
      )
    ).data.stock_location

  await api.post(
    `/admin/stock-locations/${stockLocation.id}/sales-channels`,
    { add: [salesChannel.id] },
    adminHeaders
  )

  const shippingProfile =
    shippingProfileOverride ??
    (
      await api.post(
        `/admin/shipping-profiles`,
        { name: `test-${stockLocation.id}`, type: "default" },
        adminHeaders
      )
    ).data.shipping_profile

  const fulfillmentSets = (
    await api.post(
      `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
      {
        name: `Test-${shippingProfile.id}`,
        type: "test-type",
      },
      adminHeaders
    )
  ).data.stock_location.fulfillment_sets

  const fulfillmentSet = (
    await api.post(
      `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
      {
        name: `Test-${shippingProfile.id}`,
        geo_zones: countries.map((country) => ({
          type: "country",
          country_code: country,
        })),
      },
      adminHeaders
    )
  ).data.fulfillment_set

  await api.post(
    `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
    { add: ["manual_test-provider"] },
    adminHeaders
  )

  const shippingOption = (
    await api.post(
      `/admin/shipping-options?fields=+service_zone.fulfillment_set.*,service_zone.geo_zones.*,service_zone.fulfillment_set.location*`,
      {
        name: `Test shipping option ${fulfillmentSet.id}`,
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        provider_id: "manual_test-provider",
        price_type: "flat",
        type: {
          label: "Test type",
          description: "Test description",
          code: "test-code",
        },
        prices: [{ currency_code: "usd", amount: 1000 }],
        rules: [],
      },
      adminHeaders
    )
  ).data.shipping_option

  return {
    salesChannel,
    stockLocation,
    shippingProfile,
    fulfillmentSet,
    shippingOption,
  }
}
