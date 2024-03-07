const { medusaIntegrationTestRunner } = require("medusa-test-utils")
const { createAdminUser } = require("../../../helpers/create-admin-user")

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

let { simpleCustomerFactory, simplePaymentCollectionFactory } = {}

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_PRODUCT_CATEGORIES: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeAll(() => {
      ;({
        simplePaymentCollectionFactory,
      } = require("../../../factories/simple-payment-collection-factory"))
      ;({
        simpleCustomerFactory,
      } = require("../../../factories/simple-customer-factory"))
    })

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("POST /admin/payment-collections/:id", () => {
      let payCol

      beforeEach(async () => {
        await simpleCustomerFactory(dbConnection, {
          id: "customer",
          email: "test@customer.com",
        })

        payCol = await simplePaymentCollectionFactory(dbConnection, {
          description: "paycol description",
          amount: 10000,
        })
      })

      it("Captures an authorized payment", async () => {
        // create payment session
        const payColRes = await api.post(
          `/store/payment-collections/${payCol.id}/sessions`,
          {
            provider_id: "test-pay",
          }
        )
        await api.post(
          `/store/payment-collections/${payCol.id}/sessions/batch/authorize`,
          {
            session_ids: payColRes.data.payment_collection.payment_sessions.map(
              ({ id }) => id
            ),
          }
        )

        const paymentCollections = await api.get(
          `/admin/payment-collections/${payCol.id}`,
          adminHeaders
        )

        expect(
          paymentCollections.data.payment_collection.payments
        ).toHaveLength(1)

        const payment = paymentCollections.data.payment_collection.payments[0]

        expect(payment.captured_at).toBe(null)

        const response = await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            amount: 10000,
          })
        )
        expect(response.status).toEqual(200)
      })

      it("Refunds an captured payment", async () => {
        // create payment session
        const payColRes = await api.post(
          `/store/payment-collections/${payCol.id}/sessions`,
          {
            provider_id: "test-pay",
          }
        )
        await api.post(
          `/store/payment-collections/${payCol.id}/sessions/batch/authorize`,
          {
            session_ids: payColRes.data.payment_collection.payment_sessions.map(
              ({ id }) => id
            ),
          }
        )

        const paymentCollections = await api.get(
          `/admin/payment-collections/${payCol.id}`,
          adminHeaders
        )
        const payment = paymentCollections.data.payment_collection.payments[0]
        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        // refund
        const response = await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 5000,
            reason: "return",
            note: "Do not like it",
          },
          adminHeaders
        )

        expect(response.data.refund).toEqual(
          expect.objectContaining({
            payment_id: payment.id,
            reason: "return",
            amount: 5000,
          })
        )
        expect(response.status).toEqual(200)

        const savedPayment = await api.get(
          `/admin/payments/${payment.id}`,
          adminHeaders
        )

        expect(savedPayment.data.payment).toEqual(
          expect.objectContaining({
            amount_refunded: 5000,
          })
        )
      })
    })
  },
})
