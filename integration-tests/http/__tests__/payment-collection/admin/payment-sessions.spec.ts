import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"
import { createOrderSeeder } from "../../fixtures/order"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let storeHeaders
    let storeHeadersWithCustomer
    beforeEach(async () => {
      const container = getContainer()
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, container)
      const result = await createAuthenticatedCustomer(api, storeHeaders, {
        first_name: "tony",
        last_name: "stark",
        email: "tony@stark-industries.com",
      })

      storeHeadersWithCustomer = {
        headers: {
          ...storeHeaders.headers,
          authorization: `Bearer ${result.jwt}`,
        },
      }
    })

    describe("POST /store/payment-collections/:id/payment-sessions", () => {
      let region
      let product
      let cart
      let shippingProfile
      let salesChannel

      beforeEach(async () => {
        region = (
          await api.post(
            "/admin/regions",
            {
              name: "United States",
              currency_code: "usd",
              countries: ["us"],
            },
            adminHeaders
          )
        ).data.region

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Web" },
            adminHeaders
          )
        ).data.sales_channel

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
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
                  prices: [
                    {
                      amount: 150,
                      currency_code: "usd",
                      rules: { region_id: region.id },
                    },
                  ],
                },
              ],
            }),
            adminHeaders
          )
        ).data.product
      })

      it("should create a session when the customer is a guest", async () => {
        cart = (
          await api.post(
            "/store/carts",
            {
              region_id: region.id,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              sales_channel_id: salesChannel.id,
            },
            storeHeaders
          )
        ).data.cart

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

        // Adding a second payment session to ensure only one session gets created
        const {
          data: { payment_collection },
        } = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        expect(payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            provider_id: "pp_system_default",
            status: "pending",
            amount: 150,
          }),
        ])
      })

      it("should create a session when the customer is authenticated", async () => {
        cart = (
          await api.post(
            "/store/carts",
            {
              region_id: region.id,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              sales_channel_id: salesChannel.id,
            },
            storeHeadersWithCustomer
          )
        ).data.cart

        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cart.id },
            storeHeadersWithCustomer
          )
        ).data.payment_collection

        const {
          data: { payment_collection },
        } = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeadersWithCustomer
        )

        // TODO: This does not create an account holder as the system payment provider does not support it
        // Create a custom system payment provider that supports it or add account holder support to the system payment provider
        // This test will pass through the account holder creation step though, which is what the test is checking for
        expect(payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            provider_id: "pp_system_default",
            status: "pending",
            amount: 150,
          }),
        ])
      })
    })

    describe("POST /admin/payment-collections/:id/payment-sessions", () => {
      let order

      beforeEach(async () => {
        const container = getContainer()
        const result = await createOrderSeeder({ api, container })
        order = result.order
      })

      it("should create a payment session via the admin endpoint", async () => {
        const paymentCollection = (
          await api.post(
            "/admin/payment-collections",
            { order_id: order.id, amount: 100 },
            adminHeaders
          )
        ).data.payment_collection

        const {
          data: { payment_collection },
        } = await api.post(
          `/admin/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          adminHeaders
        )

        expect(payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            provider_id: "pp_system_default",
            status: "pending",
            amount: 100,
          }),
        ])
      })
    })
  },
})
