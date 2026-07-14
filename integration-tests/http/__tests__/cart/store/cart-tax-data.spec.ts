import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer

    beforeAll(async () => {
      appContainer = getContainer()
    })

    describe("Tax line data field", () => {
      let storeHeaders
      let region
      let product
      let salesChannel
      let shippingProfile

      beforeAll(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        shippingProfile = (
          await api.post(
            "/admin/shipping-profiles",
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const taxService = appContainer.resolve(Modules.TAX)
        await taxService.createTaxRegions([
          {
            country_code: "GB",
            provider_id: "tp_tax-data-provider_data-provider",
            default_tax_rate: {
              name: "GB Standard Rate",
              rate: 20,
              code: "GB_STD",
            },
          },
        ])

        region = (
          await api.post(
            "/admin/regions",
            { name: "GB", currency_code: "gbp", countries: ["gb"] },
            adminHeaders
          )
        ).data.region

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Test Product",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S"] }],
              variants: [
                {
                  title: "S",
                  manage_inventory: false,
                  options: { Size: "S" },
                  prices: [{ amount: 1000, currency_code: "gbp" }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "GB Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel
      })

      it("should persist provider data on cart line item tax lines", async () => {
        const cart = (
          await api.post(
            "/store/carts",
            {
              currency_code: "gbp",
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              shipping_address: {
                address_1: "1 Oxford Street",
                city: "London",
                country_code: "GB",
                postal_code: "W1D 1AN",
              },
              items: [
                { variant_id: product.variants[0].id, quantity: 1 },
              ],
            },
            storeHeaders
          )
        ).data.cart

        const response = await api.post(
          `/store/carts/${cart.id}/taxes`,
          {},
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].tax_lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "GB_STD",
              rate: 20,
              provider_id: "tax-data-provider",
              data: {
                state_rate: 4.0,
                county_rate: 3.0,
                city_rate: 1.9,
              },
            }),
          ])
        )
      })
    })
  },
})
