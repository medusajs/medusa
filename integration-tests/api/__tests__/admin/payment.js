const { medusaIntegrationTestRunner } = require("medusa-test-utils")
const { createAdminUser } = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")
const { ModuleRegistrationName } = require("@medusajs/modules-sdk")

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

let { simpleCustomerFactory, simplePaymentCollectionFactory } = {}

const createV1PaymentSetup = async (dbConnection, payCol, api) => {
  // create payment collection
  payCol = await simplePaymentCollectionFactory(dbConnection, {
    description: "paycol description",
    amount: 1000,
  })

  // create payment session
  const payColRes = await api.post(
    `/store/payment-collections/${payCol.id}/sessions`,
    {
      provider_id: "test-pay",
    }
  )

  // authorize payment session
  await api.post(
    `/store/payment-collections/${payCol.id}/sessions/batch/authorize`,
    {
      session_ids: payColRes.data.payment_collection.payment_sessions.map(
        ({ id }) => id
      ),
    }
  )

  // get payment collection
  const response = await api.get(
    `/admin/payment-collections/${payCol.id}`,
    adminHeaders
  )

  // return payment
  return response.data.payment_collection.payments[0]
}

medusaIntegrationTestRunner({
  // env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    let paymentService

    beforeAll(() => {
      ;({
        simplePaymentCollectionFactory,
      } = require("../../../factories/simple-payment-collection-factory"))
      ;({
        simpleCustomerFactory,
      } = require("../../../factories/simple-customer-factory"))
    })

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      paymentService = container.resolve(ModuleRegistrationName.PAYMENT)
    })

    describe("Admin Payments API", () => {
      let payCol

      beforeEach(async () => {
        await simpleCustomerFactory(dbConnection, {
          id: "customer",
          email: "test@customer.com",
        })
      })

      it("Captures an authorized payment", async () => {
        const payment = await breaking(
          async () => {
            const v1Payment = await createV1PaymentSetup(
              dbConnection,
              payCol,
              api
            )
            return v1Payment
          },
          async () => {
            const paymentCollection =
              await paymentService.createPaymentCollections({
                region_id: "test-region",
                amount: 1000,
                currency_code: "usd",
              })

            const paymentSession = await paymentService.createPaymentSession(
              paymentCollection.id,
              {
                provider_id: "pp_system_default",
                amount: 1000,
                currency_code: "usd",
                data: {},
              }
            )

            const payment = await paymentService.authorizePaymentSession(
              paymentSession.id,
              {}
            )

            return payment
          }
        )

        const response = await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            ...breaking(
              () => ({}),
              () => ({
                captures: [
                  expect.objectContaining({
                    id: expect.any(String),
                    amount: 1000,
                  }),
                ],
                refunds: [],
              })
            ),
            amount: 1000,
          })
        )
        expect(response.status).toEqual(200)
      })

      it("Refunds an captured payment", async () => {
        const payment = await breaking(
          async () => {
            const v1Payment = await createV1PaymentSetup(
              dbConnection,
              payCol,
              api
            )

            await api.post(
              `/admin/payments/${v1Payment.id}/capture`,
              undefined,
              adminHeaders
            )

            return v1Payment
          },
          async () => {
            const paymentCollection =
              await paymentService.createPaymentCollections({
                region_id: "test-region",
                amount: 1000,
                currency_code: "usd",
              })

            const paymentSession = await paymentService.createPaymentSession(
              paymentCollection.id,
              {
                provider_id: "pp_system_default",
                amount: 1000,
                currency_code: "usd",
                data: {},
              }
            )

            const payment = await paymentService.authorizePaymentSession(
              paymentSession.id,
              {}
            )

            await paymentService.capturePayment({
              payment_id: payment.id,
              amount: 1000,
            })

            return payment
          }
        )

        // refund
        const response = await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 500,
            ...breaking(
              () => ({
                // TODO: We should probably introduce this in V2 too
                reason: "return",
                note: "Do not like it",
              }),
              () => ({})
            ),
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        breaking(
          async () => {
            expect(response.data.refund).toEqual(
              expect.objectContaining({
                payment_id: payment.id,
                reason: "return",
                amount: 500,
              })
            )

            const savedPayment = await api.get(
              `/admin/payments/${payment.id}`,
              adminHeaders
            )

            expect(savedPayment.data.payment).toEqual(
              expect.objectContaining({
                amount_refunded: 500,
              })
            )
          },
          () => {
            expect(response.data.payment).toEqual(
              expect.objectContaining({
                id: payment.id,
                captured_at: expect.any(String),
                captures: [
                  expect.objectContaining({
                    id: expect.any(String),
                    amount: 1000,
                  }),
                ],
                refunds: [
                  expect.objectContaining({
                    id: expect.any(String),
                    amount: 500,
                  }),
                ],
                amount: 1000,
              })
            )
          }
        )
      })
    })
  },
})
