const {
  ShippingOption,
  ShippingProfile,
  Region,
  FulfillmentProvider,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetShippingOptionsShippingOption",
  buildEndpoint: (id) => `/admin/shipping-options/${id}`,
  setup: async (manager) => {
    const defaultProfile = await manager.findOne(ShippingProfile, {
      type: "default",
    })

    const region = await manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      tax_rate: 0,
      payment_providers: [
        {
          id: "test-pay",
          is_installed: true,
        },
      ],
    })
    await manager.save(region)

    await manager.insert(FulfillmentProvider, {
      id: "test-ful",
      is_installed: true,
    })

    const shippingOption = await manager.create(ShippingOption, {
      name: "Standard Shipping",
      provider_id: "test-ful",
      region_id: region.id,
      profile_id: defaultProfile.id,
      price_type: "flat_rate",
      amount: 1000,
      data: {},
    })
    await manager.save(shippingOption)

    return shippingOption.id
  },
  snapshotMatch: {
    shipping_option: {
      id: expect.stringMatching(/^so_*/),
      region_id: expect.stringMatching(/^reg_/),
      profile_id: expect.stringMatching(/^sp_*/),
      name: expect.any(String),
      amount: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
