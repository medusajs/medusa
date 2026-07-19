import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ProductStatus } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("Promotions: maximum discount amount", () => {
      let appContainer
      let storeHeaders
      let region
      let salesChannel
      let product

      beforeAll(async () => {
        appContainer = getContainer()

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await createAdminUser(dbConnection, adminHeaders, appContainer)

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Medusa T-Shirt",
              status: ProductStatus.PUBLISHED,
              options: [{ title: "size", values: ["one-size"] }],
              variants: [
                {
                  title: "One size",
                  manage_inventory: false,
                  prices: [{ currency_code: "usd", amount: 100 }],
                  options: { size: "one-size" },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        await dbUtils.snapshot()
      })

      it("caps a percentage discount at the maximum amount", async () => {
        const response = await api.post(
          "/admin/promotions",
          {
            code: "TEN_PERCENT_MAX_15",
            type: "standard",
            status: "active",
            is_automatic: true,
            application_method: {
              target_type: "order",
              type: "percentage",
              currency_code: "usd",
              value: 10,
              max_amount: 15,
            },
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.promotion.application_method).toEqual(
          expect.objectContaining({
            type: "percentage",
            value: 10,
            max_amount: 15,
          })
        )

        // 10% of 100 = 10, below the cap of 15
        const cart = (
          await api.post(
            "/store/carts",
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              email: "test@medusajs.com",
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

        expect(cart).toEqual(
          expect.objectContaining({
            item_subtotal: 100,
            discount_total: 10,
            total: 90,
          })
        )

        // 10% of 300 = 30, capped at 15
        const updatedCart = (
          await api.post(
            `/store/carts/${cart.id}/line-items`,
            { variant_id: product.variants[0].id, quantity: 2 },
            storeHeaders
          )
        ).data.cart

        expect(updatedCart).toEqual(
          expect.objectContaining({
            item_subtotal: 300,
            discount_total: 15,
            total: 285,
            items: [
              expect.objectContaining({
                adjustments: [
                  expect.objectContaining({
                    code: "TEN_PERCENT_MAX_15",
                    amount: 15,
                  }),
                ],
              }),
            ],
          })
        )
      })

      it("throws when max_amount is set on a fixed application method", async () => {
        const { response } = await api
          .post(
            "/admin/promotions",
            {
              code: "FIXED_WITH_CAP",
              type: "standard",
              status: "active",
              application_method: {
                target_type: "order",
                type: "fixed",
                currency_code: "usd",
                value: 10,
                max_amount: 15,
              },
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data.message).toEqual(
          "application_method.max_amount can only be set when application_method.type is 'percentage'"
        )
      })

      it("throws when max_amount is set without a currency code", async () => {
        const { response } = await api
          .post(
            "/admin/promotions",
            {
              code: "PERCENTAGE_CAP_NO_CURRENCY",
              type: "standard",
              status: "active",
              application_method: {
                target_type: "order",
                type: "percentage",
                value: 10,
                max_amount: 15,
              },
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data.message).toEqual(
          "application_method.currency_code is required when application_method.max_amount is set"
        )
      })
    })
  },
})
