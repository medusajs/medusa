import { addShippingMethodToCartWorkflow } from "@medusajs/core-flows"
import {
  AdminInventoryItem,
  AdminProduct,
  AdminShippingProfile,
  AdminStockLocation,
  MedusaContainer,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/utils"
import {
  adminHeaders,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"

export async function createOrderSeeder({
  api,
  container,
  storeHeaderOverride,
  productOverride,
  additionalProducts,
  stockChannelOverride,
  inventoryItemOverride,
  shippingProfileOverride,
  withoutShipping,
}: {
  api: any
  container: MedusaContainer
  storeHeaderOverride?: any
  productOverride?: AdminProduct
  stockChannelOverride?: AdminStockLocation
  additionalProducts?: { variant_id: string; quantity: number }[]
  inventoryItemOverride?: AdminInventoryItem
  shippingProfileOverride?: AdminShippingProfile | AdminShippingProfile[]
  withoutShipping?: boolean
}) {
  const publishableKey = await generatePublishableKey(container)

  const shippingProfileOverrideArray = !shippingProfileOverride
    ? undefined
    : Array.isArray(shippingProfileOverride)
    ? shippingProfileOverride
    : [shippingProfileOverride]

  const storeHeaders =
    storeHeaderOverride ??
    generateStoreHeaders({
      publishableKey,
    })

  const region = (
    await api.post(
      "/admin/regions",
      { name: "Test region", currency_code: "usd" },
      adminHeaders
    )
  ).data.region

  const salesChannel = (
    await api.post(
      "/admin/sales-channels",
      { name: "first channel", description: "channel" },
      adminHeaders
    )
  ).data.sales_channel

  const stockLocation =
    stockChannelOverride ??
    (
      await api.post(
        `/admin/stock-locations`,
        { name: "test location" },
        adminHeaders
      )
    ).data.stock_location

  const inventoryItem =
    inventoryItemOverride ??
    (
      await api.post(
        `/admin/inventory-items`,
        { sku: "test-variant" },
        adminHeaders
      )
    ).data.inventory_item

  await api.post(
    `/admin/inventory-items/${inventoryItem.id}/location-levels`,
    {
      location_id: stockLocation.id,
      stocked_quantity: 10,
    },
    adminHeaders
  )

  await api.post(
    `/admin/stock-locations/${stockLocation.id}/sales-channels`,
    { add: [salesChannel.id] },
    adminHeaders
  )

  const shippingProfile =
    shippingProfileOverrideArray?.[0] ??
    (
      await api.post(
        `/admin/shipping-profiles`,
        { name: `test-${stockLocation.id}`, type: "default" },
        adminHeaders
      )
    ).data.shipping_profile

  const product =
    productOverride ??
    (
      await api.post(
        "/admin/products",
        {
          title: `Test fixture ${shippingProfile.id}`,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: withoutShipping ? undefined : shippingProfile.id,
          options: [
            { title: "size", values: ["large", "small"] },
            { title: "color", values: ["green"] },
          ],
          variants: [
            {
              title: "Test variant",
              sku: "test-variant",
              inventory_items: [
                {
                  inventory_item_id: inventoryItem.id,
                  required_quantity: 1,
                },
              ],
              prices: [
                {
                  currency_code: "usd",
                  amount: 100,
                },
              ],
              options: {
                size: "large",
                color: "green",
              },
            },
          ],
        },
        adminHeaders
      )
    ).data.product

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
        geo_zones: [{ type: "country", country_code: "us" }],
      },
      adminHeaders
    )
  ).data.fulfillment_set

  await api.post(
    `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
    { add: ["manual_test-provider"] },
    adminHeaders
  )

  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
  await remoteLink.create([
    {
      [Modules.SALES_CHANNEL]: {
        sales_channel_id: salesChannel.id,
      },
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
    },
    {
      [Modules.PRODUCT]: {
        variant_id: product.variants[0].id,
      },
      [Modules.INVENTORY]: {
        inventory_item_id: inventoryItem.id,
      },
    },
  ])

  /**
   * Create shipping options for each shipping profile provided
   */
  const shippingOptions = await Promise.all(
    (shippingProfileOverrideArray || [shippingProfile]).map(async (sp) => {
      return (
        await api.post(
          `/admin/shipping-options`,
          {
            name: `Test shipping option ${fulfillmentSet.id}`,
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: sp.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [
              { currency_code: "usd", amount: 1000 },
              { region_id: region.id, amount: 1100 },
            ],
            rules: [],
          },
          adminHeaders
        )
      ).data.shipping_option
    })
  )

  const shippingOption = shippingOptions[0]

  const cart = (
    await api.post(
      `/store/carts`,
      {
        currency_code: "usd",
        email: "tony@stark-industries.com",
        region_id: region.id,
        shipping_address: {
          address_1: "test address 1",
          address_2: "test address 2",
          city: "ny",
          country_code: "us",
          province: "ny",
          postal_code: "94016",
        },
        billing_address: {
          address_1: "test billing address 1",
          address_2: "test billing address 2",
          city: "ny",
          country_code: "us",
          province: "ny",
          postal_code: "94016",
        },
        sales_channel_id: salesChannel.id,
        items: [
          { quantity: 1, variant_id: product.variants[0].id },
          ...(additionalProducts || []),
        ],
      },
      storeHeaders
    )
  ).data.cart

  if (!withoutShipping) {
    // Create shipping methods for each shipping option so shipping profiles of products in the cart are supported
    await addShippingMethodToCartWorkflow(container).run({
      input: {
        cart_id: cart.id,
        options: shippingOptions.map((so) => ({ id: so.id })),
      },
    })
  }

  const paymentCollection = (
    await api.post(
      `/store/payment-collections`,
      {
        cart_id: cart.id,
      },
      storeHeaders
    )
  ).data.payment_collection

  await api.post(
    `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
    { provider_id: "pp_system_default" },
    storeHeaders
  )

  let order = (
    await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
  ).data.order

  order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data.order

  return {
    order,
    region,
    salesChannel,
    stockLocation,
    inventoryItem,
    shippingProfile,
    product,
    fulfillmentSets,
    fulfillmentSet,
    shippingOption,
    cart,
    paymentCollection,
  }
}
