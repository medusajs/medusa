import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(60000)

// pp_pending-auth_pending-auth echoes the session data from updatePayment, and only
// authorizes a session whose top-level `data.payment_received` is set.
const providerId = "pp_pending-auth_pending-auth"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let storeHeaders
    let region
    let salesChannel
    let product

    const createPaymentSession = async () => {
      const cart = (
        await api.post(
          "/store/carts",
          {
            region_id: region.id,
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

      const {
        payment_collection: { payment_sessions },
      } = (
        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: providerId },
          storeHeaders
        )
      ).data

      return { paymentCollection, paymentSession: payment_sessions[0] }
    }

    beforeEach(async () => {
      const container = getContainer()
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, container)

      region = (
        await api.post(
          "/admin/regions",
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us"],
            payment_providers: [providerId],
          },
          adminHeaders
        )
      ).data.region

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

    describe("POST /store/payment-collections/:id/payment-sessions/:session_id", () => {
      it("stores the client data under data.client", async () => {
        const { paymentCollection, paymentSession } =
          await createPaymentSession()

        const { data } = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions/${paymentSession.id}`,
          { client_data: { payment_method: { type: "scheme" } } },
          storeHeaders
        )

        expect(data.payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            id: paymentSession.id,
            provider_id: providerId,
            status: "pending",
            amount: 150,
            data: {
              ...paymentSession.data,
              client: { payment_method: { type: "scheme" } },
            },
          }),
        ])
      })

      it("merges into the previous client data and clears properties set to null", async () => {
        const { paymentCollection, paymentSession } =
          await createPaymentSession()
        const url = `/store/payment-collections/${paymentCollection.id}/payment-sessions/${paymentSession.id}`

        await api.post(
          url,
          {
            client_data: {
              payment_method: { type: "scheme" },
              browser_info: { language: "en-US" },
            },
          },
          storeHeaders
        )
        const { data } = await api.post(
          url,
          {
            client_data: {
              payment_method: null,
              details: { threeDSResult: "abc" },
            },
          },
          storeHeaders
        )

        expect(data.payment_collection.payment_sessions[0].data.client).toEqual(
          {
            payment_method: null,
            browser_info: { language: "en-US" },
            details: { threeDSResult: "abc" },
          }
        )
      })

      it("doesn't let the client overwrite data set by the provider", async () => {
        const { paymentCollection, paymentSession } =
          await createPaymentSession()

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions/${paymentSession.id}`,
          { client_data: { payment_received: true } },
          storeHeaders
        )

        const paymentModule = getContainer().resolve(Modules.PAYMENT)
        const payment = await paymentModule.authorizePaymentSession(
          paymentSession.id,
          {}
        )
        const session = await paymentModule.retrievePaymentSession(
          paymentSession.id
        )

        expect(payment).toBeNull()
        expect(session).toEqual(
          expect.objectContaining({
            status: "pending_authorization",
            data: expect.objectContaining({
              client: { payment_received: true },
            }),
          })
        )
        expect(session.data).not.toHaveProperty("payment_received")
      })

      it("rejects updating a session that is being authorized", async () => {
        const { paymentCollection, paymentSession } =
          await createPaymentSession()

        await getContainer()
          .resolve(Modules.PAYMENT)
          .authorizePaymentSession(paymentSession.id, {})

        const error = await api
          .post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions/${paymentSession.id}`,
            { client_data: { payment_method: { type: "scheme" } } },
            storeHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Payment session with id: ${paymentSession.id} can't be updated because its status is pending_authorization`
        )
      })

      it("rejects a session that belongs to another payment collection", async () => {
        const { paymentSession } = await createPaymentSession()
        const { paymentCollection: otherCollection } =
          await createPaymentSession()

        const error = await api
          .post(
            `/store/payment-collections/${otherCollection.id}/payment-sessions/${paymentSession.id}`,
            { client_data: { payment_method: { type: "scheme" } } },
            storeHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          `Payment session with id: ${paymentSession.id} was not found in payment collection ${otherCollection.id}`
        )
      })

      it("rejects a body with properties other than data", async () => {
        const { paymentCollection, paymentSession } =
          await createPaymentSession()

        const error = await api
          .post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions/${paymentSession.id}`,
            { client_data: {}, status: "authorized" },
            storeHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })
    })
  },
})
