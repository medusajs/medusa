// TODO
const { Region } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetRegionsRegion",
  buildEndpoint: (id) => `/store/regions/${id}`,
  setup: async (manager) => {
    const region = manager.create(Region, {
      name: "Scandinavia",
      tax_rate: 0,
      currency_code: "dkk",
      countries: [{ iso_2: "dk" }, { iso_2: "se" }, { iso_2: "no" }],
      payment_providers: [{ id: "test-pay" }],
      fulfillment_providers: [{ id: "test-ful" }],
    })
    await manager.save(region)
    return region.id
  },
  snapshotMatch: {
      region: 
        {
          id: expect.stringMatching(/^reg_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          name:expect.any(String),
        }
  },
}
