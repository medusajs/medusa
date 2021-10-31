const {
  ShippingOption,
  ShippingProfile,
  Region,
  FulfillmentProvider,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetShippingProfilesShippingProfile",
  buildEndpoint: (id) => `/admin/shipping-profiles/${id}`,
  setup: async (manager) => {
    const newProfile = await manager.create(ShippingProfile, {
      name: "shipping_profile_name",
      type: "default"
    })
    await manager.save(newProfile)
    console.log(newProfile)
    return newProfile.id
  },
  snapshotMatch: {
    shipping_profile: {
      id: expect.stringMatching(/^sp_*/),
      type: expect.stringMatching("default"),
      name: expect.stringMatching("shipping_profile_name"),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
