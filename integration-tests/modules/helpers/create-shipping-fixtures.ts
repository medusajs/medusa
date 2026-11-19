import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"

export const createShippingFixtures = async ({
  container,
  shippingOptionNames,
  amount = 500,
}: {
  container: MedusaContainer
  shippingOptionNames: string[]
  amount?: number
}) => {
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const region = await container.resolve(Modules.REGION).createRegions({
    name: "US",
    currency_code: "usd",
    countries: ["us"],
  })
  const salesChannel = await container
    .resolve(Modules.SALES_CHANNEL)
    .createSalesChannels({ name: "Webshop" })
  const stockLocation = await container
    .resolve(Modules.STOCK_LOCATION)
    .createStockLocations({ name: "Warehouse" })

  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const shippingProfile = await fulfillmentModule.createShippingProfiles({
    name: "Test",
    type: "default",
  })
  const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
    name: "Test",
    type: "test-type",
    service_zones: [
      {
        name: "Test",
        geo_zones: [{ type: "country", country_code: "us" }],
      },
    ],
  })
  const shippingOptions = await fulfillmentModule.createShippingOptions(
    shippingOptionNames.map((name) => ({
      name,
      service_zone_id: fulfillmentSet.service_zones[0].id,
      shipping_profile_id: shippingProfile.id,
      provider_id: "manual_test-provider",
      price_type: "flat" as const,
      type: { label: name, description: name, code: name },
    }))
  )

  const [product] = await container
    .resolve(Modules.PRODUCT)
    .createProducts([
      { title: "Test product", variants: [{ title: "Test variant" }] },
    ])

  const priceSets = await container.resolve(Modules.PRICING).createPriceSets(
    shippingOptions.map(() => ({
      prices: [{ amount, currency_code: "usd" }],
    }))
  )

  await remoteLink.create([
    {
      [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    },
    {
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    },
    {
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_test-provider",
      },
    },
    {
      [Modules.PRODUCT]: { product_id: product.id },
      [Modules.FULFILLMENT]: { shipping_profile_id: shippingProfile.id },
    },
    ...shippingOptions.map((option, i) => ({
      [Modules.FULFILLMENT]: { shipping_option_id: option.id },
      [Modules.PRICING]: { price_set_id: priceSets[i].id },
    })),
  ])

  return { region, salesChannel, shippingOptions, product }
}
