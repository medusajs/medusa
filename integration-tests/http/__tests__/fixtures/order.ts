import { adminHeaders } from "../../../helpers/create-admin-user"

export async function createOrderSeeder({ api }) {
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

  const stockLocation = (
    await api.post(
      `/admin/stock-locations`,
      { name: "test location" },
      adminHeaders
    )
  ).data.stock_location

  const inventoryItem = (
    await api.post(
      `/admin/inventory-items`,
      {
        sku: `12345-${stockLocation.id}`,
      },
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

  const shippingProfile = (
    await api.post(
      `/admin/shipping-profiles`,
      { name: `test-${stockLocation.id}`, type: "default" },
      adminHeaders
    )
  ).data.shipping_profile

  const product = (
    await api.post(
      "/admin/products",
      {
        title: `Test fixture ${shippingProfile.id}`,
        options: [
          { title: "size", values: ["large", "small"] },
          { title: "color", values: ["green"] },
        ],
        variants: [
          {
            title: "Test variant",
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

  const shippingOption = (
    await api.post(
      `/admin/shipping-options`,
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
        prices: [
          { currency_code: "usd", amount: 1000 },
          { region_id: region.id, amount: 1100 },
        ],
        rules: [],
      },
      adminHeaders
    )
  ).data.shipping_option

  const cart = (
    await api.post(`/store/carts`, {
      currency_code: "usd",
      email: "tony@stark-industries.com",
      shipping_address: {
        address_1: "test address 1",
        address_2: "test address 2",
        city: "ny",
        country_code: "us",
        province: "ny",
        postal_code: "94016",
      },
      sales_channel_id: salesChannel.id,
      items: [{ quantity: 1, variant_id: product.variants[0].id }],
    })
  ).data.cart

  const paymentCollection = (
    await api.post(`/store/payment-collections`, {
      cart_id: cart.id,
    })
  ).data.payment_collection

  await api.post(
    `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
    { provider_id: "pp_system_default" }
  )

  let order = (await api.post(`/store/carts/${cart.id}/complete`, {})).data
    .order

  order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data.order

  return order
}
