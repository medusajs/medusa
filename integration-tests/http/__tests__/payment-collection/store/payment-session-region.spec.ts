import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let storeHeaders
    let salesChannel
    let product
    let regionWithProvider
    let regionWithoutProvider

    const createRegion = async (name, countries, paymentProviders) => {
      return (
        await api.post(
          "/admin/regions",
          {
            name,
            currency_code: "usd",
            countries,
            payment_providers: paymentProviders,
          },
          adminHeaders
        )
      ).data.region
    }

    const createPaymentCollection = async (regionId) => {
      const cart = (
        await api.post(
          "/store/carts",
          {
            region_id: regionId,
            sales_channel_id: salesChannel.id,
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
          },
          storeHeaders
        )
      ).data.cart

      const paymentCollection = (
        await api.post(
          "/store/payment-collections",
          { cart_id: cart.id },
          storeHeaders
        )
      ).data.payment_collection

      return { cart, paymentCollection }
    }

    beforeEach(async () => {
      const container = getContainer()
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, container)

      regionWithProvider = await createRegion(
        "With provider",
        ["us"],
        ["pp_system_default"]
      )
      regionWithoutProvider = await createRegion("Without provider", ["ca"], [])

      salesChannel = (
        await api.post("/admin/sales-channels", { name: "Web" }, adminHeaders)
      ).data.sales_channel

      const shippingProfile = (
        await api.post(
          "/admin/shipping-profiles",
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      product = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "test",
            status: "published",
            shipping_profile_id: shippingProfile.id,
            variants: [
              {
                title: "Test variant",
                manage_inventory: false,
                prices: [{ amount: 150, currency_code: "usd" }],
              },
            ],
          }),
          adminHeaders
        )
      ).data.product
    })

    describe("POST /store/payment-collections/:id/payment-sessions", () => {
      it("creates a session when the provider is enabled in the cart's region", async () => {
        const { paymentCollection } = await createPaymentCollection(
          regionWithProvider.id
        )

        const { data } = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        expect(data.payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            provider_id: "pp_system_default",
            status: "pending",
          }),
        ])
      })

      it("rejects a provider that is not enabled in the cart's region", async () => {
        const { paymentCollection } = await createPaymentCollection(
          regionWithoutProvider.id
        )

        const error = await api
          .post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Payment provider pp_system_default is not enabled in the cart's region ${regionWithoutProvider.id}.`
        )
      })

      it("rejects completing a cart whose session provider was disabled in its region", async () => {
        const { cart, paymentCollection } = await createPaymentCollection(
          regionWithProvider.id
        )

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        await api.post(
          `/admin/regions/${regionWithProvider.id}`,
          { payment_providers: [] },
          adminHeaders
        )

        const error = await api
          .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Payment provider pp_system_default is not enabled in the cart's region ${regionWithProvider.id}.`
        )
      })
    })
  },
})
