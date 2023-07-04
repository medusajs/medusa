const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

const {
  simplePaymentCollectionFactory,
} = require("../../factories/simple-payment-collection-factory")
const {
  simpleCustomerFactory,
} = require("../../factories/simple-customer-factory")

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/payment", () => {
  let medusaProcess
  let dbConnection

  let payCol = null
  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/payment-collections/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await simpleCustomerFactory(dbConnection, {
        id: "customer",
        email: "test@customer.com",
      })

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("Captures an authorized payment", async () => {
      const api = useApi()

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

      expect(paymentCollections.data.payment_collection.payments).toHaveLength(
        1
      )

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
      const api = useApi()

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
})
