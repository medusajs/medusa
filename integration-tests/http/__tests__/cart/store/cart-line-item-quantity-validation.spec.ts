import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { medusaTshirtProduct } from "../../../__fixtures__/product"

jest.setTimeout(100000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

// HTTP-level coverage for the integer-quantity validation on store cart
// line items: fractional quantities must be rejected with a 400 before they
// can be coerced on store (https://github.com/medusajs/medusa/issues/16802).
medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let storeHeaders
    let region
    let product
    let salesChannel

    beforeAll(async () => {
      appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)
      const publishableKey = await generatePublishableKey(appContainer)
      storeHeaders = generateStoreHeaders({ publishableKey })

      const shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "default", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      region = (
        await api.post(
          "/admin/regions",
          {
            payment_providers: ["pp_system_default"],
            name: "US",
            currency_code: "usd",
            countries: ["us"],
          },
          adminHeaders
        )
      ).data.region

      product = (
        await api.post(
          "/admin/products",
          { ...medusaTshirtProduct, shipping_profile_id: shippingProfile.id },
          adminHeaders
        )
      ).data.product

      salesChannel = (
        await api.post(
          "/admin/sales-channels",
          { name: "Webshop", description: "channel" },
          adminHeaders
        )
      ).data.sales_channel
    })

    describe("Store cart line-item quantity validation", () => {
      it("rejects a fractional quantity when creating a cart", async () => {
        const { response } = await api
          .post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              items: [
                { variant_id: product.variants[0].id, quantity: 1.5 },
              ],
            },
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data.type).toEqual("invalid_data")
      })

      it("rejects a fractional quantity when adding a line item", async () => {
        const cart = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
            },
            storeHeaders
          )
        ).data.cart

        const { response } = await api
          .post(
            `/store/carts/${cart.id}/line-items`,
            { variant_id: product.variants[0].id, quantity: 0.5 },
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data.type).toEqual("invalid_data")
      })

      it("rejects a fractional quantity when updating a line item", async () => {
        const cart = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

        const itemId = cart.items[0].id

        const { response } = await api
          .post(
            `/store/carts/${cart.id}/line-items/${itemId}`,
            { quantity: 2.5 },
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data.type).toEqual("invalid_data")
      })

      it("still accepts integer quantities", async () => {
        const response = await api.post(
          `/store/carts`,
          {
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            region_id: region.id,
            items: [{ variant_id: product.variants[0].id, quantity: 2 }],
          },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].quantity).toEqual(2)
      })
    })
  },
})
