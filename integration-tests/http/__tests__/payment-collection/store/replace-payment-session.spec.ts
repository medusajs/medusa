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

const providerId = "pp_system_default"
// pp_pending-auth_pending-auth returns `pending` from authorizePayment unless
// the session data has `payment_received` set.
const pendingAuthProviderId = "pp_pending-auth_pending-auth"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let storeHeaders
    let region
    let salesChannel
    let product

    const initPaymentSession = async (
      paymentCollectionId: string,
      provider = providerId
    ) => {
      return (
        await api.post(
          `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
          { provider_id: provider },
          storeHeaders
        )
      ).data.payment_collection
    }

    const createPaymentCollection = async () => {
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

      return (
        await api.post(
          "/store/payment-collections",
          { cart_id: cart.id },
          storeHeaders
        )
      ).data.payment_collection
    }

    const createAuthorizedPayment = async () => {
      const paymentCollection = await createPaymentCollection()

      const {
        payment_sessions: [paymentSession],
      } = await initPaymentSession(paymentCollection.id)

      const payment = await getContainer()
        .resolve(Modules.PAYMENT)
        .authorizePaymentSession(paymentSession.id, {})

      return { paymentCollection, paymentSession, payment }
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
            payment_providers: [providerId, pendingAuthProviderId],
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

    describe("POST /store/payment-collections/:id/payment-sessions (replacing a session)", () => {
      it("rejects replacing a session with an authorized payment", async () => {
        const { paymentCollection, paymentSession } =
          await createAuthorizedPayment()

        const error = await initPaymentSession(paymentCollection.id).catch(
          (e) => e
        )

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Payment session with id: ${paymentSession.id} can't be replaced because it has an authorized or captured payment`
        )

        const sessions = await getContainer()
          .resolve(Modules.PAYMENT)
          .listPaymentSessions({ payment_collection_id: paymentCollection.id })
        expect(sessions).toEqual([
          expect.objectContaining({ id: paymentSession.id }),
        ])
      })

      it("rejects replacing a session with a captured payment", async () => {
        const { paymentCollection, payment } = await createAuthorizedPayment()

        await getContainer()
          .resolve(Modules.PAYMENT)
          .capturePayment({ payment_id: payment.id })

        const error = await initPaymentSession(paymentCollection.id).catch(
          (e) => e
        )

        expect(error.response.status).toEqual(400)
      })

      it("rejects replacing a session with a partially refunded payment", async () => {
        const { paymentCollection, payment } = await createAuthorizedPayment()
        const paymentModule = getContainer().resolve(Modules.PAYMENT)

        await paymentModule.capturePayment({ payment_id: payment.id })
        await paymentModule.refundPayment({
          payment_id: payment.id,
          amount: 50,
        })

        const error = await initPaymentSession(paymentCollection.id).catch(
          (e) => e
        )

        expect(error.response.status).toEqual(400)
      })

      it("rejects replacing a session whose authorization is pending", async () => {
        const paymentCollection = await createPaymentCollection()

        const {
          payment_sessions: [paymentSession],
        } = await initPaymentSession(
          paymentCollection.id,
          pendingAuthProviderId
        )

        await getContainer()
          .resolve(Modules.PAYMENT)
          .authorizePaymentSession(paymentSession.id, {})

        const error = await initPaymentSession(paymentCollection.id).catch(
          (e) => e
        )

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Payment session with id: ${paymentSession.id} can't be replaced because its status is pending_authorization`
        )
      })

      it("replaces a session with a fully refunded payment", async () => {
        const { paymentCollection, paymentSession, payment } =
          await createAuthorizedPayment()
        const paymentModule = getContainer().resolve(Modules.PAYMENT)

        await paymentModule.capturePayment({ payment_id: payment.id })
        await paymentModule.refundPayment({
          payment_id: payment.id,
          amount: 150,
        })

        const { payment_sessions } = await initPaymentSession(
          paymentCollection.id
        )

        expect(payment_sessions).toEqual([
          expect.objectContaining({
            id: expect.not.stringMatching(paymentSession.id),
          }),
        ])
      })

      it("replaces a session with a canceled payment", async () => {
        const { paymentCollection, paymentSession, payment } =
          await createAuthorizedPayment()

        await getContainer().resolve(Modules.PAYMENT).cancelPayment(payment.id)

        const { payment_sessions } = await initPaymentSession(
          paymentCollection.id
        )

        expect(payment_sessions).toEqual([
          expect.objectContaining({
            id: expect.not.stringMatching(paymentSession.id),
          }),
        ])
      })

      it("replaces a pending session", async () => {
        const paymentCollection = await createPaymentCollection()

        const {
          payment_sessions: [paymentSession],
        } = await initPaymentSession(paymentCollection.id)

        const { payment_sessions } = await initPaymentSession(
          paymentCollection.id
        )

        expect(payment_sessions).toEqual([
          expect.objectContaining({
            id: expect.not.stringMatching(paymentSession.id),
          }),
        ])
      })
    })
  },
})
